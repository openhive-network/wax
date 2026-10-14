from __future__ import annotations

from beekeepy.handle.remote import AbstractSyncApi
from hiveio_api._validation import network_node_api  # validation models: responses decoded with Hive types


class NetworkNodeApi(AbstractSyncApi):
    api = AbstractSyncApi.endpoint_jsonrpc

    @api
    def get_info(self) -> network_node_api.NetworkNodeGetInfoResponse:
        raise NotImplementedError

    @api
    def add_node(self, *, endpoint: str) -> network_node_api.NetworkNodeAddNodeResponse:
        raise NotImplementedError

    @api
    def set_allowed_peers(self, *, allowed_peers: list[str]) -> network_node_api.NetworkNodeSetAllowedPeersResponse:
        raise NotImplementedError

    @api
    def get_connected_peers(self) -> network_node_api.NetworkNodeGetConnectedPeersResponse:
        raise NotImplementedError
