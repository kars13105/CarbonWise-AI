"""
Centralized emission factors and constants for CarbonWise AI.

All emission values are in kg CO2 equivalent.
Sources: EPA, DEFRA, IEA averages for general-purpose estimation.
"""

# ─── Transport Emission Factors (kg CO2 per km) ────────────────────────────────

TRANSPORT_FACTORS = {
    "car": 0.19,       # Average passenger car
    "bus": 0.08,       # Public bus per passenger
    "train": 0.04,     # Electric/diesel train per passenger
    "bike": 0.10,      # Motorcycle/motorbike
}

# ─── Electricity Emission Factor (kg CO2 per kWh) ──────────────────────────────

ELECTRICITY_FACTOR = 0.82  # Global average grid intensity

# ─── Flight Emission Factors (kg CO2 per flight) ───────────────────────────────

FLIGHT_FACTORS = {
    "domestic": 255.0,        # Average domestic round-trip (~1000 km)
    "international": 1100.0,  # Average international round-trip (~4000 km)
}

# ─── Food Emission Factors (kg CO2 per month) ──────────────────────────────────

FOOD_FACTORS = {
    "vegan": 50.0,           # Plant-based diet
    "vegetarian": 100.0,     # Lacto-ovo vegetarian
    "non-vegetarian": 200.0, # Includes meat regularly
}

# ─── Shopping/Consumption Emission Factors (kg CO2 per month) ───────────────────

SHOPPING_FACTORS = {
    "low": 30.0,      # Minimal consumption, second-hand
    "medium": 100.0,  # Average consumer
    "high": 200.0,    # Frequent shopper, fast fashion
}

# ─── Carbon Health Score Thresholds ─────────────────────────────────────────────

# Annual emissions thresholds in tonnes CO2 for score calculation
SCORE_THRESHOLDS = {
    "excellent_max": 2.0,    # <= 2 tonnes = score 90-100
    "good_max": 5.0,         # <= 5 tonnes = score 70-89
    "moderate_max": 10.0,    # <= 10 tonnes = score 50-69
    # > 10 tonnes = score 0-49
}

SCORE_LABELS = {
    "excellent": {"min": 90, "max": 100, "label": "Excellent", "color": "#10B981"},
    "good": {"min": 70, "max": 89, "label": "Good", "color": "#3B82F6"},
    "moderate": {"min": 50, "max": 69, "label": "Moderate", "color": "#F59E0B"},
    "needs_improvement": {"min": 0, "max": 49, "label": "Needs Improvement", "color": "#EF4444"},
}

# ─── Badge / Challenge Definitions ──────────────────────────────────────────────

BADGES = [
    {
        "id": "eco_beginner",
        "name": "Eco Beginner",
        "description": "Calculate your first carbon footprint",
        "icon": "🌱",
        "criteria": "first_calculation",
    },
    {
        "id": "eco_explorer",
        "name": "Eco Explorer",
        "description": "Achieve a carbon score of 50 or higher",
        "icon": "🔍",
        "criteria": "score_50",
    },
    {
        "id": "green_champion",
        "name": "Green Champion",
        "description": "Achieve a carbon score of 70 or higher",
        "icon": "🏆",
        "criteria": "score_70",
    },
    {
        "id": "sustainability_master",
        "name": "Sustainability Master",
        "description": "Achieve a carbon score of 90 or higher",
        "icon": "🌍",
        "criteria": "score_90",
    },
    {
        "id": "consistent_tracker",
        "name": "Consistent Tracker",
        "description": "Save 3 or more progress snapshots",
        "icon": "📊",
        "criteria": "snapshots_3",
    },
    {
        "id": "goal_setter",
        "name": "Goal Setter",
        "description": "Set a reduction target",
        "icon": "🎯",
        "criteria": "goal_set",
    },
    {
        "id": "improver",
        "name": "Carbon Reducer",
        "description": "Reduce your emissions by 10% from your first snapshot",
        "icon": "📉",
        "criteria": "reduction_10",
    },
]

# ─── Global Averages for Context ────────────────────────────────────────────────

GLOBAL_AVERAGES = {
    "world": 4.7,       # tonnes CO2 per capita per year
    "usa": 14.7,
    "eu": 6.1,
    "india": 1.9,
    "china": 7.7,
}

# ─── Months per Year ───────────────────────────────────────────────────────────

MONTHS_PER_YEAR = 12
