from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import TYPE_CHECKING, Any, Iterable

from wax._private.operation_base import ConvertedToProtoOperation, OperationBase
from wax.complex_operations.data_providers.authority_data_provider import OnlineChainAuthorityDataProvider
from wax.complex_operations.role_classes.hive_authority.hive_account_category import (
    HiveAccountCategory,
)
from wax.complex_operations.role_classes.hive_authority.hive_roles import HiveRoles
from wax.exceptions.validation_errors import (
    NoAuthorityOperationGeneratedError,
)

if TYPE_CHECKING:
    from wax.complex_operations.role_classes.level_base import LevelBase
    from wax.complex_operations.role_classes.role_category_base import RoleCategoryBase
    from wax.interfaces import IAuthorityDataProvider, IHiveChainInterface, IWaxBaseInterface
    from wax.models.basic import AccountName


@dataclass
class PossibleRoles(HiveRoles):
    """All of possible roles. Add new roles to as base classes."""


AuthorityRoleCategories = (HiveAccountCategory,)
"""All of the role categories. Add new categories here."""


@dataclass
class PossibleCategoriesByCategoryName:
    """All of possible categories grouped by name. Add new categories also here."""

    hive: HiveAccountCategory


class AccountAuthorityUpdateOperation(OperationBase):
    """
    Account authority update operation.

    Notes:
        To create an instance of this class, use the factory method `create_for`.
        Otherwise, assertion error will be raised.
    """

    def __init__(
        self,
        possible_categories: PossibleCategoriesByCategoryName,
        possible_roles: PossibleRoles,
        *,
        _private: bool = False,
    ) -> None:
        assert (
            _private
        ), "AccountAuthorityUpdateOperation should be created only by AccountAuthorityUpdateOperation.create_for"
        super().__init__()
        self._possible_categories: PossibleCategoriesByCategoryName = possible_categories
        self._possible_roles: PossibleRoles = possible_roles

    @staticmethod
    async def create_for(
        wax_interface: IHiveChainInterface,
        account_name: AccountName,
    ) -> AccountAuthorityUpdateOperation:
        """
        Factory method for creating AccountAuthorityUpdateOperation.

        This is an online version - creates default provider instance and does call to api.

        Args:
            wax_interface (IHiveChainInterface): instance of interface.
            account_name (AccountName): account name of account to gain authority data from.

        Returns:
            AccountAuthorityUpdateOperation instance.
        """
        provider = OnlineChainAuthorityDataProvider(wax_interface)
        return await AccountAuthorityUpdateOperation.create_for_with_provider(wax_interface, account_name, provider)

    @staticmethod
    async def create_for_with_provider(
        wax_interface: IWaxBaseInterface, account_name: AccountName, provider: IAuthorityDataProvider
    ) -> AccountAuthorityUpdateOperation:
        """
        Factory method for creating AccountAuthorityUpdateOperation.

        This one support providing own authority data provider.

        Args:
            wax_interface (IWaxBaseInterface): instance of interface.
            account_name (AccountName): account name of account to gain authority data from.
            provider (IAuthorityDataProvider): authority provider.

        Returns:
            AccountAuthorityUpdateOperation instance.
        """
        role_per_role_name: dict[str, LevelBase[Any]] = {}
        category_per_category_name: dict[str, RoleCategoryBase[Any]] = {}

        for category in AuthorityRoleCategories:
            container = category()
            category_per_category_name[container.category] = container

        for category_instance in category_per_category_name.values():
            await category_instance.init(wax_interface, account_name, provider)

            for role_name, role_instance in category_instance.authorities.__dict__.items():
                role_per_role_name[role_name] = role_instance  # noqa: PERF403

        return AccountAuthorityUpdateOperation(
            PossibleCategoriesByCategoryName(**category_per_category_name),  # type: ignore[arg-type]
            PossibleRoles(**role_per_role_name),  # type: ignore[arg-type]
            _private=True,
        )

    def enforce_owner_role_authorisation(self) -> None:
        """
        Enforces the requirement for **owner** role authorization when modifying **active** or **posting** roles.

        **HF 28** introduces stricter matching between the authority role required by a given operation and the role
        used to authorize the transaction.
            - Since modifying **active** or **posting** roles requires **active** authority at the time of transaction
              signing, the pre-HF28 behavior — which allowed signing with the **owner** key — will be **disallowed**.
            - This change may pose difficulties for users who have lost their active keys and attempt to use their
              owner key to set a new one.
            - To address this, the function allows the inclusion — within the `account_update2_operation` generated
              internally — of elements that enforce the **owner** role requirement, specifically through an ineffective
              change of the owner authority to the same value currently recorded on-chain.
        """
        self._possible_roles.owner.enforce_modifications()

    @property
    def roles(self) -> PossibleRoles:
        """
        Get role to modify.

        Typical usage example:
            ```account_update_operation.roles.active.any_action()```
        """
        return self._possible_roles

    @property
    def categories(self) -> PossibleCategoriesByCategoryName:
        """Get category to modify."""
        return self._possible_categories

    @property
    def is_effective(self) -> bool:
        return any(category.changed for category in asdict(self.categories).values())

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        """
        Finalize updating account authority.

        Args:
            api (IWaxBaseInterface): Wax api subclass instance.

        Returns:
            Iterable[ConvertedToProtoOperation]: List of operations.

        Raises:
            NoAuthorityOperationGeneratedError: If no operation was generated.
        """
        operations: list[ConvertedToProtoOperation] = [
            operation for category in asdict(self.categories).values() for operation in category.finalize(api)
        ]

        if not operations:
            raise NoAuthorityOperationGeneratedError

        return operations
