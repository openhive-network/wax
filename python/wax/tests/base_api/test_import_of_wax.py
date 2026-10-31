from __future__ import annotations

import subprocess
import sys
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from pathlib import Path


def test_import_of_wax_does_not_import_clients_of_apis(tmp_path: Path) -> None:
    """Clients of APIs of `WaxApiCollection` are imported when a chain is created - they take long to import."""
    # ARRANGE
    code = (
        "import sys, wax; "
        "print(sorted(name for name in sys.modules if name.startswith('hiveio_api.') and name.endswith('_api_client')))"
    )

    # ACT
    result = subprocess.run(  # in another directory - not to import sources of wax from the current one
        [sys.executable, "-c", code], capture_output=True, text=True, check=True, cwd=tmp_path
    )

    # ASSERT
    assert result.stdout.strip() == "[]"
