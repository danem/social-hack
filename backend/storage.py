import uuid
import functools
from fsspec.implementations.dirfs import DirFileSystem  # type: ignore
from fsspec.implementations.local import LocalFileSystem  # type: ignore
from fsspec import AbstractFileSystem  # type: ignore

import backend.config

Storage = AbstractFileSystem


def get_file_path(storage: AbstractFileSystem, filename: str | None):
    prefix = uuid.uuid4().hex
    filename = filename or ""
    return prefix + filename


@functools.lru_cache
def get_storage() -> AbstractFileSystem:
    config = backend.config.get_config()
    fs = LocalFileSystem()
    return DirFileSystem(config.storage_root, fs)
