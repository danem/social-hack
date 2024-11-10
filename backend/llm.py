from llama_index.core import Document, Settings
from llama_index.core.schema import TextNode, BaseNode
from llama_index.core.node_parser import TokenTextSplitter, SentenceWindowNodeParser, SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline, IngestionCache
from llama_index.readers.file import PDFReader, DocxReader, FlatReader  # type: ignore
from llama_index.embeddings.openai import OpenAIEmbedding, OpenAIEmbeddingMode, OpenAIEmbeddingModelType
from llama_index.core.extractors import (
    TitleExtractor,
    QuestionsAnsweredExtractor,
    SummaryExtractor,
    KeywordExtractor


)
from llama_index.core.indices import VectorStoreIndex
from llama_index.core.storage import StorageContext
from llama_index.core import SimpleDirectoryReader
from llama_index.vector_stores.supabase import SupabaseVectorStore
import tqdm
import functools

import backend.storage
import backend.config
import backend.models

from typing import List

class DocNodes:
    def __init__(self):
        self.doc_nodes: List[BaseNode] = []
        self.summary_nodes: List[BaseNode] = []
        self.keyword_nodes: List[BaseNode] = []
        self.qa_nodes: List[BaseNode] = []
    
    @property
    def nodes (self):
        return self.doc_nodes + self.summary_nodes + self.keyword_nodes + self.qa_nodes

def _create_text_node (orig: BaseNode, text: str):
    meta= {**orig.metadata, "doc_id": orig.id_}
    return TextNode(text=text, extra_info=meta)

def load_directory (path: str):
    reader = SimpleDirectoryReader(path)

    # pipeline = IngestionPipeline(
    #     transformations=[
    #         SentenceSplitter(paragraph_separator="\n\n", chunk_overlap=400),
    #         SummaryExtractor(),
    #         QuestionsAnsweredExtractor(),
    #         KeywordExtractor()
    #     ]
    # )
    result = DocNodes()
    result.doc_nodes = SentenceSplitter(paragraph_separator="\n\n", chunk_overlap=400)(reader.load_data())
    for n in tqdm.tqdm(SummaryExtractor()(result.doc_nodes)):
        result.summary_nodes.append(_create_text_node(n, n.metadata['section_summary']))
    for n in tqdm.tqdm(QuestionsAnsweredExtractor()(result.doc_nodes)):
        for line in n.metadata['questions_this_excerpt_can_answer'].split("\n"):
            result.qa_nodes.append(_create_text_node(n, line))
    for n in tqdm.tqdm(KeywordExtractor()(result.doc_nodes)):
        result.keyword_nodes.append(_create_text_node(n, n.metadata['excerpt_keywords']))
    return result


@functools.lru_cache
def get_vector_index(index_name: str):
    config = backend.config.get_config()
    embedding_model = OpenAIEmbedding(
        mode=OpenAIEmbeddingMode.TEXT_SEARCH_MODE, model=OpenAIEmbeddingModelType.TEXT_EMBED_3_SMALL
    )
    vstore = SupabaseVectorStore(
        postgres_connection_string=config.db_url,
        collection_name=index_name
    )
    ctx = StorageContext.from_defaults(vector_store=vstore)
    return VectorStoreIndex(nodes=[], embed_model=embedding_model, storage_context=ctx)
