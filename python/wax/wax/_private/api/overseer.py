from __future__ import annotations

from typing import TYPE_CHECKING, Any

from beekeepy._communication.abc.rules import OverseerRule, RulesClassifier
from beekeepy._communication.overseers import CommonOverseer
from beekeepy._communication.rules import (
    ApiNotFound,
    DifferenceBetweenAmountOfRequestsAndResponses,
    ErrorInResponse,
    InvalidPassword,
    JussiResponse,
    NullResult,
    UnableToAcquireDatabaseLock,
    UnableToAcquireForkdbLock,
    UnableToOpenWallet,
    UnlockIsNotAccessible,
    UnparsableResponse,
    WalletIsAlreadyUnlocked,
)
from beekeepy.exceptions import CommunicationResponseT, Json, OverseerError
from wax.exceptions.wax_error import WaxAssertionError
from wax.exceptions.wax_specialised_errors import resolve_api_response_error

if TYPE_CHECKING:
    from beekeepy._communication.url import Url


class WaxAssertionInResponseError(OverseerError):
    """OverseerError carrying a resolved WaxAssertionError from a structured API response."""

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

    def retry(self) -> bool:
        return False


class WaxErrorInResponse(OverseerRule):
    """
    Detects structured assertion errors in JSON-RPC responses using resolve_exception().

    This rule checks ``response["error"]["data"]`` for structured hived exception data
    and resolves it via the same :func:`resolve_exception` function used for C++ exceptions.
    Only catches errors that resolve to :class:`WaxAssertionError` — all other errors
    fall through to the ``ErrorInResponse`` fallback rule.
    """

    def _check_single(self, parsed_response: Json, whole_response: Json | list[Json]) -> list[OverseerError]:
        resolved = resolve_api_response_error(parsed_response)
        if not isinstance(resolved, WaxAssertionError):
            return []

        return [
            WaxAssertionInResponseError(
                url=self.url,
                request=self.request,
                response=parsed_response,
                whole_response=whole_response,
                message=f"Structured assertion error in response: {resolved}",
                request_id=parsed_response.get("id"),
                wax_exception=resolved,
            )
        ]

    @classmethod
    def expected_exception(cls) -> type[OverseerError]:
        return WaxAssertionInResponseError


class WaxOverseer(CommonOverseer):
    """
    Custom Overseer that uses resolve_exception() for structured assertion error detection.

    Inserts :class:`WaxErrorInResponse` before the ``ErrorInResponse`` fallback so that
    assertion errors from hived API responses are resolved to typed
    :class:`WaxAssertionError` subclasses via the same path as C++ exceptions.
    """

    def _rules(self) -> RulesClassifier:
        return RulesClassifier(
            preliminary=[
                ApiNotFound,
                WalletIsAlreadyUnlocked,
                UnableToOpenWallet,
                InvalidPassword,
                UnlockIsNotAccessible,
                WaxErrorInResponse,
                ErrorInResponse,
            ],
            infinitely_repeatable=[
                UnableToAcquireDatabaseLock,
                UnableToAcquireForkdbLock,
            ],
            finitely_repeatable=[
                UnparsableResponse,
                JussiResponse,
                DifferenceBetweenAmountOfRequestsAndResponses,
                NullResult,
            ],
        )
