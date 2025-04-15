"""
This script generates the base client for the Wax API.
Please do not modify it!
"""

from __future__ import annotations

from pathlib import Path
from dataclasses import dataclass

from beekeepy.handle.remote import AbstractAsyncApi

from schemas.transaction import Transaction
from schemas.apis.api_client_generator.asynchronous.api_collection_generator import generate_api_collection
from schemas.apis.database_api.response_schemas import FindAccounts as FindAccountsResult
from schemas.apis.database_api.response_schemas import GetDynamicGlobalPropertiesOrig
from schemas.apis.network_broadcast_api.response_schemas import BroadcastTransaction as BroadcastTransactionResult


@dataclass
class FindAccountsParams:
    accounts: list[str]
    delayed_votes_active: bool = False


@dataclass
class BroadcastTransactionParams:
    transaction: Transaction


WaxApiDefinition = {
    "database_api": {
        "type": "json_rpc",
        "find_accounts": {
            "params": FindAccountsParams,
            "result": FindAccountsResult,
        },
        "get_dynamic_global_properties": {
            "params": None,
            "result": GetDynamicGlobalPropertiesOrig,
        }
    },
    "network_broadcast_api": {
        "type": "json_rpc",
        "broadcast_transaction": {
            "params": BroadcastTransactionParams,
            "result": BroadcastTransactionResult,
        },
    }
}

def main() -> None:
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    collection_path = project_root / "wax" / "api" / "collection.py"

    generate_api_collection(
        WaxApiDefinition,
        AbstractAsyncApi,
        path=collection_path,
        collection_name="WaxApiCollection",
    )

if __name__ == "__main__":
    main()
