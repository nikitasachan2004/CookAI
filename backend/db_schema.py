from __future__ import annotations

from sqlalchemy import text

from db import db


RECIPE_COLUMN_UPDATES = [
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cook_time INTEGER",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS servings INTEGER DEFAULT 2",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50)",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS image_url TEXT",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS local_image_path TEXT",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS source_url TEXT",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0",
]
RECIPE_STEP_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS recipe_steps (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        step_number INTEGER NOT NULL,
        instruction TEXT NOT NULL,
        timer_minutes INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_recipe_steps_recipe_id ON recipe_steps(recipe_id)",
]


def ensure_schema() -> None:
    """Apply lightweight idempotent schema updates for evolving local databases."""
    for statement in RECIPE_COLUMN_UPDATES:
        db.session.execute(text(statement))
    for statement in RECIPE_STEP_STATEMENTS:
        db.session.execute(text(statement))
    db.session.commit()
