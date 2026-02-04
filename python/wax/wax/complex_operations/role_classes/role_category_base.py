from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Generic, Iterable, TypeVar

if TYPE_CHECKING:
    from wax._private.operation_base import ConvertedToProtoOperation
    from wax.interfaces import IAuthorityDataProvider, IWaxBaseInterface
    from wax.models.basic import AccountName


AuthType = TypeVar("AuthType")
"""Type variable for the authority type."""


class RoleCategoryBase(ABC, Generic[AuthType]):
    """Base class for all role categories. Please inherit from this class when yoy create a new category."""

    @property
    @abstractmethod
    def authorities(self) -> AuthType:
        """Returns object that is filled by the `init` function."""

    @property
    @abstractmethod
    def category(self) -> str:
        """Category name. Should be unique."""

    @property
    @abstractmethod
    def changed(self) -> bool:
        """Indicates if any of the authority levels has changed since the last update."""

    @abstractmethod
    async def init(
        self,
        api: IWaxBaseInterface,
        account_name: AccountName,
        provider: IAuthorityDataProvider,
    ) -> None:
        """
        Responsible for gathering authority types for the given account.

        Args:
            api (IWaxBaseInterface | IWaxBaseInterface): instance of the wax base api subclass.
            account_name (AccountName): name of the account that will be used to gather authority data.
            provider (IAuthorityDataProvider): object that delivers authority data.
        """

    @abstractmethod
    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        """
        Function should return iterable object of operations that will modify the user accounts roles.

        Args:
            api (IWaxBaseInterface): Instance of the wax base api subclass.
        """
