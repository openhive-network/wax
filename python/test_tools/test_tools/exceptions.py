"""Public re-exports of exception classes used by test-tools consumers.

Importing from this module shields test code from implementation-layer churn
(wax, beekeepy, helpy).  Tests should prefer ``from test_tools.exceptions import X``
over reaching into the underlying packages directly.
"""

from __future__ import annotations

from beekeepy.exceptions import (
    ApiNotFoundError,
    BeekeepyError,
    CommunicationError,
    ErrorInResponseError,
    FailedToStartExecutableError,
)
from wax.exceptions import (
    WaxAssertionError,
    WaxCommunicationError,
    WaxError,
    WaxInsufficientBalanceError,
    WaxInvalidAccountNameError,
    WaxInvalidAssetError,
    WaxInvalidFeeError,
    WaxInvalidPermlinkError,
    WaxUnhandledAssertionError,
    WaxValidationFailedError,
)
from wax.helpy.exceptions import BlockWaitTimeoutError

from test_tools.__private.exceptions import (
    AccountNotExistError,
    BlockLogError,
    BlockLogUtilError,
    BroadcastDuringTransactionBuildingError,
    ConfigError,
    DelegateeIsNotRightError,
    DelegatorIsNotRightError,
    DelegatorOrDelegateeNotExistError,
    InternalNodeError,
    MethodDeprecatedInBeekeeperWalletError,
    MissingBlockLogArtifactsError,
    MissingPathToExecutableError,
    NameAlreadyInUseError,
    NodeIsNotRunningError,
    NotSupportedError,
    PrivateKeyInMemoError,
    TestToolsError,
    ThresholdOutOfRangeError,
    WalletError,
    WeightOutOfRangeError,
)

__all__ = [
    # beekeepy
    "ApiNotFoundError",
    "BeekeepyError",
    "CommunicationError",
    "ErrorInResponseError",
    "FailedToStartExecutableError",
    # wax
    "WaxAssertionError",
    "WaxCommunicationError",
    "WaxError",
    "WaxInsufficientBalanceError",
    "WaxInvalidAccountNameError",
    "WaxInvalidAssetError",
    "WaxInvalidFeeError",
    "WaxInvalidPermlinkError",
    "WaxUnhandledAssertionError",
    "WaxValidationFailedError",
    # helpy
    "BlockWaitTimeoutError",
    # test-tools
    "AccountNotExistError",
    "BlockLogError",
    "BlockLogUtilError",
    "BroadcastDuringTransactionBuildingError",
    "ConfigError",
    "DelegateeIsNotRightError",
    "DelegatorIsNotRightError",
    "DelegatorOrDelegateeNotExistError",
    "InternalNodeError",
    "MethodDeprecatedInBeekeeperWalletError",
    "MissingBlockLogArtifactsError",
    "MissingPathToExecutableError",
    "NameAlreadyInUseError",
    "NodeIsNotRunningError",
    "NotSupportedError",
    "PrivateKeyInMemoError",
    "TestToolsError",
    "ThresholdOutOfRangeError",
    "WalletError",
    "WeightOutOfRangeError",
]
