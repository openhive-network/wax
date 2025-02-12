"""
The module was created to avoid cluttering imports in wax by aliasing imports from schemas.

(Inspired by the clive practices)
"""

from __future__ import annotations

from schemas.apis import database_api, network_broadcast_api
from schemas.apis.database_api.response_schemas import FindAccounts as FindAccountsApiResponse
from schemas.fields.compound import Authority as ApiAuthority
from schemas.transaction import Transaction as ApiTransaction

__all__ = ["ApiAuthority", "ApiTransaction", "FindAccountsApiResponse", "database_api", "network_broadcast_api"]
