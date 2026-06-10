"""
Tests for progress tracking endpoints.

Tests CRUD operations on snapshots and goals.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.database import init_db, Base, engine


client = TestClient(app)

# Use a unique session ID for each test run to avoid conflicts
TEST_SESSION = "test-session-progress-001"


@pytest.fixture(autouse=True)
def setup_db():
    """Ensure clean database for each test."""
    init_db()
    yield


class TestProgressSnapshot:
    """Test snapshot save and retrieve operations."""

    def test_save_snapshot(self):
        response = client.post("/api/progress", json={
            "session_id": TEST_SESSION,
            "total_emissions": 5.5,
            "carbon_score": 65,
            "breakdown": {
                "transport": 150,
                "electricity": 246,
                "flights": 100,
                "food": 100,
                "shopping": 100,
            },
        })
        assert response.status_code == 200
        data = response.json()
        assert data["session_id"] == TEST_SESSION
        assert data["total_emissions"] == 5.5
        assert data["carbon_score"] == 65
        assert "id" in data
        assert "timestamp" in data

    def test_retrieve_progress(self):
        # Save two snapshots
        client.post("/api/progress", json={
            "session_id": TEST_SESSION,
            "total_emissions": 6.0,
            "carbon_score": 60,
            "breakdown": {"transport": 200},
        })
        client.post("/api/progress", json={
            "session_id": TEST_SESSION,
            "total_emissions": 5.0,
            "carbon_score": 70,
            "breakdown": {"transport": 150},
        })

        response = client.get(f"/api/progress/{TEST_SESSION}")
        assert response.status_code == 200
        data = response.json()
        assert len(data["snapshots"]) >= 2

    def test_empty_progress(self):
        response = client.get("/api/progress/nonexistent-session")
        assert response.status_code == 200
        data = response.json()
        assert data["snapshots"] == []
        assert data["goal"] is None


class TestGoals:
    """Test reduction goal operations."""

    def test_set_goal(self):
        response = client.post("/api/progress/goal", json={
            "session_id": TEST_SESSION,
            "target_reduction_percent": 15.0,
            "target_date": "2026-12-31",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["target_reduction_percent"] == 15.0
        assert data["is_achieved"] is False

    def test_update_goal(self):
        # Set initial goal
        client.post("/api/progress/goal", json={
            "session_id": TEST_SESSION,
            "target_reduction_percent": 10.0,
        })

        # Update goal
        response = client.post("/api/progress/goal", json={
            "session_id": TEST_SESSION,
            "target_reduction_percent": 20.0,
        })
        assert response.status_code == 200
        assert response.json()["target_reduction_percent"] == 20.0

    def test_goal_progress_tracking(self):
        unique_session = "goal-progress-test-session"

        # Save initial snapshot
        client.post("/api/progress", json={
            "session_id": unique_session,
            "total_emissions": 10.0,
            "carbon_score": 50,
            "breakdown": {"transport": 300},
        })

        # Save improved snapshot (20% reduction)
        client.post("/api/progress", json={
            "session_id": unique_session,
            "total_emissions": 8.0,
            "carbon_score": 60,
            "breakdown": {"transport": 240},
        })

        # Set goal of 15% reduction
        client.post("/api/progress/goal", json={
            "session_id": unique_session,
            "target_reduction_percent": 15.0,
        })

        # Check progress
        response = client.get(f"/api/progress/{unique_session}")
        data = response.json()
        assert data["goal"] is not None
        assert data["goal"]["current_reduction_percent"] == 20.0
        assert data["goal"]["is_achieved"] is True


class TestChallenges:
    """Test badge/challenge endpoints."""

    def test_no_badges_initially(self):
        response = client.get("/api/challenges/brand-new-session")
        assert response.status_code == 200
        badges = response.json()
        earned = [b for b in badges if b["earned"]]
        assert len(earned) == 0

    def test_first_calculation_badge(self):
        session = "badge-test-session"
        # Save a snapshot to trigger "first_calculation"
        client.post("/api/progress", json={
            "session_id": session,
            "total_emissions": 5.0,
            "carbon_score": 65,
            "breakdown": {"transport": 150},
        })

        response = client.get(f"/api/challenges/{session}")
        badges = response.json()
        eco_beginner = next(b for b in badges if b["id"] == "eco_beginner")
        assert eco_beginner["earned"] is True

    def test_score_badges(self):
        session = "score-badge-test"
        client.post("/api/progress", json={
            "session_id": session,
            "total_emissions": 1.0,
            "carbon_score": 95,
            "breakdown": {"transport": 20},
        })

        response = client.get(f"/api/challenges/{session}")
        badges = {b["id"]: b["earned"] for b in response.json()}
        assert badges["eco_explorer"] is True   # score >= 50
        assert badges["green_champion"] is True  # score >= 70
        assert badges["sustainability_master"] is True  # score >= 90
