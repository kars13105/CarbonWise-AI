"""
Carbon footprint calculation engine for CarbonWise AI.

Pure functions that compute emissions for each category using
centralized emission factors. All outputs are in kg CO2.
"""

from app.utils.constants import (
    TRANSPORT_FACTORS,
    ELECTRICITY_FACTOR,
    FLIGHT_FACTORS,
    FOOD_FACTORS,
    SHOPPING_FACTORS,
    MONTHS_PER_YEAR,
)


def calculate_transport(
    car_km: float, bike_km: float, bus_km: float, train_km: float
) -> float:
    """
    Calculate monthly transport emissions in kg CO2.

    Args:
        car_km: Monthly car kilometers
        bike_km: Monthly motorbike kilometers
        bus_km: Monthly bus kilometers
        train_km: Monthly train kilometers

    Returns:
        Total monthly transport emissions in kg CO2
    """
    return (
        car_km * TRANSPORT_FACTORS["car"]
        + bike_km * TRANSPORT_FACTORS["bike"]
        + bus_km * TRANSPORT_FACTORS["bus"]
        + train_km * TRANSPORT_FACTORS["train"]
    )


def calculate_electricity(kwh_per_month: float) -> float:
    """
    Calculate monthly electricity emissions in kg CO2.

    Args:
        kwh_per_month: Monthly electricity consumption in kWh

    Returns:
        Monthly electricity emissions in kg CO2
    """
    return kwh_per_month * ELECTRICITY_FACTOR


def calculate_flights(domestic_per_year: int, international_per_year: int) -> float:
    """
    Calculate monthly flight emissions in kg CO2.

    Flight emissions are annual, so we divide by 12 to get monthly.

    Args:
        domestic_per_year: Number of domestic flights per year
        international_per_year: Number of international flights per year

    Returns:
        Monthly flight emissions in kg CO2
    """
    annual = (
        domestic_per_year * FLIGHT_FACTORS["domestic"]
        + international_per_year * FLIGHT_FACTORS["international"]
    )
    return annual / MONTHS_PER_YEAR


def calculate_food(food_type: str) -> float:
    """
    Calculate monthly food-related emissions in kg CO2.

    Args:
        food_type: One of 'vegan', 'vegetarian', 'non-vegetarian'

    Returns:
        Monthly food emissions in kg CO2
    """
    return FOOD_FACTORS.get(food_type, FOOD_FACTORS["non-vegetarian"])


def calculate_shopping(shopping_level: str) -> float:
    """
    Calculate monthly shopping/consumption emissions in kg CO2.

    Args:
        shopping_level: One of 'low', 'medium', 'high'

    Returns:
        Monthly shopping emissions in kg CO2
    """
    return SHOPPING_FACTORS.get(shopping_level, SHOPPING_FACTORS["medium"])


def calculate_total(
    car_km: float,
    bike_km: float,
    bus_km: float,
    train_km: float,
    electricity_kwh: float,
    domestic_flights: int,
    international_flights: int,
    food_type: str,
    shopping_level: str,
) -> dict:
    """
    Calculate complete carbon footprint with breakdown.

    Returns a dict with monthly totals per category and overall totals.

    Args:
        All individual input parameters

    Returns:
        Dictionary with 'categories' breakdown, 'monthly_total_kg',
        'annual_total_kg', and 'annual_total_tonnes'.
    """
    transport = calculate_transport(car_km, bike_km, bus_km, train_km)
    electricity = calculate_electricity(electricity_kwh)
    flights = calculate_flights(domestic_flights, international_flights)
    food = calculate_food(food_type)
    shopping = calculate_shopping(shopping_level)

    monthly_total = transport + electricity + flights + food + shopping

    categories = {
        "transport": transport,
        "electricity": electricity,
        "flights": flights,
        "food": food,
        "shopping": shopping,
    }

    return {
        "categories": categories,
        "monthly_total_kg": round(monthly_total, 2),
        "annual_total_kg": round(monthly_total * MONTHS_PER_YEAR, 2),
        "annual_total_tonnes": round((monthly_total * MONTHS_PER_YEAR) / 1000, 2),
    }
