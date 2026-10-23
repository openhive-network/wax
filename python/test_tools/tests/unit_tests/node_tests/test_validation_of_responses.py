from __future__ import annotations

import json

import pytest
from beekeepy.communication import Request, RequestCommunicator, Response

from test_tools.__private.remote_node import RemoteNode
from test_tools.exceptions import SchemaValidationError


@pytest.fixture
def node(monkeypatch: pytest.MonkeyPatch) -> RemoteNode:
    """Node answering requests with results not matching their schemas (`head_block_number` is not a number)."""

    def send(_: RequestCommunicator, request: Request) -> Response:
        assert request.body is not None
        sent = json.loads(request.body)
        answers = [
            {"jsonrpc": "2.0", "id": call["id"], "result": {"head_block_number": "not a number"}}
            for call in (sent if isinstance(sent, list) else [sent])
        ]
        return Response(status_code=200, headers={}, body=json.dumps(answers if isinstance(sent, list) else answers[0]))

    monkeypatch.setattr(RequestCommunicator, "_send", send)
    return RemoteNode(http_endpoint="http://127.0.0.1:1")


def test_responses_are_validated(node: RemoteNode) -> None:
    with pytest.raises(SchemaValidationError):
        node.api.database.get_dynamic_global_properties()


def test_responses_of_batches_are_validated(node: RemoteNode) -> None:
    with pytest.raises(SchemaValidationError), node.batch() as batch:
        batch.api.database.get_dynamic_global_properties()
