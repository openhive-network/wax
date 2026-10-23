# mypy: ignore-errors
# ruff: noqa
# file for deletion after cli_wallet deprecation
from collections.abc import Callable
from datetime import datetime
import json
import time
from typing import Any, Callable

import requests

from schemas.fields.json_string import JsonString
from schemas._preconfigured_base_model import PreconfiguredBaseModel
from hiveio_api import Asset, HiveModel
from hiveio_api.client import to_api_builtins
from beekeepy.exceptions import UnableToAcquireDatabaseLockError, UnableToAcquireForkdbLockError, CommunicationError
from loguru import logger
from wax.helpy import Time


class CommonJsonEncoder(json.JSONEncoder):
    def __init__(self, *args: Any, testnet: Callable[[], bool] = lambda: True, **kwargs: Any) -> None:
        """`testnet` tells the network of the wallet (asked only for assets in the legacy form) - the testnet by default."""
        super().__init__(*args, **kwargs)
        self.testnet = testnet

    def default(self, o: Any):
        if isinstance(o, datetime):
            return Time.serialize(o)
        if isinstance(o, JsonString):
            return o.serialize()
        if isinstance(o, PreconfiguredBaseModel):
            return o.dict()
        if isinstance(o, HiveModel):  # public models (e.g. operations) - JSON keys of the API
            return o.dict()

        return super().default(o)


class LegacyJsonEncoder(CommonJsonEncoder):
    """Assets in the legacy form, with symbols of the network of the wallet."""

    def default(self, o: Any):
        if isinstance(o, Asset):
            return o.as_legacy(testnet=self.testnet())
        if isinstance(o, HiveModel):
            return to_api_builtins(o, testnet=self.testnet)
        return super().default(o)


class Hf26JsonEncoder(CommonJsonEncoder):
    def default(self, o: Any):
        if isinstance(o, Asset):
            return o.as_nai()
        return super().default(o)


def __workaround_communication_problem_with_node(send_request: Callable) -> Callable:
    """Workaround for "Unable to acquire database/forkdb lock" problem in node"""

    def __implementation(*args, **kwargs):
        while True:
            try:
                return send_request(*args, **kwargs)
            except (UnableToAcquireDatabaseLockError, UnableToAcquireForkdbLockError) as exception:
                logger.debug(
                    'Ignored "Unable to acquire '
                    f"{'database' if isinstance(exception, UnableToAcquireDatabaseLockError) else 'forkdb'} lock"
                    f"error during sending request: {exception.request}"
                )
                continue

    return __implementation


@__workaround_communication_problem_with_node
def request(
    url: str,
    message: dict,
    use_nai_assets: bool = False,
    max_attempts=3,
    seconds_between_attempts=0.2,
    *,
    testnet: Callable[[], bool] = lambda: True,
):
    assert max_attempts > 0

    json_encoder = LegacyJsonEncoder if not use_nai_assets else Hf26JsonEncoder
    body = json.dumps(message, cls=json_encoder, testnet=testnet)
    headers = {"Content-Type": "application/json"}
    decoded_content = "<NO RESPONSE>"

    for attempts_left in reversed(range(max_attempts)):
        response = requests.post(url, data=body, headers=headers)
        status_code = response.status_code
        try:
            decoded_content = response.content.decode("utf-8")
        except UnicodeDecodeError as exception:
            logger.error(
                "An error occurred while decoding the response content.\n\n"
                "Response content:\n"
                f"{response.content}"
            )  # fmt: skip
            raise exception

        response = json.loads(decoded_content)

        if status_code == 200:
            if "result" in response:
                return response

            if "error" in response:
                logger.debug(f"Error in response from {url}: message={body}, response={response}")
            else:
                raise CommunicationError(url, request=body, response=response)
        else:
            logger.debug(
                f"Received bad status code {status_code} != 200 from {url}, message={body}, response={response}"
            )
        if "Unable to acquire database lock" in decoded_content:
            raise UnableToAcquireDatabaseLockError(url=url, request=body, request_id=None)
        if attempts_left > 0:
            time.sleep(seconds_between_attempts)

    raise CommunicationError(url, request=body, response=decoded_content)
