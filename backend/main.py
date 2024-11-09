import backend.llm
import backend.storage
import backend.models
import os


def upload_doc (path: str):
    storage = backend.storage.get_storage()
    db = backend.models.get_database()
    with storage.transaction:
        with open(path, 'rb') as f:
            fname = os.path.basename(path)
            fpath = backend.storage.get_file_path(storage, fname)
            storage.write_bytes(fpath, f.read())
            doc = backend.models.DocumentRecord(
                filename= fname,
                filepath= fpath,
                filehash=str(storage.checksum(fpath)),
                id = None,
                created_at=None
            )
            backend.models.save_document(db, doc)
    
    




