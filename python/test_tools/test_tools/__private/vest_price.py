from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from schemas.fields.compound import Price

if TYPE_CHECKING:
    from schemas.fields.assets._base import AssetNaiAmount
    from wax.helpy import Hf26Asset


def _nai_to_asset(nai_struct: Any) -> Hf26Asset.VestsT | Hf26Asset.HiveT | Hf26Asset.HbdT:
    """Convert a NAI-format object (hiveio_api Struct or schemas Asset) to Hf26Asset."""
    from wax.helpy import Hf26Asset

    if isinstance(nai_struct, (Hf26Asset.VestsT, Hf26Asset.HiveT, Hf26Asset.HbdT)):
        return nai_struct
    return Hf26Asset.from_nai({"amount": nai_struct.amount, "nai": nai_struct.nai, "precision": nai_struct.precision})


@dataclass
class VestPrice:
    base: Hf26Asset.VestsT | Hf26Asset.HiveT | Hf26Asset.HbdT
    quote: Hf26Asset.VestsT | Hf26Asset.HiveT | Hf26Asset.HbdT

    def __str__(self) -> str:
        ratio = int(self.quote.amount) / int(self.base.amount) / 10 ** int(self.base.precision())
        return f"{ratio} {self.quote.get_asset_information().get_symbol()} per 1 {self.base.get_asset_information().get_symbol()}"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.as_nai()})"

    @classmethod
    def from_dgpo(cls, dgpo: Any) -> VestPrice:
        return cls(quote=_nai_to_asset(dgpo.total_vesting_shares), base=_nai_to_asset(dgpo.total_vesting_fund_hive))

    def as_nai(self) -> dict[str, dict[str, AssetNaiAmount | str]]:
        return {"quote": self.quote.as_nai(), "base": self.base.as_nai()}

    def as_schema(self) -> Price:
        return Price(base=self.base, quote=self.quote)
