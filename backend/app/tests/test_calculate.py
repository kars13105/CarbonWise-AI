"""
Tests for the carbon footprint calculation engine and API routes.

Tests verify:
- Individual category calculations match expected emission factors
- Total calculation aggregates correctly
- API endpoint returns proper response structure
- Edge cases (zero inputs, max inputs)
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.calculation_engine import (
    calculate_transport,
    calculate_electricity,
    calculate_flights,
    calculate_food,
    calculate_shopping,
    calculate_total,
)
from app.utils.constants import (
    TRANSPORT_FACTORS,
    ELECTRICITY_FACTOR,
    FLIGHT_FACTORS,
    FOOD_FACTORS,
    SHOPPING_FACTORS,
)


client = TestClient(app)


# ─── Unit Tests: Calculation Engine ─────────────────────────────────────────────


class TestTransportCalculation:
    """Test transport emission calculations."""

    def test_car_only(self):
        result = calculate_transport(car_km=1000, bike_km=0, bus_km=0, train_km=0)
        assert result == 1000 * TRANSPORT_FACTORS["car"]

    def test_all_modes(self):
        result = calculate_transport(car_km=500, bike_km=200, bus_km=300, train_km=100)
        expected = (
            500 * TRANSPORT_FACTORS["car"]
            + 200 * TRANSPORT_FACTORS["bike"]
            + 300 * TRANSPORT_FACTORS["bus"]
            + 100 * TRANSPORT_FACTORS["train"]
        )
        assert result == pytest.approx(expected)

    def test_zero_inputs(self):
        result = calculate_transport(car_km=0, bike_km=0, bus_km=0, train_km=0)
        assert result == 0


class TestElectricityCalculation:
    """Test electricity emission calculations."""

    def test_standard_usage(self):
        result = calculate_electricity(kwh_per_month=300)
        assert result == 300 * ELECTRICITY_FACTOR

    def test_zero_usage(self):
        result = calculate_electricity(kwh_per_month=0)
        assert result == 0

    def test_high_usage(self):
        result = calculate_electricity(kwh_per_month=1000)
        assert result == 1000 * ELECTRICITY_FACTOR


class TestFlightCalculation:
    """Test flight emission calculations."""

    def test_domestic_only(self):
        result = calculate_flights(domestic_per_year=4, international_per_year=0)
        expected = (4 * FLIGHT_FACTORS["domestic"]) / 12
        assert result == pytest.approx(expected)

    def test_international_only(self):
        result = calculate_flights(domestic_per_year=0, international_per_year=2)
        expected = (2 * FLIGHT_FACTORS["international"]) / 12
        assert result == pytest.approx(expected)

    def test_no_flights(self):
        result = calculate_flights(domestic_per_year=0, international_per_year=0)
        assert result == 0


class TestFoodCalculation:
    """Test food emission calculations."""

    def test_vegan(self):
        assert calculate_food("vegan") == FOOD_FACTORS["vegan"]

    def test_vegetarian(self):
        assert calculate_food("vegetarian") == FOOD_FACTORS["vegetarian"]

    def test_non_vegetarian(self):
        assert calculate_food("non-vegetarian") == FOOD_FACTORS["non-vegetarian"]

    def test_unknown_defaults_to_non_veg(self):
        assert calculate_food("unknown") == FOOD_FACTORS["non-vegetarian"]

    def test_vegan_is_lowest(self):
        assert calculate_food("vegan") < calculate_food("vegetarian")
        assert calculate_food("vegetarian") < calculate_food("non-vegetarian")


class TestShoppingCalculation:
    """Test shopping emission calculations."""

    def test_low(self):
        assert calculate_shopping("low") == SHOPPING_FACTORS["low"]

    def test_medium(self):
        assert calculate_shopping("medium") == SHOPPING_FACTORS["medium"]

    def test_high(self):
        assert calculate_shopping("high") == SHOPPING_FACTORS["high"]

    def test_low_is_lowest(self):
        assert calculate_shopping("low") < calculate_shopping("medium")
        assert calculate_shopping("medium") < calculate_shopping("high")


class TestTotalCalculation:
    """Test the full calculation pipeline."""

    def test_total_structure(self):
        result = calculate_total(
            car_km=500,
            bike_km=100,
            bus_km=200,
            train_km=50,
            electricity_kwh=300,
            domestic_flights=2,
            international_flights=1,
            food_type="vegetarian",
            shopping_level="medium",
        )
        assert "categories" in result
        assert "monthly_total_kg" in result
        assert "annual_total_kg" in result
        assert "annual_total_tonnes" in result

    def test_total_has_all_categories(self):
        result = calculate_total(
            car_km=0, bike_km=0, bus_km=0, train_km=0,
            electricity_kwh=0, domestic_flights=0, international_flights=0,
            food_type="vegan", shopping_level="low",
        )
        cats = result["categories"]
        assert set(cats.keys()) == {"transport", "electricity", "flights", "food", "shopping"}

    def test_annual_is_12x_monthly(self):
        result = calculate_total(
            car_km=500, bike_km=0, bus_km=0, train_km=0,
            electricity_kwh=300, domestic_flights=0, international_flights=0,
            food_type="vegan", shopping_level="low",
        )
        assert result["annual_total_kg"] == pytest.approx(
            result["monthly_total_kg"] * 12, rel=1e-2
        )

    def test_zero_inputs_give_nonzero_food_shopping(self):
        """Even with zero transport/electricity/flights, food+shopping contribute."""
        result = calculate_total(
            car_km=0, bike_km=0, bus_km=0, train_km=0,
            electricity_kwh=0, domestic_flights=0, international_flights=0,
            food_type="vegan", shopping_level="low",
        )
        assert result["monthly_total_kg"] > 0


# ─── API Integration Tests ──────────────────────────────────────────────────────


class TestCalculateEndpoint:
    """Test the /api/calculate endpoint."""

    def test_valid_request(self):
        response = client.post("/api/calculate", json={
            "transport": {"car_km": 500, "bike_km": 0, "bus_km": 200, "train_km": 0},
            "electricity_kwh": 300,
            "flights": {"domestic": 2, "international": 1},
            "food_type": "vegetarian",
            "shopping_level": "medium",
        })
        assert response.status_code == 200
        data = response.json()
        assert "monthly_total_kg" in data
        assert "annual_total_tonnes" in data
        assert "breakdown" in data
        assert "score" in data
        assert len(data["breakdown"]) == 5

    def test_default_values(self):
        response = client.post("/api/calculate", json={})
        assert response.status_code == 200
        data = response.json()
        assert data["annual_total_tonnes"] > 0

    def test_invalid_food_type(self):
        response = client.post("/api/calculate", json={
            "food_type": "invalid_type",
        })
        assert response.status_code == 422

    def test_negative_values_rejected(self):
        response = client.post("/api/calculate", json={
            "transport": {"car_km": -100},
        })
        assert response.status_code == 422

    def test_score_in_valid_range(self):
        response = client.post("/api/calculate", json={
            "transport": {"car_km": 100},
            "electricity_kwh": 100,
            "food_type": "vegan",
            "shopping_level": "low",
        })
        data = response.json()
        assert 0 <= data["score"]["score"] <= 100

    def test_breakdown_percentages_sum_to_100(self):
        response = client.post("/api/calculate", json={
            "transport": {"car_km": 500},
            "electricity_kwh": 300,
            "flights": {"domestic": 2, "international": 1},
            "food_type": "non-vegetarian",
            "shopping_level": "high",
        })
        data = response.json()
        total_pct = sum(cat["percentage"] for cat in data["breakdown"])
        assert total_pct == pytest.approx(100, abs=1)


class TestSimulateEndpoint:
    """Test the /api/simulate endpoint."""

    def test_simulation_shows_reduction(self):
        response = client.post("/api/simulate", json={
            "current": {
                "transport": {"car_km": 1000},
                "electricity_kwh": 500,
                "flights": {"domestic": 4, "international": 2},
                "food_type": "non-vegetarian",
                "shopping_level": "high",
            },
            "projected": {
                "transport": {"car_km": 200, "bus_km": 500},
                "electricity_kwh": 300,
                "flights": {"domestic": 2, "international": 0},
                "food_type": "vegetarian",
                "shopping_level": "low",
            },
        })
        assert response.status_code == 200
        data = response.json()
        assert data["reduction_percent"] > 0
        assert data["projected"]["annual_total_tonnes"] < data["current"]["annual_total_tonnes"]


class TestHealthEndpoint:
    """Test health check endpoints."""

    def test_root(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "running"

    def test_health(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
