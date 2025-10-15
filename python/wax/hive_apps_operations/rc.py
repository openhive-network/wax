from dataclasses import dataclass
from typing import List

from wax.hive_apps_operations.factory import TAccountName, HiveAppsOperation, ChildT, BodyT
from wax.models.asset import NaiAsset, HiveNaiAssetConvertible

@dataclass
class ResourceCreditsOperationData:
    def __init__(self, from_: TAccountName, rc: NaiAsset, delegatees: List[TAccountName]):
        self.from_ = from_
        self.rc = rc
        self.delegatees = delegatees


class ResourceCreditsOperation(HiveAppsOperation[ChildT, BodyT]):
    @property
    def id(self) -> str:
        return "rc"

    def delegate(
        self,
        working_account: TAccountName,
        max_rc: HiveNaiAssetConvertible,
        delegatee: TAccountName,
        *other_delegatees: TAccountName
    ) -> 'ResourceCreditsOperation':
        delegatees = [delegatee, *other_delegatees]

        self.body.append([
            "delegate_rc",
            {
                "from": working_account,
                "delegatees": delegatees,
                "max_rc": str(max_rc),
                "extensions": []
            }
        ])

        return self

    def remove_delegation(
        self,
        working_account: TAccountName,
        delegatee: TAccountName,
        *other_delegatees: TAccountName
    ) -> 'ResourceCreditsOperation':
        return self.delegate(working_account, '0', delegatee, *other_delegatees)