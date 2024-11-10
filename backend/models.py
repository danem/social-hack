import functools
import supabase
import datetime
import pydantic

import backend.config
import backend.storage

_DOCUMENTS_TABLE_NAME = "documents"

class DocumentRecord(pydantic.BaseModel):
    filename: str
    filehash: str
    filepath: str
    created_at: str

@functools.lru_cache
def get_database() -> supabase.Client:
    config = backend.config.get_config()
    engine = supabase.create_client(config.supa_url, config.supa_key)
    return engine

def create_document (
    filename: str,
    filehash: str,
    filepath: str
):
    return DocumentRecord(
        filehash=filehash,
        filename=filename,
        filepath=filepath,
        created_at=datetime.datetime.now().isoformat()
    )

def save_document (client: supabase.Client, document: DocumentRecord):
    resp = client.table(_DOCUMENTS_TABLE_NAME).insert(document.model_dump(mode='python')).execute()
    print(resp)

