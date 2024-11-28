from __future__ import annotations

import datetime

from typing_extensions import Self


class HiveDateTime(datetime.datetime):
    @classmethod
    def now(cls) -> Self:  # type: ignore[override]
        return cls.utcnow().replace(microsecond=0)
