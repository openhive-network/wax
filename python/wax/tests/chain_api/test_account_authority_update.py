from __future__ import annotations

import random
from typing import TYPE_CHECKING, Final

import pytest

from wax import create_hive_chain
from wax.complex_operations.account_update import AccountAuthorityUpdateOperation
from wax.complex_operations.role_classes.hive_authority.hive_role_authority_definition import (
    DEFAULT_ACCOUNT_OR_KEY_WEIGHT,
)
from wax.exceptions import (
    AuthorityCannotBeSatisfiedError,
    HiveMaxAuthorityMembershipExceededError,
    WaxAssertionError,
)
from wax.exceptions.validation_errors import NoAuthorityOperationGeneratedError
from wax.models.authority import WaxAuthority

if TYPE_CHECKING:
    from wax import IHiveChainInterface
    from wax.complex_operations.role_classes.hive_authority.hive_roles import (
        ActiveRoleName,
        OwnerRoleName,
        PostingRoleName,
    )

POSSIBLE_ROLE_TYPES: Final[list[ActiveRoleName | OwnerRoleName | PostingRoleName]] = [
    "active",
    "owner",
    "posting",
]


def generate_random_public_key(chain: IHiveChainInterface) -> str:
    return chain.suggest_brain_key().associated_public_key


def get_public_keys(num: int, chain: IHiveChainInterface) -> list[str]:
    return [generate_random_public_key(chain) for _ in range(num)]


def generate_account_names(num: int) -> list[str]:
    return [f"alice-{n}" for n in range(num)]


