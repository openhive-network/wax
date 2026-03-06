from __future__ import annotations

from pathlib import Path

import test_tools as tt
from test_tools.__private.complex_networks import networks_architecture as networks
from test_tools.__private.complex_networks.orchestration import generate_networks


def prepare_blocklog():
    # Before creating `config` take a look at `README.md`
    config = {}

    architecture = networks.NetworksArchitecture()
    architecture.load(config)

    tt.logger.info(architecture)

    generate_networks(architecture, Path("generated"))


if __name__ == "__main__":
    prepare_blocklog()
