from __future__ import annotations

from typing import Any

from schemas.fields.assets import AssetHbdHF26, AssetHiveHF26, AssetVestsHF26
from schemas.fields.basic import AccountName as AccountNameSchemas
from schemas.fields.compound import HbdExchangeRate as HbdExchangeRateSchemas
from schemas.fields.compound import Price as PriceSchemas
from schemas.fields.hex import Sha256
from wax._private.models.models_factory_mixin import ModelsFactoryMixin

AccountName = AccountNameSchemas


class HbdExchangeRateHF26(HbdExchangeRateSchemas[AssetHiveHF26, AssetHbdHF26], ModelsFactoryMixin): ...


HbdExchangeRate = HbdExchangeRateHF26 | dict[str, AssetHiveHF26 | AssetHbdHF26] | dict[str, dict[str, Any]]


class PriceHF26(PriceSchemas[AssetHiveHF26, AssetHbdHF26, AssetVestsHF26], ModelsFactoryMixin): ...


Price = PriceHF26 | dict[str, AssetHiveHF26 | AssetHbdHF26 | AssetVestsHF26] | dict[str, dict[str, Any]]


ChainId = Sha256
