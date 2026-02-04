from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal

from wax._private.converters.decimal_converter import DecimalConverter
from wax._private.core.constants import HIVE_PERCENT_PRECISION_DOT_PLACES
from wax.interfaces import IManabarData


@dataclass
class ManabarData(IManabarData):
    max_mana: int
    current_mana: int

    @property
    def percent(self) -> Decimal:
        precision = HIVE_PERCENT_PRECISION_DOT_PLACES

        if self.max_mana <= 0:
            return DecimalConverter.convert(0, precision=precision)

        raw_max_mana = Decimal(self.max_mana)
        raw_current_mana = Decimal(self.current_mana)

        percent = raw_current_mana * 100 / raw_max_mana
        return DecimalConverter.round_to_precision(percent, precision=precision)
