"""
AI Sustainability Coach route — integrates with Google Gemini API.
"""

from fastapi import APIRouter, HTTPException

from app.models.schemas import AICoachRequest, AICoachResponse
from app.services.gemini_service import generate_sustainability_plan

router = APIRouter(prefix="/api", tags=["ai-coach"])


@router.post("/ai-coach", response_model=AICoachResponse)
async def get_sustainability_plan(request: AICoachRequest):
    """
    Generate a personalized sustainability plan using Gemini AI.

    Requires a valid GEMINI_API_KEY in environment variables.
    """
    try:
        result = await generate_sustainability_plan(
            total_annual_emissions=request.total_annual_emissions,
            breakdown=request.breakdown,
            carbon_score=request.carbon_score,
            food_type=request.food_type,
            shopping_level=request.shopping_level,
        )
        return AICoachResponse(**result)

    except ValueError as e:
        # API key not configured
        raise HTTPException(
            status_code=503,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}",
        )
