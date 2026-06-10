"""
Carbon footprint calculation and scenario simulation routes.
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    CarbonInput,
    CarbonResult,
    CategoryBreakdown,
    ScenarioInput,
    ScenarioResult,
    ScoreInfo,
)
from app.services.calculation_engine import calculate_total
from app.services.score_service import calculate_carbon_score
from app.utils.validators import validate_food_type, validate_shopping_level, ValidationError

router = APIRouter(prefix="/api", tags=["calculator"])


def _compute_result(data: CarbonInput) -> CarbonResult:
    """Shared logic to compute a full CarbonResult from CarbonInput."""
    try:
        food_type = validate_food_type(data.food_type)
        shopping_level = validate_shopping_level(data.shopping_level)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    result = calculate_total(
        car_km=data.transport.car_km,
        bike_km=data.transport.bike_km,
        bus_km=data.transport.bus_km,
        train_km=data.transport.train_km,
        electricity_kwh=data.electricity_kwh,
        domestic_flights=data.flights.domestic,
        international_flights=data.flights.international,
        food_type=food_type,
        shopping_level=shopping_level,
    )

    categories = result["categories"]
    monthly_total = result["monthly_total_kg"]

    # Build breakdown with percentages
    breakdown = []
    for cat_name, monthly_kg in categories.items():
        percentage = (monthly_kg / monthly_total * 100) if monthly_total > 0 else 0
        annual_kg = monthly_kg * 12
        breakdown.append(
            CategoryBreakdown(
                category=cat_name,
                monthly_kg=round(monthly_kg, 2),
                annual_kg=round(annual_kg, 2),
                annual_tonnes=round(annual_kg / 1000, 2),
                percentage=round(percentage, 1),
            )
        )

    # Sort by percentage descending
    breakdown.sort(key=lambda x: x.percentage, reverse=True)

    # Score
    score_data = calculate_carbon_score(result["annual_total_tonnes"])
    score = ScoreInfo(**score_data)

    # Insights
    largest = breakdown[0].category if breakdown else "N/A"
    smallest = breakdown[-1].category if breakdown else "N/A"

    insights = _generate_insights(breakdown, result["annual_total_tonnes"])

    return CarbonResult(
        monthly_total_kg=result["monthly_total_kg"],
        annual_total_kg=result["annual_total_kg"],
        annual_total_tonnes=result["annual_total_tonnes"],
        breakdown=breakdown,
        score=score,
        largest_contributor=largest,
        smallest_contributor=smallest,
        insights=insights,
    )


def _generate_insights(breakdown: list[CategoryBreakdown], annual_tonnes: float) -> list[str]:
    """Generate key insights from the breakdown."""
    insights = []

    if breakdown:
        top = breakdown[0]
        insights.append(
            f"{top.category.title()} contributes {top.percentage}% of your emissions "
            f"({top.annual_tonnes:.1f} tonnes/year)."
        )

    if annual_tonnes <= 2:
        insights.append(
            "Your footprint is well below the global average of 4.7 tonnes/year. "
            "Excellent work!"
        )
    elif annual_tonnes <= 4.7:
        insights.append(
            f"At {annual_tonnes:.1f} tonnes/year, you're below the global average of 4.7 tonnes."
        )
    else:
        insights.append(
            f"At {annual_tonnes:.1f} tonnes/year, your footprint exceeds the global "
            f"average of 4.7 tonnes. Focus on reducing your top category."
        )

    # Category-specific tips
    for cat in breakdown:
        if cat.category == "transport" and cat.percentage > 40:
            insights.append(
                "💡 Switching to public transport or cycling could significantly "
                "reduce your emissions."
            )
        elif cat.category == "electricity" and cat.percentage > 30:
            insights.append(
                "💡 Consider renewable energy options or energy-efficient appliances."
            )
        elif cat.category == "flights" and cat.percentage > 25:
            insights.append(
                "💡 Reducing one international flight can save over 1 tonne of CO2."
            )

    return insights[:5]  # Cap at 5 insights


@router.post("/calculate", response_model=CarbonResult)
async def calculate_footprint(data: CarbonInput):
    """
    Calculate carbon footprint from user inputs.

    Returns total emissions, category breakdown, health score, and insights.
    """
    return _compute_result(data)


@router.post("/simulate", response_model=ScenarioResult)
async def simulate_scenario(data: ScenarioInput):
    """
    Compare current vs projected lifestyle emissions.

    Returns both results with reduction metrics.
    """
    current = _compute_result(data.current)
    projected = _compute_result(data.projected)

    reduction_kg = current.annual_total_kg - projected.annual_total_kg
    reduction_percent = (
        (reduction_kg / current.annual_total_kg * 100)
        if current.annual_total_kg > 0
        else 0
    )

    return ScenarioResult(
        current=current,
        projected=projected,
        reduction_kg=round(reduction_kg, 2),
        reduction_percent=round(reduction_percent, 1),
    )
