from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TYPE_CHECKING, Final, Iterable, Iterator, Literal

from wax._private.core.not_yet_initialized import NotYetInitialized
from wax.complex_operations.role_classes.hive_authority.hive_role_authority_definition import (
    HiveRoleAuthorityDefinition,
)
from wax.complex_operations.role_classes.hive_authority.hive_role_memo_key import HiveRoleMemoKeyDefinition
from wax.complex_operations.role_classes.hive_authority.hive_roles import (
    ActiveRoleName,
    HiveRoles,
    OwnerRoleName,
    PostingRoleName,
)
from wax.complex_operations.role_classes.role_category_base import RoleCategoryBase
from wax.exceptions import WaxError
from wax.exceptions.chain_errors import (
    AuthorityCannotBeSatisfiedError,
    HiveMaxAuthorityMembershipExceededError,
    HiveTempAccountUsedError,
)
from wax.proto.operations import account_update2

if TYPE_CHECKING:
    from wax._private.operation_base import ConvertedToProtoOperation
    from wax.interfaces import IAuthorityDataProvider, IWaxBaseInterface
    from wax.models.authority import WaxAuthority
    from wax.models.basic import AccountName


NULL_AUTH_SIZE: Final[int] = 0
HiveAccountCategoryName = Literal["hive"]


class HiveAccountCategory(RoleCategoryBase[HiveRoles]):
    """
    Class representing the hive account category. It contains all necessary authorities for the hive account.

    Attributes:
        account (AccountName): Account name.
        authorities (HiveRoles): Hive roles.
        hive_max_authority_membership (int): Maximum authority membership.

    Notice:
        Trying to access the attributes before calling the `init` method will raise an assertion error.

    Currently available roles in the hive account category:
        - active
        - owner
        - posting
        - memo
    """

    def __init__(self) -> None:
        super().__init__()
        self._account: AccountName | NotYetInitialized = NotYetInitialized()
        self._HIVE_MAX_AUTHORITY_MEMBERSHIP: int | NotYetInitialized = NotYetInitialized()
        self._authorities: HiveRoles | NotYetInitialized = NotYetInitialized()

    @property
    def category(self) -> HiveAccountCategoryName:
        return "hive"

    @property
    def account(self) -> AccountName:
        return NotYetInitialized.ensure_is_attribute_initialized(self._account)

    @property
    def authorities(self) -> HiveRoles:
        return NotYetInitialized.ensure_is_attribute_initialized(self._authorities)

    @property
    def hive_max_authority_membership(self) -> int:
        return NotYetInitialized.ensure_is_attribute_initialized(self._HIVE_MAX_AUTHORITY_MEMBERSHIP)

    @property
    def changed(self) -> bool:
        return (
            self.authorities.active.changed
            or self.authorities.owner.changed
            or self.authorities.posting.changed
            or self.authorities.memo.changed
        )

    def __iter__(
        self,
    ) -> Iterator[
        HiveRoleAuthorityDefinition[ActiveRoleName | OwnerRoleName | PostingRoleName] | HiveRoleMemoKeyDefinition
    ]:
        return iter(self.authorities.__dict__.values())

    async def init(
        self,
        api: IWaxBaseInterface,
        account_name: AccountName,
        provider: IAuthorityDataProvider,
    ) -> None:
        """
        Initializes the hive account category.

        Function retrieves all necessary authorities from the chain and initializes them.

        Raises:
            HiveTempAccountUsedError: When trying to edit a temporary account.
            AccountNotFoundError: When the account is not found on the chain.
            AssertionError: When the chain config is not reachable.
        """

        def raise_cannot_update_owner_error() -> None:
            raise WaxError("Owner authority cannot be updated due to owner authority update limit - twice an hour")

        def check_owner_time_diff(time: datetime) -> bool:
            return datetime.now(tz=timezone.utc) - time > timedelta(
                seconds=int(self._ensure_chain_config_reachable(api.config.get("HIVE_OWNER_UPDATE_LIMIT"))) / 1_000_000
            )

        authority_data = await provider.get_hive_authority_data(account_name)
        self._account = authority_data.account

        if api.config.get("HIVE_TEMP_ACCOUNT") == authority_data.account:
            raise HiveTempAccountUsedError

        self._HIVE_MAX_AUTHORITY_MEMBERSHIP = int(
            self._ensure_chain_config_reachable(api.config.get("HIVE_MAX_AUTHORITY_MEMBERSHIP"))
        )

        max_account_name_length = int(
            self._ensure_chain_config_reachable(api.config.get("HIVE_MAX_ACCOUNT_NAME_LENGTH"))
        )

        address_prefix = self._ensure_chain_config_reachable(api.config.get("HIVE_ADDRESS_PREFIX"))

        active, posting, owner, memo_key = (
            authority_data.authorities.active,
            authority_data.authorities.posting,
            authority_data.authorities.owner,
            authority_data.memo_key,
        )

        self._authorities = HiveRoles(
            active=HiveRoleAuthorityDefinition("active"),
            owner=HiveRoleAuthorityDefinition(
                "owner",
                lambda role: raise_cannot_update_owner_error()  # noqa: ARG005
                if not check_owner_time_diff(authority_data.last_owner_update)
                and check_owner_time_diff(authority_data.previous_owner_update)
                else None,
            ),
            posting=HiveRoleAuthorityDefinition("posting"),
            memo=HiveRoleMemoKeyDefinition(),
        )

        self._authorities.active.init(
            max_account_name_length,
            address_prefix,
            active,
        )

        self._authorities.owner.init(
            max_account_name_length,
            address_prefix,
            owner,
        )

        self._authorities.posting.init(
            max_account_name_length,
            address_prefix,
            posting,
        )

        self._authorities.memo.init(
            address_prefix,
            memo_key,
        )

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:  # noqa: ARG002
        if not self.changed:
            return []

        active = self.authorities.active.value if self.authorities.active.changed else None
        owner = self.authorities.owner.value if self.authorities.owner.changed else None
        posting = self.authorities.posting.value if self.authorities.posting.changed else None
        memo = self.authorities.memo.value if self.authorities.memo.changed else None

        if active and not self._can_authority_be_satisfied(active):
            raise AuthorityCannotBeSatisfiedError("active")

        if owner and not self._can_authority_be_satisfied(owner):
            raise AuthorityCannotBeSatisfiedError("owner")

        if posting and not self._can_authority_be_satisfied(posting):
            raise AuthorityCannotBeSatisfiedError("posting")

        return [
            account_update2(
                account=self.account,
                active=active,
                owner=owner,
                posting=posting,
                memo_key=memo if self.authorities.memo.is_set else None,
                json_metadata="",
                posting_json_metadata="",
            )
        ]

    def _can_authority_be_satisfied(self, authority: WaxAuthority) -> bool:
        accounts_auth_keys = authority.account_auths.keys()
        keys_auth_keys = authority.key_auths.keys()

        total_auth_size = len(accounts_auth_keys) + len(keys_auth_keys)

        if total_auth_size > self.hive_max_authority_membership:
            raise HiveMaxAuthorityMembershipExceededError(self.hive_max_authority_membership, total_auth_size)

        if total_auth_size == NULL_AUTH_SIZE:
            return True  # Null authority can be satisfied.

        total_accounts_auths_weight = sum(authority.account_auths.values())
        total_keys_auths_weight = sum(authority.key_auths.values())

        return not total_accounts_auths_weight + total_keys_auths_weight < authority.weight_threshold

    def _ensure_chain_config_reachable(self, any_config_attribute: str | None) -> str:
        assert any_config_attribute is not None, "Chain config is not reachable."
        return any_config_attribute
