"""
Google Gemini AI service for sustainability coaching.

Constructs structured prompts from user footprint data and returns
personalized sustainability plans.
"""

import os
from datetime import datetime, timezone
import asyncio

import google.generativeai as genai


# Model configuration
GEMINI_MODEL = "gemini-flash-latest"
MAX_OUTPUT_TOKENS = 2048
TEMPERATURE = 0.7


def _get_client():
    """Initialize and return the Gemini client."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY environment variable is not set. "
            "Please add it to your .env file."
        )
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(GEMINI_MODEL)


def _build_prompt(
    total_annual_emissions: float,
    breakdown: dict,
    carbon_score: int,
    food_type: str,
    shopping_level: str,
) -> str:
    """
    Build a structured prompt for the Gemini AI model.

    Args:
        total_annual_emissions: Total annual CO2 in tonnes
        breakdown: Category-level breakdown dict
        carbon_score: Carbon health score (0-100)
        food_type: User's diet type
        shopping_level: User's shopping consumption level

    Returns:
        Formatted prompt string
    """
    # Format breakdown for readability
    breakdown_text = "\n".join(
        f"  - {cat.title()}: {val:.1f} kg CO2/month"
        for cat, val in breakdown.items()
    )

    return f"""You are an expert sustainability coach. A user has calculated their carbon footprint using our platform. Based on their data, provide a personalized sustainability plan.

## User's Carbon Footprint Data:
- **Total Annual Emissions**: {total_annual_emissions:.2f} tonnes CO2
- **Carbon Health Score**: {carbon_score}/100
- **Diet**: {food_type.replace('-', ' ').title()}
- **Shopping Habits**: {shopping_level.title()} consumption

### Monthly Emission Breakdown:
{breakdown_text}

## Instructions:
Please provide a comprehensive, personalized sustainability plan with the following sections. Be specific, actionable, and encouraging. Use markdown formatting.

### 🚀 Immediate Actions (This Week)
Provide 3-5 specific actions the user can take right now based on their highest emission categories.

### 📅 Short-Term Improvements (1-3 Months)
Provide 3-5 realistic changes that require some planning or adjustment.

### 🌍 Long-Term Improvements (3-12 Months)
Provide 3-5 significant lifestyle changes or investments for lasting impact.

### 📊 Weekly Action Plan
Create a simple 7-day action plan with one small task per day.

### 🎯 Monthly Improvement Goals
Set 3 measurable goals for the next month with specific targets.

Keep the tone friendly, encouraging, and practical. Avoid being preachy.
Focus on the user's highest emission categories for maximum impact.
"""


async def generate_sustainability_plan(
    total_annual_emissions: float,
    breakdown: dict,
    carbon_score: int,
    food_type: str = "non-vegetarian",
    shopping_level: str = "medium",
) -> dict:
    """
    Generate a personalized sustainability plan using Gemini AI.

    Args:
        total_annual_emissions: Total annual CO2 in tonnes
        breakdown: Category-level breakdown dict
        carbon_score: Carbon health score (0-100)
        food_type: User's diet type
        shopping_level: User's consumption level

    Returns:
        Dictionary with 'plan' text and 'generated_at' timestamp

    Raises:
        ValueError: If API key is not configured
        Exception: If Gemini API call fails
    """
    model = _get_client()

    prompt = _build_prompt(
        total_annual_emissions, breakdown, carbon_score, food_type, shopping_level
    )

    try:
        response = await asyncio.to_thread(
            model.generate_content,
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=MAX_OUTPUT_TOKENS,
                temperature=TEMPERATURE,
            ),
        )

        plan_text = response.text

        return {
            "plan": plan_text,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    except Exception as e:
        raise Exception(f"Failed to generate sustainability plan: {str(e)}")
