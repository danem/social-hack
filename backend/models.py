import functools
import supabase
import datetime
import pydantic

import backend.config
import backend.logger

_DOCUMENTS_TABLE_NAME = "documents"

class DocumentRecord(pydantic.BaseModel):
    filename: str
    filehash: str
    filepath: str

@functools.lru_cache
def get_database() -> supabase.Client:
    config = backend.config.get_config()
    engine = supabase.create_client(config.supa_url, config.supa_key)
    return engine


def save_document (client: supabase.Client, document: DocumentRecord):
    resp = client.table(_DOCUMENTS_TABLE_NAME).insert(document.model_dump(mode='python')).execute()
    print(resp)

