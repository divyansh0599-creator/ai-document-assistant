from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import WebBaseLoader

# def load_website(url):
#     loader = WebBaseLoader(url)
#     docs = loader.load()
#     return docs

def load_document(file_path):

    loader = PyPDFLoader(file_path)

    documents = loader.load()

    return documents