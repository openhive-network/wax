from __future__ import annotations

import json
from typing import TYPE_CHECKING, cast

import pytest

import beekeepy.communication.overseer as bk_over
import beekeepy.exceptions as bk_exc
import beekeepy.interfaces as bk_inter

if TYPE_CHECKING:
    from beekeepy.exceptions import ApiNotFoundError


def api_not_found_error(api: str) -> ApiNotFoundError:
    response = {
        "jsonrpc": "2.0",
        "error": {
            "code": -32003,
            "message": ("Assert Exception:api_itr != " "data._registered_apis.end(): Could not find API " + api),
        },
        "id": 1,
    }

    result = bk_over.rules.ApiNotFound(
        url=bk_inter.HttpUrl("0.0.0.0:0"),
        request={"jsonrpc": "2.0", "id": 1, "method": f"{api}.some_method"},
    ).check(response=response, response_raw=json.dumps(response))
    assert len(result) == 1, "Exception has not been generated"
    return cast(bk_exc.ApiNotFoundError, result[0])


@pytest.mark.parametrize(
    "error",
    [
        api_not_found_error(api=api)
        for api in [
            "rc_api",
            "database_api",
            "account_history_api",
            "future_plugin_that_not_exists_yet_api",
        ]
    ],
)
def test_suppress_api_not_found(error: ApiNotFoundError) -> None:
    # ARRANGE & ACT
    with bk_inter.SuppressApiNotFound(error.api) as suppressed:
        raise error from bk_exc.GroupedErrorsError([error])

    # ASSERT
    assert suppressed.errors[0].api == error.api


@pytest.mark.parametrize(
    "error",
    [
        api_not_found_error("debug_node_api"),
        ValueError("some value error"),
    ],
)
def test_suppress_api_not_found_rethrow(error: Exception) -> None:
    # ARRANGE

    # ACT & ASSERT
    with pytest.raises(type(error)), bk_inter.SuppressApiNotFound("rc_api", "database_api") as suppressed:
        raise error from bk_exc.GroupedErrorsError([error])

    assert len(suppressed.errors) == 0, "No errors should be suppressed"
