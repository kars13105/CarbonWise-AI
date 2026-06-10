"""
Carbon health score calculation service.

Maps annual CO2 emissions to a 0-100 score where higher = better (lower emissions).
"""

from app.utils.constants import SCORE_THRESHOLDS, SCORE_LABELS


def calculate_carbon_score(annual_emissions_tonnes: float) -> dict:
    """
    Calculate a carbon health score from 0-100 based on annual emissions.

    Lower emissions yield higher scores.

    Args:
        annual_emissions_tonnes: Total annual CO2 emissions in tonnes

    Returns:
        Dictionary with 'score', 'label', 'color', and 'description'
    """
    emissions = max(0, annual_emissions_tonnes)

    if emissions <= SCORE_THRESHOLDS["excellent_max"]:
        # 0-2 tonnes: score 90-100
        ratio = emissions / SCORE_THRESHOLDS["excellent_max"]
        score = int(100 - (ratio * 10))
        info = SCORE_LABELS["excellent"]
    elif emissions <= SCORE_THRESHOLDS["good_max"]:
        # 2-5 tonnes: score 70-89
        range_size = (
            SCORE_THRESHOLDS["good_max"] - SCORE_THRESHOLDS["excellent_max"]
        )
        ratio = (emissions - SCORE_THRESHOLDS["excellent_max"]) / range_size
        score = int(89 - (ratio * 19))
        info = SCORE_LABELS["good"]
    elif emissions <= SCORE_THRESHOLDS["moderate_max"]:
        # 5-10 tonnes: score 50-69
        range_size = (
            SCORE_THRESHOLDS["moderate_max"] - SCORE_THRESHOLDS["good_max"]
        )
        ratio = (emissions - SCORE_THRESHOLDS["good_max"]) / range_size
        score = int(69 - (ratio * 19))
        info = SCORE_LABELS["moderate"]
    else:
        # >10 tonnes: score 0-49
        # Asymptotically approach 0 for very high emissions
        excess = emissions - SCORE_THRESHOLDS["moderate_max"]
        score = max(0, int(49 - (excess * 2)))
        info = SCORE_LABELS["needs_improvement"]

    score = max(0, min(100, score))

    return {
        "score": score,
        "label": info["label"],
        "color": info["color"],
        "description": _get_score_description(score, emissions),
    }


def _get_score_description(score: int, emissions: float) -> str:
    """Generate a human-readable description of the score."""
    if score >= 90:
        return (
            f"Outstanding! At {emissions:.1f} tonnes CO2/year, "
            f"you're well below the global average. Keep it up!"
        )
    elif score >= 70:
        return (
            f"Good job! At {emissions:.1f} tonnes CO2/year, "
            f"you're below the global average of 4.7 tonnes."
        )
    elif score >= 50:
        return (
            f"You're at {emissions:.1f} tonnes CO2/year. "
            f"There's room for improvement — small changes can make a big difference."
        )
    else:
        return (
            f"At {emissions:.1f} tonnes CO2/year, your footprint is above average. "
            f"Consider the recommendations to reduce your impact."
        )
