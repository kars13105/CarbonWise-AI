"""
Tests for the AI coach endpoint.

Tests mock the Gemini API to avoid real API calls during testing.
"""

from unittest.mock import patch, AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class TestAICoachEndpoint:
    """Test the /api/ai-coach endpoint."""

    @patch("app.routes.ai_coach.generate_sustainability_plan")
    def test_successful_plan_generation(self, mock_generate):
        """Test successful AI coach response."""
        mock_generate.return_value = {
            "plan": "# Your Sustainability Plan\n\n## Immediate Actions\n- Reduce car usage by 20%",
            "generated_at": "2025-01-01T00:00:00+00:00",
        }

        response = client.post("/api/ai-coach", json={
            "total_annual_emissions": 5.5,
            "breakdown": {
                "transport": 150,
                "electricity": 246,
                "flights": 100,
                "food": 100,
                "shopping": 100,
            },
            "carbon_score": 65,
            "food_type": "non-vegetarian",
            "shopping_level": "medium",
        })

        assert response.status_code == 200
        data = response.json()
        assert "plan" in data
        assert "generated_at" in data
        assert len(data["plan"]) > 0

    @patch("app.routes.ai_coach.generate_sustainability_plan")
    def test_api_key_missing(self, mock_generate):
        """Test error when API key is not configured."""
        mock_generate.side_effect = ValueError("GEMINI_API_KEY not set")

        response = client.post("/api/ai-coach", json={
            "total_annual_emissions": 5.5,
            "breakdown": {"transport": 150},
            "carbon_score": 65,
        })

        assert response.status_code == 503

    @patch("app.routes.ai_coach.generate_sustainability_plan")
    def test_gemini_api_error(self, mock_generate):
        """Test error handling when Gemini API fails."""
        mock_generate.side_effect = Exception("API rate limit exceeded")

        response = client.post("/api/ai-coach", json={
            "total_annual_emissions": 5.5,
            "breakdown": {"transport": 150},
            "carbon_score": 65,
        })

        assert response.status_code == 500

    def test_invalid_input_rejected(self):
        """Test that invalid input is rejected."""
        response = client.post("/api/ai-coach", json={
            "total_annual_emissions": -1,
            "breakdown": {},
            "carbon_score": 150,  # Out of range
        })

        assert response.status_code == 422

    def test_missing_required_fields(self):
        """Test that missing required fields are rejected."""
        response = client.post("/api/ai-coach", json={})
        assert response.status_code == 422
