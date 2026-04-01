from __future__ import annotations

import re


AMOUNT_PATTERN = re.compile(
    r"^\s*((?:\d+\s*/\s*\d+|\d+(?:\.\d+)?)(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:kg|g|mg|lb|lbs|oz|ml|l|cup|cups|tbsp|tsp|teaspoon|teaspoons|tablespoon|tablespoons|clove|cloves|slice|slices|can|cans|pinch|dash|packet|packets)?)\s+(.+)$",
    re.IGNORECASE,
)
WORD_AMOUNT_PATTERN = re.compile(
    r"^\s*(to taste|pinch|dash|drizzle|handful|sprinkling|bunch|leaves|pod(?: of)?)\s+(.+)$",
    re.IGNORECASE,
)
PREFIX_WORDS = {"of"}


def parse_ingredient_text(value: str) -> dict[str, str]:
    text = " ".join((value or "").strip().split())
    if not text:
        return {"item": "", "amount": ""}

    word_match = WORD_AMOUNT_PATTERN.match(text)
    if word_match:
        return {"item": word_match.group(2).strip(), "amount": word_match.group(1).strip()}

    match = AMOUNT_PATTERN.match(text)
    if match:
        amount = match.group(1).strip()
        item = match.group(2).strip()
        item_tokens = item.split()
        while item_tokens and item_tokens[0].lower() in PREFIX_WORDS:
            item_tokens.pop(0)
        return {"item": " ".join(item_tokens).strip() or text, "amount": amount}

    return {"item": text, "amount": ""}


def parse_ingredient_list(values: list[str] | None) -> list[dict[str, str]]:
    return [parsed for parsed in (parse_ingredient_text(value) for value in values or []) if parsed["item"]]
