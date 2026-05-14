from langchain_community.vectorstores import Chroma
from embeddings import get_embeddings


def create_vector_store(chunks):

    embeddings = get_embeddings()

    db = Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory="vector_db"
    )

    return db


def load_vector_store():

    embeddings = get_embeddings()

    db = Chroma(
        persist_directory="vector_db",
        embedding_function=embeddings
    )

    return db