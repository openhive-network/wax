from __future__ import annotations

from abc import ABC, abstractmethod


class IPrivateKeyData(ABC):
    @property
    @abstractmethod
    def wif_private_key(self) -> str:
        """Get WIF private key."""

    @property
    @abstractmethod
    def associated_public_key(self) -> str:
        """Get associated public key."""


class IBrainKeyData(IPrivateKeyData, ABC):
    @property
    @abstractmethod
    def brain_key(self) -> str:
        """Get brain key."""
