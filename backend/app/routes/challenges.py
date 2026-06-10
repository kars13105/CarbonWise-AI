"""
Sustainability challenges and badge routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db, ProgressSnapshotDB, ReductionGoalDB
from app.models.schemas import BadgeResponse
from app.utils.constants import BADGES

router = APIRouter(prefix="/api", tags=["challenges"])


@router.get("/challenges/{session_id}", response_model=list[BadgeResponse])
async def get_challenges(session_id: str, db: Session = Depends(get_db)):
    """
    Get all challenges/badges with earned status for a session.

    Badge criteria:
    - first_calculation: Has at least 1 snapshot
    - score_50/70/90: Best score meets threshold
    - snapshots_3: Has 3+ snapshots
    - goal_set: Has a reduction goal
    - reduction_10: Achieved 10%+ reduction from first snapshot
    """
    snapshots = (
        db.query(ProgressSnapshotDB)
        .filter(ProgressSnapshotDB.session_id == session_id)
        .order_by(ProgressSnapshotDB.timestamp.asc())
        .all()
    )

    goal = (
        db.query(ReductionGoalDB)
        .filter(ReductionGoalDB.session_id == session_id)
        .first()
    )

    # Compute earned status for each badge
    has_snapshots = len(snapshots) > 0
    best_score = max((s.carbon_score for s in snapshots), default=0)
    snapshot_count = len(snapshots)
    has_goal = goal is not None

    # Calculate reduction from first snapshot
    reduction_percent = 0
    if len(snapshots) >= 2:
        first = snapshots[0].total_emissions
        latest = snapshots[-1].total_emissions
        if first > 0:
            reduction_percent = (first - latest) / first * 100

    badges = []
    for badge_def in BADGES:
        earned = _check_criteria(
            badge_def["criteria"],
            has_snapshots=has_snapshots,
            best_score=best_score,
            snapshot_count=snapshot_count,
            has_goal=has_goal,
            reduction_percent=reduction_percent,
        )
        badges.append(
            BadgeResponse(
                id=badge_def["id"],
                name=badge_def["name"],
                description=badge_def["description"],
                icon=badge_def["icon"],
                earned=earned,
            )
        )

    return badges


def _check_criteria(
    criteria: str,
    has_snapshots: bool,
    best_score: int,
    snapshot_count: int,
    has_goal: bool,
    reduction_percent: float,
) -> bool:
    """Check if a badge criteria is met."""
    checks = {
        "first_calculation": has_snapshots,
        "score_50": best_score >= 50,
        "score_70": best_score >= 70,
        "score_90": best_score >= 90,
        "snapshots_3": snapshot_count >= 3,
        "goal_set": has_goal,
        "reduction_10": reduction_percent >= 10,
    }
    return checks.get(criteria, False)
