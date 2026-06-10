"""
Pydantic schemas for CarbonWise AI API request/response models.

All models use strict validation via Pydantic v2.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ─── Request Models ─────────────────────────────────────────────────────────────


class TransportInput(BaseModel):
    """Monthly transport usage in kilometers."""

    car_km: float = Field(default=0, ge=0, le=50000, description="Car km per month")
    bike_km: float = Field(
        default=0, ge=0, le=50000, description="Motorbike km per month"
    )
    bus_km: float = Field(default=0, ge=0, le=50000, description="Bus km per month")
    train_km: float = Field(
        default=0, ge=0, le=50000, description="Train km per month"
    )


class FlightsInput(BaseModel):
    """Annual flight frequency."""

    domestic: int = Field(
        default=0, ge=0, le=100, description="Domestic flights per year"
    )
    international: int = Field(
        default=0, ge=0, le=100, description="International flights per year"
    )


class CarbonInput(BaseModel):
    """Complete carbon footprint input from the calculator form."""

    transport: TransportInput = Field(default_factory=TransportInput)
    electricity_kwh: float = Field(
        default=0, ge=0, le=10000, description="Monthly kWh consumption"
    )
    flights: FlightsInput = Field(default_factory=FlightsInput)
    food_type: str = Field(
        default="non-vegetarian",
        description="Diet type: vegan, vegetarian, non-vegetarian",
    )
    shopping_level: str = Field(
        default="medium", description="Consumption level: low, medium, high"
    )


class ScenarioInput(BaseModel):
    """Input for the scenario simulator comparing current vs projected."""

    current: CarbonInput
    projected: CarbonInput


class AICoachRequest(BaseModel):
    """Request body for the AI sustainability coach."""

    total_annual_emissions: float = Field(
        ge=0, description="Total annual CO2 in tonnes"
    )
    breakdown: dict = Field(description="Category-level breakdown in kg CO2")
    carbon_score: int = Field(ge=0, le=100, description="Carbon health score")
    food_type: str = Field(default="non-vegetarian")
    shopping_level: str = Field(default="medium")


class GoalInput(BaseModel):
    """Reduction goal setting."""

    session_id: str = Field(min_length=1, max_length=100)
    target_reduction_percent: float = Field(
        ge=1, le=100, description="Target reduction percentage"
    )
    target_date: Optional[str] = Field(
        default=None, description="Target date (ISO format)"
    )


class SnapshotInput(BaseModel):
    """Save a progress snapshot."""

    session_id: str = Field(min_length=1, max_length=100)
    total_emissions: float = Field(ge=0, description="Annual emissions in tonnes CO2")
    carbon_score: int = Field(ge=0, le=100)
    breakdown: dict = Field(description="Category breakdown")


# ─── Response Models ────────────────────────────────────────────────────────────


class CategoryBreakdown(BaseModel):
    """Emission breakdown for a single category."""

    category: str
    monthly_kg: float
    annual_kg: float
    annual_tonnes: float
    percentage: float


class ScoreInfo(BaseModel):
    """Carbon health score with interpretation."""

    score: int
    label: str
    color: str
    description: str


class CarbonResult(BaseModel):
    """Complete carbon footprint calculation result."""

    monthly_total_kg: float
    annual_total_kg: float
    annual_total_tonnes: float
    breakdown: list[CategoryBreakdown]
    score: ScoreInfo
    largest_contributor: str
    smallest_contributor: str
    insights: list[str]


class ScenarioResult(BaseModel):
    """Scenario simulation comparison result."""

    current: CarbonResult
    projected: CarbonResult
    reduction_kg: float
    reduction_percent: float


class ProgressSnapshot(BaseModel):
    """A saved progress snapshot."""

    id: int
    session_id: str
    timestamp: str
    total_emissions: float
    carbon_score: int
    breakdown: dict


class GoalResponse(BaseModel):
    """Goal tracking response."""

    target_reduction_percent: float
    current_reduction_percent: float
    target_date: Optional[str]
    is_achieved: bool


class ProgressResponse(BaseModel):
    """Complete progress data for a session."""

    snapshots: list[ProgressSnapshot]
    goal: Optional[GoalResponse]


class BadgeResponse(BaseModel):
    """A single badge/challenge."""

    id: str
    name: str
    description: str
    icon: str
    earned: bool


class AICoachResponse(BaseModel):
    """Response from the AI sustainability coach."""

    plan: str
    generated_at: str
