from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path


LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "recommendations.jsonl"

_recommendation_logger = logging.getLogger("cookai.recommendations")
if not _recommendation_logger.handlers:
    handler = logging.FileHandler(LOG_FILE)
    handler.setFormatter(logging.Formatter("%(message)s"))
    _recommendation_logger.addHandler(handler)
    _recommendation_logger.setLevel(logging.INFO)
    _recommendation_logger.propagate = False


def log_recommendation_event(data: dict):
    payload = {
        "user_id": data.get("user_id"),
        "query": data.get("query"),
        "extracted_ingredients": data.get("extracted_ingredients", []),
        "recommended_recipe_ids": data.get("recommended_recipe_ids", []),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    try:
        _recommendation_logger.info(json.dumps(payload, ensure_ascii=True))
    except Exception:
        # Logging should never break the request path.
        return
