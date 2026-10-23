from __future__ import annotations

import json
from typing import TYPE_CHECKING, cast

import pytest

if TYPE_CHECKING:
    from beekeepy.exceptions import ApiNotFoundError

from beekeepy.communication import Request, RequestContext, Response, rules
from beekeepy.exceptions import ApiNotFoundError, GroupedErrorsError
from beekeepy.interfaces import HttpUrl, SuppressApiNotFound


def api_not_found_error(api: str) -> ApiNotFoundError:
    response = {
        "jsonrpc": "2.0",
        "error": {
            "code": -32003,
            "message": ("Assert Exception:api_itr != data._registered_apis.end(): Could not find API " + api),
        },
        "id": 1,
    }

    context = RequestContext(
        request=Request(
            url=HttpUrl("0.0.0.0:0"),
            method="POST",
            headers={},
            body=json.dumps({"jsonrpc": "2.0", "id": 1, "method": f"{api}.some_method"}),
        ),
        response=Response(status_code=200, headers={}, body=json.dumps(response)),
    )
    result = rules.ApiNotFound().check(context)
    assert len(result) == 1, "Exception has not been generated"
    return cast(ApiNotFoundError, result[0])


@pytest.mark.parametrize(
    "api", ["rc_api", "database_api", "account_history_api", "future_plugin_that_not_exists_yet_api"]
)
def test_suppress_api_not_found(api: str) -> None:
    # ARRANGE
    error = api_not_found_error(api)

    # ACT
    with SuppressApiNotFound(api) as suppressed:
        raise error from GroupedErrorsError([error])

    # ASSERT
    assert error.api == api, "the rule takes the API from the message of the node"
    assert suppressed.errors == [error]


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
    with pytest.raises(type(error)), SuppressApiNotFound("rc_api", "database_api") as suppressed:
        raise error from GroupedErrorsError([error])

    assert len(suppressed.errors) == 0, "No errors should be suppressed"
