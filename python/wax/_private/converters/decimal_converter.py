from __future__ import annotations

from decimal import ROUND_DOWN, Decimal, InvalidOperation

from wax.exceptions.conversion_errors import DecimalConversionNegativePrecisionError, DecimalConversionNotANumberError

DecimalConvertible = int | str | float | Decimal


class DecimalConverter:
    @classmethod
    def get_precision(cls, amount: DecimalConvertible) -> int:
        """
        Get precision of given amount.

        Args:
            amount: Amount to get precision of.

        Raises:
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
        """
        converted = cls.convert(amount)
        exponent = int(converted.as_tuple().exponent)
        return -1 * exponent

    @classmethod
    def convert(cls, amount: DecimalConvertible, *, precision: int | None = None) -> Decimal:
        """
        Convert given amount to Decimal.

        Args:
            amount: Amount to convert.
            precision: Precision of the amount.

        Returns:
            Decimal: amount converted into the decimal.

        Raises:
            DecimalConversionNotANumberError: Raised when given amount is in invalid format.
            DecimalConversionNegativePrecisionError: If given precision is negative.
        """
        try:
            converted = Decimal(str(amount))
        except InvalidOperation as error:
            raise DecimalConversionNotANumberError(f"Given {amount=} is not a number.") from error

        if precision is not None:
            cls._assert_precision_is_positive(precision)
            converted = cls.round_to_precision(converted, precision)

        return converted

    @staticmethod
    def round_to_precision(amount: Decimal, precision: int) -> Decimal:
        exponent = Decimal(10) ** (-1 * precision)
        return amount.quantize(exponent, rounding=ROUND_DOWN)

    @staticmethod
    def _assert_precision_is_positive(precision: int) -> None:
        if precision < 0:
            raise DecimalConversionNegativePrecisionError(precision)
