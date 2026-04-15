from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import ai_service, models
from ..database import get_session

router = APIRouter()


@router.post("/analyze/{resume_id}")
async def analyze_resume(resume_id: int, session: AsyncSession = Depends(get_session)):
    resume = await session.get(models.Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    existing = await session.execute(select(models.Analysis).where(models.Analysis.resume_id == resume_id))
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="Analysis already exists for this resume.")

    try:
        analysis_payload = await ai_service.analyze_resume(resume.text)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    analysis = models.Analysis(resume_id=resume_id, ai_response=analysis_payload)
    session.add(analysis)
    await session.commit()
    await session.refresh(analysis)

    return {"resume_id": resume_id, "analysis": analysis.ai_response}


@router.get("/results/{resume_id}")
async def get_results(resume_id: int, session: AsyncSession = Depends(get_session)):
    resume = await session.get(models.Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    query = await session.execute(select(models.Analysis).where(models.Analysis.resume_id == resume_id))
    analysis = query.scalars().first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found. Call /api/analyze first.")

    return {
        "resume_id": resume.id,
        "filename": resume.filename,
        "analysis": analysis.ai_response,
    }
