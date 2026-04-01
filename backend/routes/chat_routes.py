from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from threading import Lock
from time import time

from services.chat_service import generate_chat_response
from utils.auth_utils import error_response

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")
RATE_LIMIT_MAX_REQUESTS = 10
RATE_LIMIT_WINDOW_SECONDS = 60
_rate_limit_store: dict[str, list[float]] = {}
_rate_limit_lock = Lock()


def _get_rate_limit_key(user_id: int | None, remote_addr: str | None) -> str:
    if user_id is not None:
        return f"user:{user_id}"
    return f"ip:{remote_addr or 'unknown'}"


def _is_rate_limited(key: str) -> bool:
    now = time()
    with _rate_limit_lock:
        timestamps = _rate_limit_store.get(key, [])
        timestamps = [timestamp for timestamp in timestamps if now - timestamp < RATE_LIMIT_WINDOW_SECONDS]
        if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
            _rate_limit_store[key] = timestamps
            return True
        timestamps.append(now)
        _rate_limit_store[key] = timestamps
        return False


@chat_bp.route("", methods=["POST"])
def chat():
    data = request.get_json(silent=True)
    if data is None or not isinstance(data, dict):
        return error_response("Request body must be valid JSON", 400)

    message = (data.get("message") or "").strip()
    if not message:
        return error_response("Field 'message' is required", 400)

    history = data.get("history", [])
    if history is not None and not isinstance(history, list):
        return error_response("Field 'history' must be a list when provided", 400)

    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        user_id = int(identity) if identity is not None else None
    except Exception:
        user_id = None

    rate_limit_key = _get_rate_limit_key(user_id=user_id, remote_addr=request.remote_addr)
    if _is_rate_limited(rate_limit_key):
        return error_response("Too many requests. Please try again later.", 429)

    try:
        result = generate_chat_response(message=message, user_id=user_id, history=history)
    except ValueError as exc:
        return error_response(str(exc), 400)
    except RuntimeError as exc:
        return error_response(str(exc), 500)
    except Exception:
        return error_response("AI chat service failed", 502)

    return result, 200
