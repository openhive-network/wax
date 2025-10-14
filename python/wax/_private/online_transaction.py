from __future__ import annotations

from typing import TYPE_CHECKING, ClassVar

from wax._private.core.constants import DEFAULT_TRANSACTION_EXPIRATION_TIME
from wax._private.transaction import Transaction
from wax.exceptions import AccountNotFoundError
from wax.interfaces import IOnlineTransaction
from wax.models.authority import WaxAuthorities
from wax.wax_options import WaxOptions
from wax.wax_visitor import OperationVisitor

if TYPE_CHECKING:
    from datetime import timedelta

    from wax._private.chain_api import HiveChainApi
    from wax.models.basic import AccountName, ChainReferenceData
    from wax.proto.operations import (
        comment,
        operation,
        recurrent_transfer,
        transfer,
        transfer_from_savings,
        transfer_to_savings,
    )


class OnChainOperationValidator(OperationVisitor):
    MAX_ACCOUNTS_PER_CALL: ClassVar[int] = 100

    def __init__(self, chain: HiveChainApi) -> None:
        super().__init__()
        self._private_key_scanner_data: dict[str, set[str]] = {}
        self._account_to_check_exists: set[AccountName] = set()
        self._processed_operation: operation
        self._chain = chain

    async def validate(self, operations: list[operation]) -> None:
        """
        Validates a list of provided operations.

        Validation includes:
        - Checking for potential private key leaks in operation contents.
        - Ensuring all impacted accounts exist on the blockchain.

        Args:
            operations: List of operations to validate.

        Raises:
            AccountNotFoundError: If ANY of impacted accounts do not exist in the blockchain.
            PrivateKeyDetectedInMemoError: If private key detected in the content of the operation.
        """
        for op in operations:
            self._processed_operation = op
            self.accept(op)

        await self._ensure_accounts_exists()
        await self._process_security_leak_scanner()

    def comment(self, op: comment) -> None:
        self._collect_leak_scanner_data(op.body, op.permlink)

    def transfer(self, op: transfer) -> None:
        self._collect_leak_scanner_data(op.memo)

    def transfer_from_savings(self, op: transfer_from_savings) -> None:
        self._collect_leak_scanner_data(op.memo)

    def transfer_to_savings(self, op: transfer_to_savings) -> None:
        self._collect_leak_scanner_data(op.memo)

    def recurrent_transfer(self, op: recurrent_transfer) -> None:
        self._collect_leak_scanner_data(op.memo)

    def _collect_leak_scanner_data(self, *contents: str) -> None:
        """
        Collects data for private key leak scanner from operation contents.

        Args:
            *contents: Strings to be scanned for potential private key leaks.
        """
        impacted_accounts = self._chain.get_operation_impacted_accounts(self._processed_operation)

        for account in impacted_accounts:
            collected_strings = self._private_key_scanner_data.get(account)

            if collected_strings is None:
                self._private_key_scanner_data[account] = set(contents)
            else:
                self._private_key_scanner_data[account] = collected_strings | set(contents)

    async def _ensure_accounts_exists(self) -> None:
        accounts_to_check = list(self._account_to_check_exists)

        for i in range(0, len(accounts_to_check), self.MAX_ACCOUNTS_PER_CALL):
            batch = accounts_to_check[i : i + self.MAX_ACCOUNTS_PER_CALL]
            existing_accounts = await self._chain.api.rc_api.find_rc_accounts(accounts=batch)

            if len(existing_accounts.rc_accounts) != len(batch):
                missing_accounts = set(batch) - {acc.account for acc in existing_accounts.rc_accounts}
                raise AccountNotFoundError(*missing_accounts)

    async def _process_security_leak_scanner(self) -> None:
        if not self._private_key_scanner_data:
            return

        input_accounts = self._private_key_scanner_data.keys()
        account_authorities = await self._chain.collect_account_authorities(*input_accounts)

        if not isinstance(account_authorities, list):
            account_authorities = [account_authorities]

        for auth_info in account_authorities:
            collected_text = self._private_key_scanner_data.get(auth_info.account)
            for text in collected_text:  # type: ignore[union-attr]
                self._chain.scan_text_for_matching_private_keys(
                    text,
                    auth_info.account,
                    WaxAuthorities.to_python_authorities(auth_info.authorities),
                    auth_info.memo_key,
                )


class OnlineTransaction(Transaction, IOnlineTransaction):
    def __init__(
        self,
        chain_api: HiveChainApi,
        chain_reference_data: ChainReferenceData,
        expiration_time: timedelta = DEFAULT_TRANSACTION_EXPIRATION_TIME,
    ) -> None:
        expiration_ref_time = chain_reference_data.time if chain_api.chain_id != WaxOptions().chain_id else None
        """
        We're using head block time as a expiration reference time for other chains than mainnet.
        For mainnet is best to eliminate potential API node time screw.
        For other (testing) chains it simplifies APPs rapid prototyping on deployments being mirrornet specific.
        """
        super().__init__(chain_api, chain_reference_data.head_block_id, expiration_time, expiration_ref_time)
        self._chain_api = chain_api

    async def perform_on_chain_verification(self) -> None:
        final_transaction = self.transaction

        validator = OnChainOperationValidator(self._chain_api)
        await validator.validate(final_transaction.operations)
