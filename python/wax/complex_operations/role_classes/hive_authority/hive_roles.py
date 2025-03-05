from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Literal

if TYPE_CHECKING:
    from wax.complex_operations.role_classes.hive_authority.hive_role_authority_definition import (
        HiveRoleAuthorityDefinition,
    )
    from wax.complex_operations.role_classes.hive_authority.hive_role_memo_key import HiveRoleMemoKeyDefinition

ActiveRoleName = Literal["active"]
OwnerRoleName = Literal["owner"]
PostingRoleName = Literal["posting"]


@dataclass
class HiveRoles:
    """Currently available roles in the hive account category."""

    active: HiveRoleAuthorityDefinition[ActiveRoleName]
    owner: HiveRoleAuthorityDefinition[OwnerRoleName]
    posting: HiveRoleAuthorityDefinition[PostingRoleName]
    memo: HiveRoleMemoKeyDefinition
