from __future__ import annotations

from typing import ClassVar, Literal, TypeAlias

from wax.helpy._handles.hived.api.common_database_api import DatabaseApiCommons


class CondenserApiCommons:
    SORT_TYPES: ClassVar[TypeAlias] = DatabaseApiCommons.SORT_TYPES
    SORT_DIRECTION: ClassVar[TypeAlias] = DatabaseApiCommons.SORT_DIRECTION
    PROPOSAL_STATUS: ClassVar[TypeAlias] = DatabaseApiCommons.PROPOSAL_STATUS
    WITHDRAW_ROUTE_TYPES = Literal["incoming", "outgoing", "all"]
