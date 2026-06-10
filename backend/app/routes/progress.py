"""
Progress tracking routes — save snapshots, set goals, track history.
"""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.database import get_db, ProgressSnapshotDB, ReductionGoalDB
from app.models.schemas import (
    GoalInput,
    GoalResponse,
    ProgressResponse,
    ProgressSnapshot,
    SnapshotInput,
)

router = APIRouter(prefix="/api", tags=["progress"])


@router.post("/progress", response_model=ProgressSnapshot)
async def save_snapshot(data: SnapshotInput, db: Session = Depends(get_db)):
    """Save a progress snapshot for a session."""
    snapshot = ProgressSnapshotDB(
        session_id=data.session_id,
        total_emissions=data.total_emissions,
        carbon_score=data.carbon_score,
        breakdown_json=json.dumps(data.breakdown),
    )
    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)

    return ProgressSnapshot(
        id=snapshot.id,
        session_id=snapshot.session_id,
        timestamp=snapshot.timestamp.isoformat(),
        total_emissions=snapshot.total_emissions,
        carbon_score=snapshot.carbon_score,
        breakdown=data.breakdown,
    )


@router.get("/progress/{session_id}", response_model=ProgressResponse)
async def get_progress(session_id: str, db: Session = Depends(get_db)):
    """Retrieve all progress data for a session."""
    snapshots = (
        db.query(ProgressSnapshotDB)
        .filter(ProgressSnapshotDB.session_id == session_id)
        .order_by(ProgressSnapshotDB.timestamp.asc())
        .all()
    )

    snapshot_list = [
        ProgressSnapshot(
            id=s.id,
            session_id=s.session_id,
            timestamp=s.timestamp.isoformat(),
            total_emissions=s.total_emissions,
            carbon_score=s.carbon_score,
            breakdown=json.loads(s.breakdown_json),
        )
        for s in snapshots
    ]

    # Get goal if exists
    goal_db = (
        db.query(ReductionGoalDB)
        .filter(ReductionGoalDB.session_id == session_id)
        .first()
    )

    goal = None
    if goal_db and len(snapshot_list) >= 1:
        first_emissions = snapshot_list[0].total_emissions
        latest_emissions = snapshot_list[-1].total_emissions

        if first_emissions > 0:
            current_reduction = (
                (first_emissions - latest_emissions) / first_emissions * 100
            )
        else:
            current_reduction = 0

        goal = GoalResponse(
            target_reduction_percent=goal_db.target_reduction_percent,
            current_reduction_percent=round(current_reduction, 1),
            target_date=goal_db.target_date,
            is_achieved=current_reduction >= goal_db.target_reduction_percent,
        )

    return ProgressResponse(snapshots=snapshot_list, goal=goal)


@router.post("/progress/goal", response_model=GoalResponse)
async def set_goal(data: GoalInput, db: Session = Depends(get_db)):
    """Set or update a reduction target for a session."""
    existing = (
        db.query(ReductionGoalDB)
        .filter(ReductionGoalDB.session_id == data.session_id)
        .first()
    )

    if existing:
        existing.target_reduction_percent = data.target_reduction_percent
        existing.target_date = data.target_date
    else:
        goal = ReductionGoalDB(
            session_id=data.session_id,
            target_reduction_percent=data.target_reduction_percent,
            target_date=data.target_date,
        )
        db.add(goal)

    db.commit()

    return GoalResponse(
        target_reduction_percent=data.target_reduction_percent,
        current_reduction_percent=0,
        target_date=data.target_date,
        is_achieved=False,
    )
