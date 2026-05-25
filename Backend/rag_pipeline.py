from vector_store import load_vector_store
from llm import generate_answer


def build_retrieval_query(query, history=None):
    if not history:
        return query

    recent_history = history[-4:]
    history_text = "\n".join(
        f"{message['role']}: {message['content']}" for message in recent_history
    )

    return f"{history_text}\nuser: {query}"


def ask_question(query, history=None):

    db = load_vector_store()

    retrieval_query = build_retrieval_query(query, history)

    results = db.similarity_search(retrieval_query, k=8)

    context = ""

    for doc in results:
        context += doc.page_content + "\n"

    answer = generate_answer(query, context, history)

    return answer
