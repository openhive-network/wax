# private-test-exempt: NetworkWrapper is the element type of NetworksArchitecture.networks and is not exported from test_tools.complex_networks; promoting it would widen the public surface for a type used only by this test's helper
from __future__ import annotations

from typing import TYPE_CHECKING, Any

import pytest

from test_tools.__private.complex_networks import NetworksArchitecture, prepare_time_offsets

if TYPE_CHECKING:
    from test_tools.__private.complex_networks.networks_architecture import NetworkWrapper

FIVE_NETWORKS_OF_FOUR_WITNESS_NODES_CONFIG = {
    "networks": [
        {"InitNode": True, "ApiNode": True, "WitnessNodes": [1, 1, 1, 1]},
        {"WitnessNodes": [1, 1, 1, 1]},
        {"WitnessNodes": [1, 1, 1, 1]},
        {"WitnessNodes": [1, 1, 1, 1]},
        {"WitnessNodes": [1, 1, 1, 1]},
    ]
}


def _count_described_nodes(network: NetworkWrapper) -> int:
    init_node = 1 if network.init_node is not None else 0
    return init_node + len(network.api_node) + len(network.full_api_node) + len(network.witness_nodes)


@pytest.mark.parametrize(
    ("config", "expected_nodes_number"),
    [
        ({"networks": [{"InitNode": True}]}, 1),
        ({"networks": [{"ApiNode": True}]}, 1),
        ({"networks": [{"ApiNode": 3}]}, 3),
        ({"networks": [{"ApiNode": {"Active": 2, "Prepare": True}}]}, 2),
        ({"networks": [{"FullApiNode": True}]}, 1),
        ({"networks": [{"FullApiNode": 2}]}, 2),
        ({"networks": [{"WitnessNodes": [1, 2, {"Witnesses": 4, "Prepare": False}]}]}, 3),
        (
            {
                "networks": [
                    {"InitNode": True, "ApiNode": True, "FullApiNode": True, "WitnessNodes": [1, 2]},
                    {"ApiNode": {"Active": True, "Prepare": False}, "WitnessNodes": [6, 5]},
                ]
            },
            8,
        ),
        (FIVE_NETWORKS_OF_FOUR_WITNESS_NODES_CONFIG, 22),
    ],
)
def test_nodes_number_equals_number_of_described_nodes(config: dict[str, Any], expected_nodes_number: int) -> None:
    # ARRANGE
    architecture = NetworksArchitecture()

    # ACT
    architecture.load(config)

    # ASSERT
    assert architecture.nodes_number == expected_nodes_number
    assert sum(_count_described_nodes(network) for network in architecture.networks) == expected_nodes_number


def test_time_offsets_prepared_for_nodes_number_cover_every_node() -> None:
    # ARRANGE
    architecture = NetworksArchitecture()
    architecture.load(FIVE_NETWORKS_OF_FOUR_WITNESS_NODES_CONFIG)

    # ACT
    time_offsets = prepare_time_offsets(architecture.nodes_number)

    # ASSERT
    assert len(time_offsets) == sum(_count_described_nodes(network) for network in architecture.networks)
