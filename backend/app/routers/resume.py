from io import BytesIO

import pdfplumber
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from .. import models
from ..database import get_session

router = APIRouter()


async def _extract_text_from_pdf(upload_file: UploadFile) -> str:
    contents = await upload_file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded PDF file is empty.")

    try:
        with pdfplumber.open(BytesIO(contents)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
            text = "\n\n".join(pages).strip()
    except Exception as exc:
        raise HTTPException(status_code=422, detail="Unable to parse PDF file.") from exc

    if not text:
        raise HTTPException(status_code=422, detail="Could not extract any text from the uploaded PDF.")

    return text


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...), 
    job_description: str | None = Form(None),
    session: AsyncSession = Depends(get_session)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")

    text = await _extract_text_from_pdf(file)
    resume = models.Resume(filename=file.filename, text=text, job_description=job_description)
    session.add(resume)
    await session.commit()
    await session.refresh(resume)

    return {"resume_id": resume.id, "filename": resume.filename}
