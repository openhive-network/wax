#!/usr/bin/env python3
"""
Simple benchmark for wax Python package.

Measures performance of common operations:
- Transaction creation and serialization
- Operation validation
- Key generation and derivation
- Signature digest calculation

Run with: python benchmark_wax.py
"""

from __future__ import annotations

import timeit
from typing import Final

import wax
from wax import create_wax_foundation
from wax.proto.asset import asset
from wax.proto.operations import comment, transfer, vote

# Test data
TAPOS: Final[str] = "00000449f7860b82b4fbe2f317c670e9f01d6d9a"
# HIVE asset: nai="@@000000021", precision=3
HIVE_AMOUNT: Final[asset] = asset(nai="@@000000021", precision=3, amount="1000000")
ITERATIONS: Final[int] = 1000
WARMUP_ITERATIONS: Final[int] = 10


def benchmark_transaction_creation() -> float:
    """Benchmark creating transactions with operations."""
    wax_foundation = create_wax_foundation()

    def run():
        tx = wax_foundation.create_transaction_with_tapos(TAPOS)
        tx.push_operation(
            transfer(
                from_account="alice",
                to_account="bob",
                amount=HIVE_AMOUNT,
                memo="test transfer",
            )
        )
        tx.push_operation(
            vote(voter="alice", author="bob", permlink="test-post", weight=10000)
        )
        # Serialize to binary form
        _ = tx.to_binary_form()

    # Warmup
    for _ in range(WARMUP_ITERATIONS):
        run()

    # Benchmark
    return timeit.timeit(run, number=ITERATIONS)


def benchmark_transaction_serialization() -> float:
    """Benchmark transaction serialization to JSON and binary."""
    wax_foundation = create_wax_foundation()
    tx = wax_foundation.create_transaction_with_tapos(TAPOS)
    tx.push_operation(
        transfer(
            from_account="alice",
            to_account="bob",
            amount=HIVE_AMOUNT,
            memo="test transfer",
        )
    )
    tx.push_operation(
        comment(
            parent_permlink="",
            parent_author="",
            author="alice",
            permlink="my-post",
            title="Test Post",
            body="This is a test post body with some content.",
            json_metadata="{}",
        )
    )

    def run():
        _ = tx.to_binary_form()
        _ = tx.to_string()
        _ = tx.to_api()

    # Warmup
    for _ in range(WARMUP_ITERATIONS):
        run()

    # Benchmark
    return timeit.timeit(run, number=ITERATIONS)


def benchmark_key_generation() -> float:
    """Benchmark brain key suggestion and key derivation."""
    wax_foundation = create_wax_foundation()

    def run():
        brain_key = wax_foundation.suggest_brain_key()
        # Derive password-based key
        _ = wax.generate_password_based_private_key(
            account="alice", role="active", password="secret123"
        )

    # Warmup
    for _ in range(WARMUP_ITERATIONS):
        run()

    # Benchmark
    return timeit.timeit(run, number=ITERATIONS)


def benchmark_operation_validation() -> float:
    """Benchmark operation validation."""
    wax_foundation = create_wax_foundation()
    tx = wax_foundation.create_transaction_with_tapos(TAPOS)
    tx.push_operation(
        transfer(
            from_account="alice",
            to_account="bob",
            amount=HIVE_AMOUNT,
            memo="test transfer",
        )
    )
    tx.push_operation(
        vote(voter="alice", author="bob", permlink="test-post", weight=10000)
    )

    def run():
        _ = tx.validate()

    # Warmup
    for _ in range(WARMUP_ITERATIONS):
        run()

    # Benchmark
    return timeit.timeit(run, number=ITERATIONS)


def benchmark_sig_digest() -> float:
    """Benchmark signature digest calculation."""
    wax_foundation = create_wax_foundation()
    tx = wax_foundation.create_transaction_with_tapos(TAPOS)
    tx.push_operation(
        transfer(
            from_account="alice",
            to_account="bob",
            amount=HIVE_AMOUNT,
            memo="test transfer",
        )
    )

    def run():
        _ = tx.sig_digest

    # Warmup
    for _ in range(WARMUP_ITERATIONS):
        run()

    # Benchmark
    return timeit.timeit(run, number=ITERATIONS)


def benchmark_impacted_accounts() -> float:
    """Benchmark getting impacted accounts from transaction."""
    wax_foundation = create_wax_foundation()
    tx = wax_foundation.create_transaction_with_tapos(TAPOS)
    tx.push_operation(
        transfer(
            from_account="alice",
            to_account="bob",
            amount=HIVE_AMOUNT,
            memo="test transfer",
        )
    )
    tx.push_operation(
        vote(voter="charlie", author="dave", permlink="test-post", weight=5000)
    )

    def run():
        _ = tx.impacted_accounts

    # Warmup
    for _ in range(WARMUP_ITERATIONS):
        run()

    # Benchmark
    return timeit.timeit(run, number=ITERATIONS)


def main() -> None:
    print("=" * 60)
    print("Wax Python Benchmark")
    print("=" * 60)
    print(f"Iterations per benchmark: {ITERATIONS}")
    print(f"Warmup iterations: {WARMUP_ITERATIONS}")
    print()

    benchmarks = [
        ("Transaction creation + serialize", benchmark_transaction_creation),
        ("Transaction serialization (JSON/binary)", benchmark_transaction_serialization),
        ("Key generation + derivation", benchmark_key_generation),
        ("Operation validation", benchmark_operation_validation),
        ("Signature digest calculation", benchmark_sig_digest),
        ("Impacted accounts extraction", benchmark_impacted_accounts),
    ]

    results = []
    for name, func in benchmarks:
        print(f"Running: {name}...", end=" ", flush=True)
        total_time = func()
        avg_time_ms = (total_time / ITERATIONS) * 1000
        ops_per_sec = ITERATIONS / total_time
        results.append((name, total_time, avg_time_ms, ops_per_sec))
        print(f"done ({total_time:.2f}s)")

    print()
    print("=" * 60)
    print("Results")
    print("=" * 60)
    print(f"{'Benchmark':<45} {'Avg (ms)':<12} {'Ops/sec':<12}")
    print("-" * 60)
    for name, total_time, avg_time_ms, ops_per_sec in results:
        print(f"{name:<45} {avg_time_ms:<12.3f} {ops_per_sec:<12.1f}")

    print()
    print("Total benchmark time: {:.2f}s".format(sum(r[1] for r in results)))


if __name__ == "__main__":
    main()
