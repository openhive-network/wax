from __future__ import annotations

from hiveio_api.database_api.database_api_description import Active, Owner, Posting
from hiveio_api.database_api.database_api_description import FindAccountsResponse as FindAccountsApiResponse
from hiveio_api.operations import Hf26Transaction as ApiTransaction

PossibleAuthorityApi = Active | Owner | Posting

__all__ = ["PossibleAuthorityApi", "ApiTransaction", "FindAccountsApiResponse"]
