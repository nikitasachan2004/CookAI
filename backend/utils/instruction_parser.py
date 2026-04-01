from __future__ import annotations

import re


NUMBERED_SPLIT_PATTERN = re.compile(r"(?:^|\n|\r)(?:\s*(?:step\s*)?\d+\s*[\.\):\-])\s*", re.IGNORECASE)
TIMER_PATTERN = re.compile(
    r"(?P<value>\d+)\s*(?P<unit>hours?|hrs?|hr|minutes?|mins?|min)\b",
    re.IGNORECASE,
)


def _extract_timer_minutes(text: str) -> int | None:
    lowered = text.lower()
    if "overnight" in lowered:
        return 480

    match = TIMER_PATTERN.search(text)
    if not match:
        return None

    value = int(match.group("value"))
    unit = match.group("unit").lower()
    if unit.startswith("hour") or unit in {"hr", "hrs"}:
        return value * 60
    return value


def _split_raw_steps(raw_text: str) -> list[str]:
    text = (raw_text or "").strip()
    if not text:
        return []

    numbered_parts = [part.strip() for part in NUMBERED_SPLIT_PATTERN.split(text) if part.strip()]
    if len(numbered_parts) > 1:
        expanded_parts: list[str] = []
        for part in numbered_parts:
            sub_parts = [segment.strip() for segment in re.split(r"\n+", part) if segment.strip()]
            expanded_parts.extend(sub_parts if len(sub_parts) > 1 else [part])
        return expanded_parts

    paragraph_parts = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
    if len(paragraph_parts) > 1:
        return paragraph_parts

    sentence_parts = [part.strip() for part in re.split(r"(?<=[.!?])\s+", text) if part.strip()]
    return sentence_parts


def parse_instructions(raw_text: str) -> list[dict]:
    parts = _split_raw_steps(raw_text)
    cleaned_parts: list[str] = []

    for part in parts:
        normalized = " ".join(part.strip().split())
        if not normalized:
            continue
        if cleaned_parts and len(normalized) < 10:
            cleaned_parts[-1] = f"{cleaned_parts[-1]} {normalized}".strip()
            continue
        cleaned_parts.append(normalized)
        if len(cleaned_parts) >= 20:
            break

    expanded_parts: list[str] = []
    for part in cleaned_parts:
        sentences = [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", part) if sentence.strip()]
        should_expand = len(sentences) >= 3 or (len(sentences) == 2 and len(part) > 160)
        if should_expand:
            for sentence in sentences:
                if expanded_parts and len(sentence) < 10:
                    expanded_parts[-1] = f"{expanded_parts[-1]} {sentence}".strip()
                else:
                    expanded_parts.append(sentence)
                if len(expanded_parts) >= 20:
                    break
        else:
            expanded_parts.append(part)
        if len(expanded_parts) >= 20:
            break

    return [
        {
            "step": index,
            "instruction": instruction,
            "timer_minutes": _extract_timer_minutes(instruction),
        }
        for index, instruction in enumerate(expanded_parts, start=1)
    ]
