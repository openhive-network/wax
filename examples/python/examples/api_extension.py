from __future__ import annotations

import asyncio
from typing import Any

from beekeepy.handle.remote import AbstractAsyncApi
from wax import create_hive_chain
from wax.api.collection import DatabaseApi as BaseDatabaseApi


# You can extend the base API classes to add your own methods and override existing methods to change their behavior.
# Please just remember to use the same class name as the one you are extending.
class DatabaseApi(BaseDatabaseApi):
    @BaseDatabaseApi.endpoint
    async def get_config(self) -> Any: ...


# You can also define your own API classes to add new APIs.
# To do this please use `AbstractAsyncApi` as a base class.
# To define endpoints use the `@AbstractAsyncApi.endpoint` decorator.
# Please remember that the class name must be the same as the name of the API you are defining.
# Please remember that all the endpoint parameters must be defined as keyword arguments.
class BlockApi(AbstractAsyncApi):
    @AbstractAsyncApi.endpoint
    async def get_block_header(self, *, block_num: int) -> Any: ...


# As the final step you need to create a new class that will contain all your custom APIs.
class MyFirstApiCollection:
    def __init__(self) -> None:
        self.block_api = BlockApi
        self.database_api = DatabaseApi


my_wax = create_hive_chain()
# Created by you api collection needs to be passed to the `extends` method.
# This will create a new class that will contain all your custom APIs.
# After extension all your APIs are available in the `api` property of the `ChainApi` class.
wax_extended = my_wax.extends(MyFirstApiCollection)


async def main() -> None:
    response = await wax_extended.api.block_api.get_block_header(block_num=123)
    print(f"Block header: {response}")

asyncio.run(main())
