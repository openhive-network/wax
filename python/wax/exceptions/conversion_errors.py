from __future__ import annotations

from wax.exceptions.wax_error import WaxError


class DecimalConversionError(WaxError):
    """Base exception for all decimal conversion errors."""


class DecimalConversionNotANumberError(DecimalConversionError):
    """Raised when decimal conversion fails because the value is not a number."""


class DecimalConversionNegativePrecisionError(DecimalConversionError):
    """Raised when decimal conversion fails because the precision is negative."""

    def __init__(self, precision: int) -> None:
        self.precision = precision
        self.message = f"Precision must be a positive integer. Given: {precision}"
        super().__init__(self.message)
