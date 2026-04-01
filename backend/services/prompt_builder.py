from __future__ import annotations

import json


SYSTEM_MESSAGE = (
    "You are an expert cooking assistant for CookAI. "
    "You suggest recipes based only on the provided context unless you clearly mark a fallback idea as general guidance. "
    "Be concise, practical, helpful, and natural. "
    "Always prioritize the user's ingredients, constraints, and likely intent. "
    "Always prioritize retrieved recipes before general cooking ideas. "
    "If a recipe is NOT present in the retrieved list, you MUST explicitly state that it is a general suggestion and not from the system recommendations. "
    "Never imply that a fallback recipe came from the system recommendations. "
    "Explain why your suggestions match. "
    "Keep your answer under 200 words."
)


def build_chat_prompt(
    user_query: str,
    extracted_ingredients: list[str],
    recipes: list[dict],
    history: list[dict] | None = None,
) -> dict[str, str]:
    recent_history = (history or [])[-2:]
    history_block = json.dumps(recent_history, ensure_ascii=True, indent=2)
    recipes_block = json.dumps(recipes[:5], ensure_ascii=True, indent=2)
    ingredients_block = json.dumps(extracted_ingredients, ensure_ascii=True)

    user_message = (
        "USER CONTEXT BLOCK\n"
        f"User query:\n{user_query}\n\n"
        f"Extracted ingredients:\n{ingredients_block}\n\n"
        "RECENT CHAT HISTORY\n"
        f"{history_block}\n\n"
        "RETRIEVED RECIPES (JSON)\n"
        f"{recipes_block}\n\n"
        "INSTRUCTION BLOCK\n"
        "Recommend the best matching recipes from the retrieved list first.\n"
        "Explain why they match the user's request, ingredients, or constraints.\n"
        "Suggest practical variations or substitutions if helpful.\n"
        "Only fall back to general cooking suggestions when the retrieved recipes are insufficient.\n"
        "If you use a fallback suggestion, explicitly say it is a general suggestion and not from the system recommendations.\n"
        "Be clear, human-like, and concise.\n"
    )

    return {
        "system": SYSTEM_MESSAGE,
        "user": user_message,
    }
