"""Tests for selector.py, over the real checkout and over trees built to go stale.

Run with an interpreter that has aidev's testbed_runner:
``python -m pytest .aidev/tests/test_selector.py``.
"""

from __future__ import annotations

import importlib.util
import shutil
from pathlib import Path

import pytest
import yaml
from testbed_runner.selection import Change, ChangedFile, Selection, SelectorContext

_AIDEV = Path(__file__).resolve().parent.parent
_ROOT = _AIDEV.parent

_spec = importlib.util.spec_from_file_location("wax_selector", _AIDEV / "selector.py")
assert _spec and _spec.loader
selector = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(selector)

SCOPE = tuple(yaml.safe_load((_AIDEV / "project.yaml").read_text())["verification"]["quick"]["targets"])


def _change(*paths: str, status: str = "M") -> Change:
    return Change(base_rev="base", head_rev="head", files=tuple(ChangedFile(path=path, status=status) for path in paths))


def _select(*paths: str, tree_root: Path = _ROOT, scope: tuple[str, ...] = SCOPE) -> Selection:
    return selector.select(_change(*paths), str(tree_root), SelectorContext(slot="quick", project="wax", approved_scope=scope))


def test_the_approved_scope_is_run_checks_offline_projects() -> None:
    run_checks = (_AIDEV / "run-checks.sh").read_text()
    block = run_checks.split("OFFLINE_PROJECTS=(", 1)[1].split(")", 1)[0]
    assert SCOPE == tuple(block.split())
    assert len(SCOPE) == 11


def test_python_and_rust_only_propose_nothing() -> None:
    selection = _select("python/x.py", "rust/y.rs")
    assert selection.targets == ()
    assert selection.irrelevant == ("python/x.py", "rust/y.rs")
    assert selection.unrecognised == ()
    assert selection.degenerate is False


def test_markdown_outside_ts_is_irrelevant_even_under_a_whole_scope_prefix() -> None:
    selection = _select("README.md", "core/NOTES.md", ".aidev/README.md", "examples/ts/x.ts")
    assert selection.targets == ()
    assert selection.irrelevant == (".aidev/README.md", "README.md", "core/NOTES.md", "examples/ts/x.ts")
    assert selection.degenerate is False


@pytest.mark.parametrize(
    ("module", "project"),
    [
        ("utils.ts", "wax_utils"),
        ("complex_operations.ts", "wax_operation_factories"),
        ("mock_base.ts", "wax_mock_tests"),
        ("encrypted_operations.ts", "wax_encrypted_operations"),
        ("non_encrypted_operations.ts", "wax_non_encrypted_operations"),
        ("signers_csp.ts", "wax_signers_csp"),
        ("custom_chain_online_tx.ts", "wax_custom_chain_online_tx"),
        ("hive_chain_custom_opts.ts", "wax_testsuite_custom_chain_options"),
    ],
)
def test_a_detailed_test_module_selects_its_offline_project(module: str, project: str) -> None:
    selection = _select(f"ts/wasm/__tests__/detailed/{module}")
    assert selection.targets == (project,)
    assert selection.degenerate is False
    assert selection.unrecognised == ()


def test_a_detailed_module_only_online_projects_run_proposes_nothing() -> None:
    selection = _select("ts/wasm/__tests__/detailed/hive_base.ts")
    assert selection.targets == ()
    assert selection.unrecognised == ()
    assert selection.degenerate is False


@pytest.mark.parametrize(
    "path",
    [
        "core/foo.cpp",
        "ts/wasm/lib/detailed/util/equal.ts",
        "ts/wasm/__tests__/assets/jest-helper.ts",
        "ts/wasm/__tests__/index.spec.ts",
        "ts/playwright.config.ts",
        "ts/README.md",
        "hive",
        ".aidev/run-checks.sh",
        ".gitlab-ci.yml",
    ],
)
def test_everything_else_under_the_package_proposes_the_whole_scope(path: str) -> None:
    selection = _select(path)
    assert selection.targets == tuple(sorted(SCOPE))
    assert selection.degenerate is True


def test_a_test_module_beside_a_source_change_does_not_narrow_it() -> None:
    selection = _select("ts/wasm/__tests__/detailed/utils.ts", "ts/wasm/lib/detailed/chain.ts")
    assert selection.targets == tuple(sorted(SCOPE))
    assert selection.degenerate is True


def test_a_path_under_no_rule_is_unrecognised() -> None:
    selection = _select("renovate.json5", "python/x.py")
    assert selection.targets == ()
    assert selection.unrecognised == ("renovate.json5",)
    assert selection.irrelevant == ("python/x.py",)


def test_without_an_approved_scope_the_proposal_is_degenerate_not_empty() -> None:
    selection = _select("core/foo.cpp", scope=())
    assert selection.targets == ()
    assert selection.degenerate is True
    assert selection.annotations == ("no approved scope was given, so no narrower proposal than the whole scope can be made",)


def test_the_real_table_is_not_stale() -> None:
    assert selector.stale_rules(str(_ROOT), SCOPE) == ()


def test_a_project_missing_from_the_config_proposes_the_whole_scope_and_says_why(tmp_path: Path) -> None:
    tree = _copy_rule_paths(tmp_path)
    config = tree / "ts/playwright.config.ts"
    config.write_text(config.read_text().replace('"wax_utils"', '"wax_renamed_utils"'))
    selection = _select("python/x.py", tree_root=tree)
    assert selection.targets == SCOPE
    assert selection.degenerate is True
    assert {why for _, why in selection.reasons} == {
        "the rule table is stale against this checkout, so the whole approved scope is proposed: "
        "wax_utils is not a project with a testMatch in ts/playwright.config.ts"
    }


def test_a_scope_naming_an_unknown_project_is_stale() -> None:
    assert selector.stale_rules(str(_ROOT), (*SCOPE, "wax_gone")) == ("wax_gone is not a project with a testMatch in ts/playwright.config.ts",)


def test_a_missing_prefix_proposes_the_whole_scope_and_says_why(tmp_path: Path) -> None:
    tree = _copy_rule_paths(tmp_path)
    shutil.rmtree(tree / "core")
    selection = _select("ts/wasm/__tests__/detailed/utils.ts", tree_root=tree)
    assert selection.targets == SCOPE
    assert selection.degenerate is True
    assert all(why.endswith("core no longer exists in the checkout") for _, why in selection.reasons)


def _copy_rule_paths(tmp_path: Path) -> Path:
    """A tree holding every path the table names, and the real Playwright config."""
    for prefix in (*selector.WHOLE_SCOPE_PREFIXES, selector.DETAILED_TESTS_DIR):
        (tmp_path / prefix).mkdir(parents=True, exist_ok=True)
    shutil.copy(_ROOT / selector.PLAYWRIGHT_CONFIG, tmp_path / selector.PLAYWRIGHT_CONFIG)
    return tmp_path
