from fastapi import FastAPI
from fastapi import UploadFile, File
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from conversation_memory import add_turn, clear_history, get_history
from document_loader import load_document
from text_splitter import split_text
from vector_store import create_vector_store
from rag_pipeline import ask_question

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str
    session_id: str = "default"


@app.get("/")
def home():

    return {
        "message": "AI Backend Running"
    }


@app.post("/ask")
def ask_question_api(data: QuestionRequest):

    question = data.question
    session_id = data.session_id

    history = get_history(session_id)

    answer = ask_question(question, history)

    add_turn(session_id, question, answer)

    return {
        "question": question,
        "answer": answer,
        "history": get_history(session_id)
    }


@app.delete("/history/{session_id}")
def clear_history_api(session_id: str):

    clear_history(session_id)

    return {"message": "History cleared successfully"}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):

    file_path = f"../Data/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    # Process file
    docs = load_document(file_path)
    chunks = split_text(docs)
    create_vector_store(chunks)

    return {"message": "File uploaded successfully"}
