"""
Input validation utilities for CarbonWise AI.

Provides sanitization and range checks for all user inputs.
"""

from typing import Optional


# Valid enum values
VALID_FOOD_TYPES = {"vegan", "vegetarian", "non-vegetarian"}
VALID_SHOPPING_LEVELS = {"low", "medium", "high"}

# Reasonable input ranges
INPUT_RANGES = {
    "km_per_month": (0, 50000),
    "kwh_per_month": (0, 10000),
    "flights_per_year": (0, 100),
}


class ValidationError(Exception):
    """Custom validation error with field-level detail."""

    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")


def validate_non_negative(value: float, field_name: str) -> float:
    """Ensure a numeric value is non-negative."""
    if value < 0:
        raise ValidationError(field_name, "Value must be non-negative")
    return value


def validate_range(
    value: float, field_name: str, min_val: float = 0, max_val: float = float("inf")
) -> float:
    """Validate that a value falls within an acceptable range."""
    if value < min_val or value > max_val:
        raise ValidationError(
            field_name, f"Value must be between {min_val} and {max_val}"
        )
    return value


def validate_food_type(food_type: str) -> str:
    """Validate food preference is a known type."""
    normalized = food_type.strip().lower().replace(" ", "-")
    if normalized not in VALID_FOOD_TYPES:
        raise ValidationError(
            "food_type",
            f"Must be one of: {', '.join(sorted(VALID_FOOD_TYPES))}",
        )
    return normalized


def validate_shopping_level(level: str) -> str:
    """Validate shopping level is a known category."""
    normalized = level.strip().lower()
    if normalized not in VALID_SHOPPING_LEVELS:
        raise ValidationError(
            "shopping_level",
            f"Must be one of: {', '.join(sorted(VALID_SHOPPING_LEVELS))}",
        )
    return normalized


def sanitize_string(value: Optional[str], max_length: int = 500) -> str:
    """Sanitize a string input by stripping and truncating."""
    if value is None:
        return ""
    cleaned = value.strip()
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
    return cleaned


def validate_transport_inputs(
    car_km: float, bike_km: float, bus_km: float, train_km: float
) -> dict:
    """Validate all transport inputs at once."""
    min_val, max_val = INPUT_RANGES["km_per_month"]
    return {
        "car_km": validate_range(car_km, "car_km", min_val, max_val),
        "bike_km": validate_range(bike_km, "bike_km", min_val, max_val),
        "bus_km": validate_range(bus_km, "bus_km", min_val, max_val),
        "train_km": validate_range(train_km, "train_km", min_val, max_val),
    }


def validate_electricity_input(kwh: float) -> float:
    """Validate electricity consumption."""
    min_val, max_val = INPUT_RANGES["kwh_per_month"]
    return validate_range(kwh, "electricity_kwh", min_val, max_val)


def validate_flight_inputs(domestic: int, international: int) -> dict:
    """Validate flight frequency inputs."""
    min_val, max_val = INPUT_RANGES["flights_per_year"]
    return {
        "domestic": int(validate_range(domestic, "domestic_flights", min_val, max_val)),
        "international": int(
            validate_range(international, "international_flights", min_val, max_val)
        ),
    }
