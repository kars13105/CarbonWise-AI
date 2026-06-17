"""
AI service for sustainability coaching.

Supports both xAI Grok and Google Gemini as AI providers.
Auto-detects provider based on available API keys:
  - XAI_API_KEY  → uses Grok (xAI's OpenAI-compatible API)
  - GEMINI_API_KEY → uses Google Gemini

Constructs structured prompts from user footprint data and returns
personalized sustainability plans.
"""

import os
from datetime import datetime, timezone
import asyncio
import logging

logger = logging.getLogger(__name__)

# Model configuration
GROK_MODEL = "grok-3-mini-fast"
GEMINI_MODEL = "gemini-2.5-flash"
MAX_OUTPUT_TOKENS = 4096
TEMPERATURE = 0.5


def _get_provider() -> str:
    """Determine which AI provider to use based on available API keys."""
    if os.getenv("XAI_API_KEY"):
        return "grok"
    if os.getenv("GEMINI_API_KEY"):
        return "gemini"
    raise ValueError(
        "No AI API key configured. Set either XAI_API_KEY (for Grok) "
        "or GEMINI_API_KEY (for Gemini) in your environment variables."
    )


def _build_prompt(
    total_annual_emissions: float,
    breakdown: dict,
    carbon_score: int,
    food_type: str,
    shopping_level: str,
) -> str:
    """
    Build a structured prompt for the AI model.

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


async def _generate_with_grok(prompt: str) -> str:
    """Generate text using xAI Grok (OpenAI-compatible API)."""
    from openai import OpenAI

    client = OpenAI(
        api_key=os.getenv("XAI_API_KEY"),
        base_url="https://api.x.ai/v1",
    )

    response = await asyncio.to_thread(
        client.chat.completions.create,
        model=GROK_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are an expert sustainability coach. Provide helpful, actionable, and encouraging advice.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=MAX_OUTPUT_TOKENS,
        temperature=TEMPERATURE,
    )

    return response.choices[0].message.content


async def _generate_with_gemini(prompt: str) -> str:
    """Generate text using Google Gemini."""
    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(GEMINI_MODEL)

    response = await asyncio.to_thread(
        model.generate_content,
        prompt,
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=MAX_OUTPUT_TOKENS,
            temperature=TEMPERATURE,
        ),
    )

    return response.text


async def generate_sustainability_plan(
    total_annual_emissions: float,
    breakdown: dict,
    carbon_score: int,
    food_type: str = "non-vegetarian",
    shopping_level: str = "medium",
) -> dict:
    """
    Generate a personalized sustainability plan using AI.

    Auto-detects whether to use Grok or Gemini based on
    available API keys (XAI_API_KEY takes priority).

    Args:
        total_annual_emissions: Total annual CO2 in tonnes
        breakdown: Category-level breakdown dict
        carbon_score: Carbon health score (0-100)
        food_type: User's diet type
        shopping_level: User's consumption level

    Returns:
        Dictionary with 'plan' text and 'generated_at' timestamp

    Raises:
        ValueError: If no API key is configured
        Exception: If AI API call fails
    """
    provider = _get_provider()
    logger.info(f"Using AI provider: {provider}")

    prompt = _build_prompt(
        total_annual_emissions, breakdown, carbon_score, food_type, shopping_level
    )

    try:
        if provider == "grok":
            plan_text = await _generate_with_grok(prompt)
        else:
            plan_text = await _generate_with_gemini(prompt)

        return {
            "plan": plan_text,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    except Exception as e:
        raise Exception(f"Failed to generate sustainability plan ({provider}): {str(e)}")
