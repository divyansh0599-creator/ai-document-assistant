from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def format_history(history):
    if not history:
        return "No previous conversation."

    lines = []
    for message in history:
        speaker = "User" if message["role"] == "user" else "Assistant"
        lines.append(f"{speaker}: {message['content']}")

    return "\n".join(lines)


def generate_answer(question, context, history=None):

    prompt = f"""
You are a document assistant.

Answer the question ONLY using the provided document context and previous conversation.

If the answer is not present in the context, respond with:
"I could not find the answer in the uploaded document."

Do NOT use your own knowledge.

Previous conversation:
{format_history(history or [])}

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