def create_mixed_entries(start: int, limit: int, remote_chain: IHiveChainInterface) -> dict[str, list[str]]:
    account_auths_number = random.randint(start, limit)
    account_names = generate_account_names(account_auths_number)
    public_keys = get_public_keys(limit - account_auths_number, remote_chain)

    return {
        "account_names": account_names,
        "public_keys": public_keys,
        "all_entries": account_names + public_keys,
    }


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths", "mixed"])
@pytest.mark.parametrize("entry", [1, 2, 4, 8, 16, 32, 40])
@pytest.mark.describe("Should be able to create simple account authority update operation for hive.fund")
async def test_add_entries_to_account_authority_update_operation(
    remote_chain: IHiveChainInterface, role_type: str, auths_type: str, entry: int
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")

    role = getattr(account_update.roles, role_type)

    if auths_type == "key_auths":
        all_entries = get_public_keys(entry, remote_chain)
    elif auths_type == "account_auths":
        all_entries = generate_account_names(entry)
    elif entry == 1:
        all_entries = random.choice([get_public_keys(entry, remote_chain), "alice-0"])  # type: ignore[list-item]
    else:
        entries = create_mixed_entries(1, entry - 1, remote_chain)
        all_entries = entries["all_entries"]

    for e in all_entries:
        role.add(account_or_key=e, weight=3)
    assert account_update.is_effective

    transaction = await remote_chain.create_transaction()
    transaction.push_operation(account_update)

    operations = transaction.to_dict()["operations"]
    assert len(operations) == 1
    assert operations[0]["type"] == "account_update2_operation"
    assert operations[0]["value"]["account"] == "hive.fund"

    authority = operations[0]["value"][role_type]

    if auths_type == "mixed":
        if entry == 1:
            assert any(len(authority.get(k, [])) == len(all_entries) for k in ["key_auths", "account_auths"])
            expected_entries = {(e, 3) for e in all_entries}
            entries_in_op = {tuple(i) for k in ["key_auths", "account_auths"] for i in authority.get(k, [])}
            assert entries_in_op == expected_entries, "Auths do not match expected values for mixed type"
        else:
            assert len(authority.get("key_auths", [])) == len(entries["public_keys"])
            assert len(authority.get("account_auths", [])) == len(entries["account_names"])

            expected_keys = {(k, 3) for k in entries["public_keys"]}
            expected_accounts = {(a, 3) for a in entries["account_names"]}

            keys_in_op = {tuple(k) for k in authority.get("key_auths", [])}
            accounts_auth_in_op = {tuple(a) for a in authority.get("account_auths", [])}

            assert keys_in_op == expected_keys, "Key auths do not match expected values"
            assert accounts_auth_in_op == expected_accounts, "Account auths do not match expected values"


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths", "mixed"])
async def test_account_authority_update_exceeded_auth_limit(
    remote_chain: IHiveChainInterface, role_type: str, auths_type: str
) -> None:
    exceeded_auth_limit: Final[int] = 41
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    if auths_type == "key_auths":
        entries = get_public_keys(exceeded_auth_limit, remote_chain)
    elif auths_type == "account_auths":
        entries = generate_account_names(exceeded_auth_limit)
    else:
        entries = create_mixed_entries(1, exceeded_auth_limit, remote_chain)["all_entries"]

    for entry in entries:
        role.add(account_or_key=entry, weight=3)

    transaction = await remote_chain.create_transaction()

    with pytest.raises(HiveMaxAuthorityMembershipExceededError) as error:
        transaction.push_operation(account_update)

    assert error.value.message == f"Authority membership exceeds. Max: 40, current: {exceeded_auth_limit}"


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths"])
async def test_account_authority_update_under_weight_threshold_limit(
    remote_chain: IHiveChainInterface, role_type: str, auths_type: str
) -> None:
    weight_threshold: Final[int] = 0
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    entries = get_public_keys(1, remote_chain) if auths_type == "key_auths" else generate_account_names(1)

    for entry in entries:
        role.add(account_or_key=entry, weight=weight_threshold)

    transaction = await remote_chain.create_transaction()

    with pytest.raises(AuthorityCannotBeSatisfiedError) as error:
        transaction.push_operation(account_update)

    assert error.value.message == f"{role_type} authority cannot be satisfied due to insufficient weight"


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
async def test_account_authority_update_set_threshold(remote_chain: IHiveChainInterface, role_type: str) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    assert (
        role.authority.weight_threshold == DEFAULT_ACCOUNT_OR_KEY_WEIGHT
    ), f"Expected default threshold: {DEFAULT_ACCOUNT_OR_KEY_WEIGHT}, got: {role.authority.weight_threshold}"

    new_threshold: Final[int] = random.randint(1, 1000)
    role.set_threshold(threshold=new_threshold)

    assert (
        role.authority.weight_threshold == new_threshold
    ), f"Threshold not updated correctly. Expected: {new_threshold}, got: {role.authority.weight_threshold}"


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
async def test_account_authority_update_clear_authority(remote_chain: IHiveChainInterface, role_type: str) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "initminer")
    role = getattr(account_update.roles, role_type)
    role.add(account_or_key="alice", weight=1)

    assert len(role.authority.key_auths) > 0
    assert len(role.authority.account_auths) > 0

    role.clear()
    assert role.authority == WaxAuthority(weight_threshold=1)

    transaction = await remote_chain.create_transaction()
    transaction.push_operation(account_update)

    operations = transaction.to_dict()["operations"]
    assert len(operations) == 1
    assert operations[0]["type"] == "account_update2_operation"
    assert operations[0]["value"]["account"] == "initminer"
    assert operations[0]["value"][role_type] == {
        "weight_threshold": 1,
        "account_auths": [],
        "key_auths": [],
    }  # default authority


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
async def test_account_authority_update_reset_role(remote_chain: IHiveChainInterface, role_type: str) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "initminer")
    role = getattr(account_update.roles, role_type)

    original_key_auths = len(role.authority.key_auths)
    original_account_auths = len(role.authority.account_auths)

    extra_keys = get_public_keys(3, remote_chain)
    extra_account_auths = generate_account_names(3)
    for entry in extra_keys + extra_account_auths:
        role.add(account_or_key=entry)

    assert len(role.authority.key_auths) == original_key_auths + len(extra_keys)
    assert len(role.authority.account_auths) == original_account_auths + len(extra_account_auths)

    role.reset()

    transaction = await remote_chain.create_transaction()
    with pytest.raises(NoAuthorityOperationGeneratedError) as error:
        transaction.push_operation(account_update)
    assert error.value.message == "No operations updating account authority generated."


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths"])
@pytest.mark.parametrize("entries_number", [1, 2, 4, 8, 16, 32, 40])
async def test_account_authority_update_remove_role(
    remote_chain: IHiveChainInterface,
    role_type: str,
    auths_type: str,
    entries_number: int,
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    entries = (
        get_public_keys(entries_number, remote_chain)
        if auths_type == "key_auths"
        else generate_account_names(entries_number)
    )
    for entry in entries:
        role.add(account_or_key=entry)

    entry_to_remove: Final[str] = entries[0]
    role.remove(account_or_key=entry_to_remove)
    assert entry_to_remove not in getattr(role.authority, auths_type)


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths"])
@pytest.mark.parametrize("entries_number", [1, 2, 4, 8, 16, 32, 40])
async def test_account_authority_update_replace_entry_in_role(
    remote_chain: IHiveChainInterface,
    role_type: str,
    auths_type: str,
    entries_number: int,
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    entries = (
        get_public_keys(entries_number, remote_chain)
        if auths_type == "key_auths"
        else generate_account_names(entries_number)
    )
    for entry in entries:
        role.add(account_or_key=entry)

    entry_to_replace: Final[str] = entries[0]
    new_entry = generate_random_public_key(remote_chain) if auths_type == "key_auths" else "new-account"
    role.replace(account_or_key=entries[0], new_account_or_key=new_entry, weight=1)

    assert entry_to_replace not in getattr(role.authority, auths_type)
    assert new_entry in getattr(role.authority, auths_type)


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths"])
@pytest.mark.parametrize("weight", [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
async def test_account_authority_update_replace_entry_threshold_in_role(
    remote_chain: IHiveChainInterface, role_type: str, auths_type: str, weight: int
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "initminer")
    role = getattr(account_update.roles, role_type)

    entry = next(iter(role.authority.key_auths)) if auths_type == "key_auths" else generate_account_names(1)[0]

    role.add(account_or_key=entry)
    role.replace(account_or_key=entry, new_account_or_key=entry, weight=weight)

    transaction = await remote_chain.create_transaction()
    transaction.push_operation(account_update)

    operation = transaction.to_dict()["operations"][0]
    authority = operation["value"][role_type][auths_type]

    assert operation["type"] == "account_update2_operation"
    assert operation["value"]["account"] == "initminer"
    assert authority == [[entry, weight]]


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths"])
@pytest.mark.parametrize("weight", [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
async def test_account_authority_update_replace_entry_type_to_another_one(
    remote_chain: IHiveChainInterface, role_type: str, auths_type: str, weight: int
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    if auths_type == "key_auths":
        entry = get_public_keys(1, remote_chain)[0]
        new_entry = generate_account_names(1)[0]
    else:
        entry = generate_account_names(1)[0]
        new_entry = get_public_keys(1, remote_chain)[0]

    new_auths_type = "account_auths" if auths_type == "key_auths" else "key_auths"

    role.add(account_or_key=entry, weight=weight)
    assert entry in getattr(role.authority, auths_type)

    role.replace(account_or_key=entry, new_account_or_key=new_entry, weight=weight)
    assert len(getattr(role.authority, auths_type)) == 0
    assert entry not in getattr(role.authority, new_auths_type)
    assert new_entry in getattr(role.authority, new_auths_type)
    assert getattr(role.authority, new_auths_type).get(new_entry) == weight

    transaction = await remote_chain.create_transaction()
    transaction.push_operation(account_update)

    operation = transaction.to_dict()["operations"][0]
    authority = operation["value"][role_type][new_auths_type]

    assert operation["type"] == "account_update2_operation"
    assert operation["value"]["account"] == "hive.fund"
    assert authority == [[new_entry, weight]]


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
@pytest.mark.parametrize("auths_type", ["key_auths", "account_auths"])
@pytest.mark.parametrize("weight", [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
async def test_account_authority_update_role_has_a_entry(
    remote_chain: IHiveChainInterface, role_type: str, auths_type: str, weight: int
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)

    entry = get_public_keys(1, remote_chain)[0] if auths_type == "key_auths" else generate_account_names(1)[0]
    role.add(account_or_key=entry, weight=weight)

    assert role.has(account_or_key=entry, weight=weight)
    assert entry in getattr(role.authority, auths_type)
    assert getattr(role.authority, auths_type).get(entry) == weight

    transaction = await remote_chain.create_transaction()
    transaction.push_operation(account_update)

    operation = transaction.to_dict()["operations"][0]
    authority = operation["value"][role_type][auths_type]

    assert operation["type"] == "account_update2_operation"
    assert operation["value"]["account"] == "hive.fund"
    assert authority == [[entry, weight]]


@pytest.mark.parametrize("role_type", POSSIBLE_ROLE_TYPES)
async def test_account_authority_update_empty_role_entry(remote_chain: IHiveChainInterface, role_type: str) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "hive.fund")
    role = getattr(account_update.roles, role_type)
    assert not role.has(account_or_key="doesnt-existing-entry")


async def test_account_authority_update_enforce_owner_role(
    remote_chain: IHiveChainInterface,
) -> None:
    account_update = await AccountAuthorityUpdateOperation.create_for(remote_chain, "guest4test")

    account_update.roles.active.add(account_or_key="guest4test1")

    account_update.enforce_owner_role_authorisation()

    transaction = await remote_chain.create_transaction()
    transaction.push_operation(account_update)

    operation = transaction.to_dict()["operations"][0]
    # test owner authority is present in the operation - it should be due to enforcement
    owner_authority = operation["value"]["owner"]

    assert len(owner_authority["key_auths"]) > 0


@pytest.mark.describe("Expecting WaxAssertionError to be caught")
async def test_catching_exception_catching_during_account_update_finalization() -> None:
    remote_chain = create_hive_chain()
    transaction = remote_chain.create_transaction_with_tapos(tapos_block_id="0")

    wax_account_authority_update_op = await AccountAuthorityUpdateOperation.create_for(remote_chain, "guest4test1")
    # Incorrect memo key below to trigger WaxAssertionError during finalization
    wax_account_authority_update_op.roles.memo.set("STM56UB7G2kab5br1eVNVxNfKcwTA1c5pHksZ8WAU52qM8J2538Uw")
    with pytest.raises(WaxAssertionError):
        transaction.push_operation(wax_account_authority_update_op)  # Error
