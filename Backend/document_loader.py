from pathlib import Path

from langchain_community.document_loaders import Docx2txtLoader, PyPDFLoader


def load_document(file_path):
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        loader = PyPDFLoader(file_path)
    elif extension == ".docx":
        loader = Docx2txtLoader(file_path)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or DOCX file.")

    return loader.load()
