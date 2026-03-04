from flask import Blueprint, request

from evaluation.evaluator import evaluate_all_users
from utils.auth_utils import error_response

evaluation_bp = Blueprint("evaluation", __name__, url_prefix="/api/evaluation")


@evaluation_bp.route("", methods=["GET"])
def get_evaluation_metrics():
    raw_k = request.args.get("k", "5")
    try:
        k = int(raw_k)
    except ValueError:
        return error_response("Query parameter 'k' must be an integer", 400)

    if k <= 0:
        return error_response("Query parameter 'k' must be greater than 0", 400)

    return evaluate_all_users(k=k), 200
