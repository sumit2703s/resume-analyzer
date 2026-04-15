import asyncio
import json
import os

import httpx
from dotenv import find_dotenv, load_dotenv

# Load .env from the project root if present
dotenv_path = find_dotenv(usecwd=True)
if dotenv_path:
    load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_URL = os.getenv("GEMINI_API_URL")
# Default to a modern Gemini 2.5 model if none is specified
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")


def _extract_json_payload(content: str) -> str:
    """Extracts a JSON object from a string that might contain markdown fences."""
    if not content:
        raise ValueError("Empty response content from Gemini API")

    first = content.find("{")
    last = content.rfind("}")
    if first == -1 or last == -1 or first >= last:
        raise ValueError(f"Unable to locate JSON payload in Gemini response. Gemini replied with:\n{content}")

    return content[first : last + 1]


def _normalize_analysis(payload: dict) -> dict:
    """Ensures the parsed JSON conforms to the expected structure."""
    if "keyword_analysis" not in payload or not isinstance(payload["keyword_analysis"], dict):
        payload["keyword_analysis"] = {
            "matched_keywords": [],
            "missing_keywords": [],
            "match_percentage": 0,
        }

    if "ats_score" in payload:
        try:
            payload["ats_score"] = int(payload["ats_score"])
        except (TypeError, ValueError):
            payload["ats_score"] = 0

    payload.setdefault("strengths", [])
    payload.setdefault("weaknesses", [])
    payload.setdefault("suggestions", [])
    payload.setdefault("improved_bullets", [])
    return payload


async def analyze_resume(resume_text: str, api_key: str | None = None) -> dict:
    api_key = api_key or GEMINI_API_KEY
    if not api_key:
        raise ValueError("Gemini API key is not configured in GEMINI_API_KEY")

    prompt = (
        "You are an ATS resume analyzer. Analyze the resume and return JSON with:\n"
        "* ats_score\n"
        "* strengths\n"
        "* weaknesses\n"
        "* keyword_analysis\n"
        "* suggestions\n"
        "* improved_bullets\n"
        "\n"
        "Return only valid JSON. Do not include any explanation text outside the JSON object. "
        "The JSON object should include keyword_analysis as an object with matched_keywords, "
        "missing_keywords, and match_percentage.\n"
        "Resume text:\n" + resume_text
    )

    is_modern = "gemini" in GEMINI_MODEL_NAME.lower()

    if is_modern:
        # Modern Gemini Payload Format (gemini-1.5, gemini-pro, etc.)
        endpoint = GEMINI_API_URL or f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL_NAME}:generateContent"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2, 
                "maxOutputTokens": 8192,
                "responseMimeType": "application/json"
            },
        }
    else:
        # Legacy PaLM Payload Format (text-bison-001)
        endpoint = GEMINI_API_URL or f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL_NAME}:generateText"
        payload = {
            "prompt": {"text": prompt},
            "temperature": 0.2,
            "maxOutputTokens": 8192,
        }

    headers = {"Content-Type": "application/json"}
    # The API key is appended via query string (simplest format for standard API keys)
    request_url = f"{endpoint}?key={api_key}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await client.post(request_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                break
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code in {429, 503} and attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # 1s, 2s backoff
                    continue

                # Handle standard error format from Google APIs if present
                err_msg = exc.response.text
                try:
                    err_msg = exc.response.json().get("error", {}).get("message", err_msg)
                except Exception:
                    pass
                raise ValueError(f"Gemini API request failed ({exc.response.status_code}): {err_msg}") from exc
            except Exception as exc:
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise ValueError(f"Unexpected error calling Gemini API: {type(exc).__name__} - {exc}") from exc

    try:
        if is_modern:
            candidates = data.get("candidates") or []
            if not candidates:
                raise ValueError("Gemini API did not return any output candidates.")
            content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        else:
            candidates = data.get("candidates") or []
            if not candidates:
                raise ValueError("Gemini API did not return any output candidates.")
            content = candidates[0].get("output", "")
    except Exception as exc:
        raise ValueError("Failed to parse the expected structure of the Gemini API response.") from exc

    json_payload = _extract_json_payload(content)

    try:
        parsed = json.loads(json_payload)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Gemini API returned malformed JSON: {exc}\nRaw Output: {json_payload}") from exc

    return _normalize_analysis(parsed)
