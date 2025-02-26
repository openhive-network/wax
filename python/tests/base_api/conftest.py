from __future__ import annotations

import re
import shutil
from pathlib import Path
from typing import TYPE_CHECKING, AsyncGenerator, Generator

import pytest

from beekeepy import AsyncBeekeeper, Settings
from wax import ITransaction, IWaxBaseInterface, create_wax_foundation

if TYPE_CHECKING:
    from beekeepy import AsyncUnlockedWallet


@pytest.fixture(autouse=True)
def beekeeper_output_dir(request: pytest.FixtureRequest) -> Generator[Path, None, None]:
    function_dir = __get_directory_for_function(request)

    if function_dir.exists():
        shutil.rmtree(function_dir)

    function_dir.mkdir(exist_ok=True)

    yield function_dir

    if not any(function_dir.iterdir()):
        shutil.rmtree(function_dir)


@pytest.fixture
async def beekeeper(beekeeper_output_dir: Path) -> AsyncGenerator[AsyncBeekeeper, None]:
    async with await AsyncBeekeeper.factory(settings=Settings(working_directory=beekeeper_output_dir)) as beekeeper:
        yield beekeeper


@pytest.fixture
async def wallet(beekeeper: AsyncBeekeeper) -> AsyncUnlockedWallet:
    session = await beekeeper.create_session()
    await session.create_wallet(name="beekeeper_wallet_name", password="beekeeper_wallet_password")  # noqa: S106

    return await (await session.open_wallet(name="beekeeper_wallet_name")).unlock("beekeeper_wallet_password")


@pytest.fixture
def wax() -> IWaxBaseInterface:
    return create_wax_foundation()


@pytest.fixture
def tapos() -> str:
    return "04c507a8c7fe5be96be64ce7c86855e1806cbde3"


@pytest.fixture
def transaction(wax: IWaxBaseInterface, tapos: str) -> ITransaction:
    return wax.create_transaction_with_tapos(tapos)


def __convert_test_name_to_directory_name(test_name: str) -> str:
    def __truncate_name(name: str, max_length: int = 100) -> str:
        if len(name) > max_length:
            return name[:max_length] + "_truncated"
        return name

    directory_name = []

    parametrized_test_match = re.match(r"([\w_]+)\[(.*)\]", test_name)
    if parametrized_test_match:
        test_name = f"{parametrized_test_match[1]}_with_parameters_{parametrized_test_match[2]}"

    for character in test_name:
        character_to_append = character
        if not (character_to_append.isalnum() or character_to_append in "-_"):
            character_to_append = f"-0x{ord(character):X}-"

        directory_name.append(character_to_append)

    return __truncate_name("".join(directory_name))


def __get_directory_for_function(request: pytest.FixtureRequest) -> Path:
    assert request.scope == "function"
    directory_name = __convert_test_name_to_directory_name(request.node.name)
    return Path(request.node.fspath.dirpath() / "generated_during_" + directory_name)
