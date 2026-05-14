MAX_HISTORY_MESSAGES = 10

_conversations = {}


def get_history(session_id):
    return _conversations.get(session_id, [])


def add_turn(session_id, question, answer):
    history = _conversations.setdefault(session_id, [])
    history.extend(
        [
            {"role": "user", "content": question},
            {"role": "assistant", "content": answer},
        ]
    )

    if len(history) > MAX_HISTORY_MESSAGES:
        _conversations[session_id] = history[-MAX_HISTORY_MESSAGES:]


def clear_history(session_id):
    _conversations.pop(session_id, None)
