from __future__ import annotations

from dataclasses import dataclass
from threading import Lock

from sklearn.feature_extraction.text import TfidfVectorizer

from ml.preprocess import get_recipe_dataset_signature, load_recipe_dataframe


@dataclass
class VectorStore:
    signature: tuple[int, str]
    dataframe: object
    vectorizer: TfidfVectorizer
    matrix: object


_cache_lock = Lock()
_vector_store: VectorStore | None = None


def _build_vector_store() -> VectorStore:
    dataframe = load_recipe_dataframe()
    corpus = dataframe["ingredients_text"].fillna("").tolist() if not dataframe.empty else []

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(corpus) if corpus else None

    return VectorStore(
        signature=get_recipe_dataset_signature(),
        dataframe=dataframe,
        vectorizer=vectorizer,
        matrix=matrix,
    )


def get_vector_store(force_refresh: bool = False) -> VectorStore:
    """Return a cached TF-IDF vector store, rebuilding only when recipe data changes."""
    global _vector_store

    current_signature = get_recipe_dataset_signature()

    if (
        not force_refresh
        and _vector_store is not None
        and _vector_store.signature == current_signature
    ):
        return _vector_store

    with _cache_lock:
        if (
            force_refresh
            or _vector_store is None
            or _vector_store.signature != current_signature
        ):
            _vector_store = _build_vector_store()
        return _vector_store
