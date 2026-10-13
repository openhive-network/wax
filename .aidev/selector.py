"""wax's quick-gate selector: which offline Playwright projects a change needs.

Bound by ``selection.quick`` in ``project.yaml``. Its targets are Playwright
project names, the vocabulary ``run-checks.sh`` accepts after its steps, and the
approved scope is ``verification.quick.targets``.

A path table, walked by :func:`~testbed_runner.selection.path_map`:

* a test module ``ts/wasm/__tests__/detailed/<name>.ts`` selects the offline
  project whose ``testMatch`` in ``ts/playwright.config.ts`` matches its
  compiled ``<name>.js``, and nothing when none does (its tests run only in the
  online projects);
* everything else under ``ts/``, ``core/``, the ``hive`` submodule, ``.aidev/``,
  ``.gitlab-ci.yml`` and ``.gitmodules`` selects the whole approved scope. Most
  tests run against the whole bundle through the ``wasmTest`` fixture, so a
  library change cannot be narrowed by its imports;
* ``python/``, ``rust/``, ``examples/`` and Markdown outside ``ts/`` are
  irrelevant: no slot builds them;
* any other path is unrecognised.

A table names paths and projects, so it can go stale. :func:`stale_rules`
checks it against the checkout, and a stale table proposes the whole approved
scope and says why.
"""

from __future__ import annotations

import fnmatch
import os
import re
from collections.abc import Sequence

from testbed_runner.selection import Change, PathMapEntry, Selection, path_map

PLAYWRIGHT_CONFIG = "ts/playwright.config.ts"
DETAILED_TESTS_DIR = "ts/wasm/__tests__/detailed"

#: Prefixes whose changes reach every test: the package sources, the C++ the
#: wasm module is built from, the test fixtures and the build configuration.
WHOLE_SCOPE_PREFIXES: tuple[str, ...] = ("ts", "core", "hive", ".aidev", ".gitlab-ci.yml", ".gitmodules")

IRRELEVANT: tuple[str, ...] = ("python", "rust", "examples")

_PROJECT_NAME = re.compile(r"""\bname:\s*["']([^"']+)["']""")
_TEST_MATCH = re.compile(r"""\btestMatch:\s*["']([^"']+)["']""")


def stale_rules(tree_root: str, approved_scope: Sequence[str]) -> tuple[str, ...]:
    """Why the table no longer describes the checkout at ``tree_root``; empty when it does."""
    stale = [f"{prefix} no longer exists in the checkout" for prefix in (*WHOLE_SCOPE_PREFIXES, DETAILED_TESTS_DIR) if not os.path.exists(os.path.join(tree_root, prefix))]
    test_matches = _test_matches(tree_root)
    if test_matches is None:
        return (*stale, f"{PLAYWRIGHT_CONFIG} no longer exists in the checkout")
    for project in approved_scope:
        pattern = test_matches.get(project)
        if pattern is None:
            stale.append(f"{project} is not a project with a testMatch in {PLAYWRIGHT_CONFIG}")
        elif "/" in pattern:
            stale.append(f"{project}'s testMatch {pattern!r} names a directory, which the table does not map")
    return tuple(stale)


def select(change: Change, tree_root: str, ctx: object) -> Selection:
    """Propose the offline Playwright projects ``change`` needs, or the whole approved scope."""
    approved: tuple[str, ...] = tuple(getattr(ctx, "approved_scope", ()))
    if not approved:
        # Without the scope the whole-scope rules would select nothing, which
        # reads as a narrowing; a base profile predating `targets` passes none.
        return Selection(degenerate=True, annotations=("no approved scope was given, so no narrower proposal than the whole scope can be made",))
    stale = stale_rules(tree_root, approved)
    if stale:
        why = f"the rule table is stale against this checkout, so the whole approved scope is proposed: {'; '.join(stale)}"
        return Selection(targets=approved, reasons=tuple((target, why) for target in approved), degenerate=True)

    test_matches = _test_matches(tree_root) or {}
    rules = [PathMapEntry(prefix=prefix, targets=approved, why=f"a change under {prefix} can affect every test") for prefix in WHOLE_SCOPE_PREFIXES]
    for path in change.paths:
        if os.path.dirname(path) == DETAILED_TESTS_DIR and path.endswith(".ts"):
            compiled = os.path.basename(path)[: -len(".ts")] + ".js"
            projects = tuple(project for project in approved if fnmatch.fnmatchcase(compiled, test_matches[project]))
            rules.append(PathMapEntry(prefix=path, targets=projects, why=f"{path} compiles to {compiled}, which the project's testMatch selects"))

    documentation = tuple(entry for entry in change.files if all(_is_documentation(path) for path in (entry.path, entry.old_path) if path))
    mapped = path_map(
        Change(base_rev=change.base_rev, head_rev=change.head_rev, files=tuple(entry for entry in change.files if entry not in documentation)),
        rules,
        irrelevant=IRRELEVANT,
        approved_scope=approved,
        durations=getattr(ctx, "target_durations", None),
    )
    irrelevant = {path for entry in documentation for path in (entry.path, entry.old_path) if path}
    return Selection(
        targets=mapped.targets,
        reasons=mapped.reasons,
        unrecognised=mapped.unrecognised,
        irrelevant=tuple(sorted(irrelevant.union(mapped.irrelevant))),
        estimated_fraction=mapped.estimated_fraction,
        degenerate=mapped.degenerate,
    )


def _test_matches(tree_root: str) -> dict[str, str] | None:
    """``project name -> testMatch`` from the Playwright config, ``None`` without one."""
    try:
        with open(os.path.join(tree_root, PLAYWRIGHT_CONFIG), encoding="utf-8") as config:
            text = config.read()
    except FileNotFoundError:
        return None
    names = list(_PROJECT_NAME.finditer(text))
    matches: dict[str, str] = {}
    for index, name in enumerate(names):
        end = names[index + 1].start() if index + 1 < len(names) else len(text)
        test_match = _TEST_MATCH.search(text, name.end(), end)
        if test_match:
            matches[name.group(1)] = test_match.group(1)
    return matches


def _is_documentation(path: str) -> bool:
    return path.endswith(".md") and not path.startswith("ts/")
