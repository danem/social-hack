from llama_index.core import Document, Settings
from llama_index.core.node_parser import TokenTextSplitter, SentenceWindowNodeParser, SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline, IngestionCache
from llama_index.readers.file import PDFReader, DocxReader, FlatReader  # type: ignore
from llama_index.core.extractors import (
    TitleExtractor,
    QuestionsAnsweredExtractor,
    SummaryExtractor,
)
from llama_index.embeddings.openai import OpenAIEmbedding, OpenAIEmbeddingMode, OpenAIEmbeddingModelType
from llama_index.core.indices import VectorStoreIndex
from llama_index.core.storage import StorageContext
from llama_index.vector_stores.lantern import LanternVectorStore
import functools
import pathlib

import backend.storage
import backend.config
import backend.models


def _to_llama_documents(storage: backend.storage.Storage, document: backend.models.DocumentRecord):
    # TODO Use storage layer, llama-index uses fsspec
    docs = []
    if document.filename.endswith("pdf"):
        docs = PDFReader(True).load_data(pathlib.Path(document.filepath), fs=storage)
    elif document.filepath.endswith("docx"):
        docs = DocxReader().load_data(pathlib.Path(document.filepath), fs=storage)
    else:
        # TODO: Handle other doc types
        docs = FlatReader().load_data(pathlib.Path(document.filepath))
    for doc in docs:
        doc.metadata["date_added"] = doc.metadata.get("date_added", str(document.created_at))

    return docs


def index_document(storage: backend.storage.Storage, index: VectorStoreIndex, document: backend.models.DocumentRecord):
    parser = SentenceWindowNodeParser.from_defaults()
    docs = _to_llama_documents(storage, document)
    nodes = parser.get_nodes_from_documents(docs)
    index.insert_nodes(nodes)


def delete_document(index: VectorStoreIndex, document: backend.models.DocumentRecord):
    pass


@functools.lru_cache
def get_vector_index():
    config = backend.config.get_config()
    # TODO: Use local embedding model
    embedding_model = OpenAIEmbedding(
        mode=OpenAIEmbeddingMode.TEXT_SEARCH_MODE, model=OpenAIEmbeddingModelType.TEXT_EMBED_3_SMALL
    )
    vstore = LanternVectorStore.from_params(
        host=config.db_host,
        database=config.db_name,
        port=config.db_port,
        user=config.db_user,
        password=config.db_password,
        embed_dim=3072,
        # embed_dim=embed_dim,
        hybrid_search=True,
        perform_setup=True,
        text_search_config="english",
        m=16,
        ef_construction=128,  # HNSW ef construction parameter
        ef=64,  # HNSW ef search parameter
    )
    ctx = StorageContext.from_defaults(vector_store=vstore)
    index = VectorStoreIndex(nodes=[], embed_model=embedding_model, storage_context=ctx)
    return index
