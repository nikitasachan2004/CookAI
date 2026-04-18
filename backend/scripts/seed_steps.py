from __future__ import annotations

import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app
from db import db
from db_schema import ensure_schema
from models.recipe import Recipe
from models.recipe_step import RecipeStep
from utils.instruction_parser import parse_instructions


def main() -> None:
    processed = 0
    total_steps = 0

    with app.app_context():
        ensure_schema()
        recipes = Recipe.query.order_by(Recipe.id.asc()).all()

        for recipe in recipes:
            if not recipe.instructions or recipe.steps:
                continue

            parsed_steps = parse_instructions(recipe.instructions)
            if not parsed_steps:
                continue

            for step in parsed_steps:
                db.session.add(
                    RecipeStep(
                        recipe_id=recipe.id,
                        step_number=step["step"],
                        instruction=step["instruction"],
                        timer_minutes=step["timer_minutes"],
                    )
                )

            processed += 1
            total_steps += len(parsed_steps)

        db.session.commit()

    average_steps = round(total_steps / processed, 1) if processed else 0.0
    print(f"✅ Parsed steps for {processed} recipes. Average {average_steps} steps per recipe.")


if __name__ == "__main__":
    main()
