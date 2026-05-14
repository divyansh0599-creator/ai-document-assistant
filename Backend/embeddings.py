from langchain_community.embeddings import HuggingFaceEmbeddings


def get_embeddings():

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-MiniLM-L3-v2"
    )

    return embedding_model