from __future__ import annotations

from typing import TYPE_CHECKING, Any

from beekeepy.communication import (
    ErrorInResponseRules,
    HiveRules,
    JsonRpcRules,
    Reaction,
    ResponsesRule,
    RuleSet,
    response_id,
)
from beekeepy.exceptions import CommunicationResponseT, ErrorInResponseError, OverseerError
from wax.exceptions.wax_error import WaxAssertionError, WaxCommunicationError
from wax.exceptions.wax_specialised_errors import resolve_api_response_error

if TYPE_CHECKING:
    from beekeepy.communication import RequestContext, ResponseCallback
    from beekeepy.exceptions import CommunicationError, Json
    from beekeepy.interfaces import Url
    from wax.exceptions.wax_error import WaxError


class WaxAssertionInResponseError(ErrorInResponseError):
    """
    ErrorInResponseError subclass carrying a resolved WaxAssertionError from a structured API response.

    Inherits from ErrorInResponseError so that existing ``except ErrorInResponseError``
    handlers catch these transparently — no import changes needed in downstream repos.
    Code that needs the structured assertion data can catch WaxAssertionInResponseError explicitly.
    """

    def __init__(  # noqa: PLR0913
        self,
        url: str | Url[Any],
        request: CommunicationResponseT | bytes,
        response: CommunicationResponseT | None = None,
        whole_response: CommunicationResponseT | None = None,
        *,
        message: str = "",
        request_id: int | None,
        wax_exception: WaxAssertionError,
    ) -> None:
        super().__init__(
            url=url,
            request=request,
            response=response,
            whole_response=whole_response,
            message=message,
            request_id=request_id,
        )
        self.wax_exception = wax_exception


class WaxErrorInResponse(ResponsesRule):
    """
    Detects structured assertion errors in JSON-RPC responses using resolve_exception().

    This rule checks ``response["error"]["data"]`` for structured hived exception data
    and resolves it via the same :func:`resolve_exception` function used for C++ exceptions.
    Only catches errors that resolve to :class:`WaxAssertionError` — all other errors
    fall through to the ``ErrorInResponse`` fallback rule.
    """

    def _check_response(self, context: RequestContext, response: Json) -> OverseerError | None:
        resolved = resolve_api_response_error(response)
        if not isinstance(resolved, WaxAssertionError):
            return None

        message = f"Structured assertion error in response: {resolved}"
        return WaxAssertionInResponseError(
            **self._error_arguments(context, response=response, request_id=response_id(response), message=message),
            wax_exception=resolved,
        )

    @classmethod
    def expected_exception(cls) -> type[OverseerError]:
        return WaxAssertionInResponseError


class WaxRules(RuleSet):
    """
    Structured assertion errors of hived - resolved to typed `WaxAssertionError` subclasses.

    Placed before the ``ErrorInResponseRules`` fallback, so assertion errors of API responses are resolved via the same
    path as C++ exceptions.
    """

    RULES = ((WaxErrorInResponse(), Reaction.ABORT),)


def hived_rules() -> list[ResponseCallback]:
    """Rules of responses of hived - of JSON-RPC, of hived, structured assertions (`WaxRules`) and any other error."""
    return [JsonRpcRules(), HiveRules(), WaxRules(), ErrorInResponseRules()]


def error_of_wax(error: CommunicationError) -> WaxError:
    """
    Error of a request (detected by rules or of sending) as an error of wax.

    Structured assertion errors are their `WaxAssertionError`, other errors are `WaxCommunicationError`.
    """
    if isinstance(error, WaxAssertionInResponseError):
        return error.wax_exception
    return WaxCommunicationError(str(error))
