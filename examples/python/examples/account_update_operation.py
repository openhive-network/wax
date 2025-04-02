from __future__ import annotations

import asyncio
import os

from wax import create_hive_chain
from wax.complex_operations.account_update import AccountAuthorityUpdateOperation

my_wax = create_hive_chain()
NEW_MEMO_KEY = os.getenv("NEW_MEMO_KEY", "")
MY_ACCOUNT_NAME = os.getenv("MY_ACCOUNT_NAME", "")
NEW_POSTING_ACCOUNT = os.getenv("NEW_POSTING_ACCOUNT", "")
NEW_OWNER_ACCOUNT = os.getenv("NEW_OWNER_ACCOUNT", "")
NEW_ACTIVE_ACCOUNT = os.getenv("NEW_ACTIVE_ACCOUNT", "")
NEW_WEIGHT = os.getenv("NEW_WEIGHT", "")

# Please remember to use `create_for` method to create the complex operation instance.
# The operation will automatically retrieve permission data for your account.
async def create_account_update_operation() -> AccountAuthorityUpdateOperation:
    return await AccountAuthorityUpdateOperation.create_for(my_wax, MY_ACCOUNT_NAME)

# You can iterate over role in the specific category and modify it.
def update_active_authority(operation: AccountAuthorityUpdateOperation) -> None:
    for role in operation.categories.hive:
        if role.level == "active":
            role.add(NEW_ACTIVE_ACCOUNT, NEW_WEIGHT)

# Or you can access the role directly. This way is more readable, and you have fully intellisense support.
def update_memo_key(operation: AccountAuthorityUpdateOperation) -> None:
    memo = operation.roles.memo
    memo.set(NEW_MEMO_KEY)

def update_owner_authority(operation: AccountAuthorityUpdateOperation) -> None:
    owner = operation.roles.owner
    owner.add(NEW_OWNER_ACCOUNT, NEW_WEIGHT)


def update_posting_authority(operation: AccountAuthorityUpdateOperation) -> None:
    posting = operation.roles.posting
    posting.add(NEW_POSTING_ACCOUNT, NEW_WEIGHT)


async def main() -> None:
    account_update = await create_account_update_operation()
    update_active_authority(account_update)
    update_memo_key(account_update)
    update_owner_authority(account_update)
    update_posting_authority(account_update)

    tx = await my_wax.create_transaction()
    tx.push_operation(account_update)
    print(f"Ready tx to sign and broadcast: {tx.to_api_json()}")

asyncio.run(main())
