from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import TYPE_CHECKING, Any

from wax.hive_apps_operations.factory import HiveAppsOperation, HiveAppsOperationBaseData

if TYPE_CHECKING:
    from wax.models.basic import AccountName


@dataclass
class ResourceCreditsOperationDataItem:
    """
    Data structure for Resource Credits operation.

    Attributes:
        from_account: The account delegating the resource credits.
        max_rc: The amount of resource credits to delegate.
        delegatees: List of accounts receiving the delegated resource credits.
    """

    from_account: AccountName
    max_rc: int
    delegatees: list[AccountName]
    extensions: list[Any] = field(default_factory=list)


@dataclass
class ResourceCreditsOperationData(HiveAppsOperationBaseData):
    delegate_rc: ResourceCreditsOperationDataItem

    def to_dict(self) -> dict[str, str | int]:
        converted = asdict(self)

        converted["delegate_rc"]["from"] = converted["delegate_rc"].pop("from_account")
        converted["delegate_rc"]["max_rc"] = str(converted["delegate_rc"]["max_rc"])
        return converted


class ResourceCreditsOperation(HiveAppsOperation[ResourceCreditsOperationData]):
    """Resource Credits operation for delegating and removing delegation of resource credits."""

    @property
    def id(self) -> str:
        return "rc"

    def delegate(
        self, working_account: AccountName, max_rc: int, delegatee: AccountName, *other_delegatees: AccountName
    ) -> ResourceCreditsOperation:
        """
        Delegates resource credits from one account to one or more delegatee accounts.

        Args:
            working_account: The account delegating the resource credits.
            max_rc: The maximum amount of resource credits to delegate.
            delegatee: The primary account receiving the delegated resource credits.
            other_delegatees: Additional accounts receiving the delegated resource credits.

        Returns:
            The current instance of ResourceCreditsOperation for method chaining,
             with the delegation details added to the body.
        """
        delegatees = [delegatee, *other_delegatees]

        rc_delegation_data = ResourceCreditsOperationDataItem(
            from_account=working_account, max_rc=max_rc, delegatees=delegatees
        )
        rc_delegation = ResourceCreditsOperationData(delegate_rc=rc_delegation_data)
        self._body.append(rc_delegation)
        return self

    def remove_delegation(
        self, working_account: AccountName, delegatee: AccountName, *other_delegatees: AccountName
    ) -> ResourceCreditsOperation:
        """
        Removes delegation of resource credits from one account to one or more delegatee accounts.

        Args:
            working_account: The account removing the delegation of resource credits.
            delegatee: The primary account from which the delegation is being removed.
            other_delegatees: Additional accounts from which the delegation is being removed.

        Returns:
            The current instance of ResourceCreditsOperation for method chaining, with max_rc set to 0.
        """
        return self.delegate(working_account, 0, delegatee, *other_delegatees)
