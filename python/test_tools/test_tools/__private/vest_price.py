from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, Protocol

from hiveio_api.operations import Price

if TYPE_CHECKING:
    from test_tools.__private.asset import Asset


class HasVestingInfo(Protocol):
    total_vesting_shares: Any
    total_vesting_fund_hive: Any


@dataclass
class VestPrice:
    base: Asset.VestsT | Asset.HiveT | Asset.HbdT
    quote: Asset.VestsT | Asset.HiveT | Asset.HbdT

    def __str__(self) -> str:
        ratio = int(self.quote.amount) / int(self.base.amount) / 10 ** int(self.base.precision)
        return f"{ratio} {self.quote.token()} per 1 {self.base.token()}"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.as_nai()})"

    @classmethod
    def from_dgpo(cls, dgpo: HasVestingInfo) -> VestPrice:
        from test_tools.__private.asset import Asset

        def _to_asset(raw: Any) -> Asset.AnyT:
            return Asset.from_nai({"amount": str(raw.amount), "nai": raw.nai, "precision": int(raw.precision)})

        return cls(quote=_to_asset(dgpo.total_vesting_shares), base=_to_asset(dgpo.total_vesting_fund_hive))

    def as_nai(self) -> dict[str, dict[str, object]]:
        return {"quote": self.quote.as_nai(), "base": self.base.as_nai()}

    def as_schema(self) -> Price:
        return Price(base=self.base, quote=self.quote)
