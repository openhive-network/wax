from __future__ import annotations

from beekeepy.interfaces import HttpUrl
from wax.exceptions.validation_errors import InvalidEndpointUrlFormatError


def convert_to_http_url(value: HttpUrl | str) -> HttpUrl:
    """
    Converts value to HttpUrl.

    Args:
        value: value to convert.

    Returns:
        HttpUrl: converted value.

    Raises:
        InvalidEndpointUrlFormatError: if value is not valid.
    """
    try:
        return HttpUrl(value)
    except (ValueError, TypeError) as error:
        raise InvalidEndpointUrlFormatError(value) from error
