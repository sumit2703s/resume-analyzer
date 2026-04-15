// Use relative path '' in Prod so it uses the exact domain of the FastAPI host.
const isProd = import.meta.env.PROD;
const defaultApi = isProd ? "" : "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_URL || defaultApi;

async function _parseResponse(response) {
  const text = await response.text();
  if (!response.ok) {
    let detail = text;
    try {
      const json = JSON.parse(text);
      detail = json.detail || json.message || text;
    } catch {
      detail = text || response.statusText;
    }
    throw new Error(detail);
  }
  return text ? JSON.parse(text) : {};
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });
  return _parseResponse(response);
}

export async function analyzeResume(resumeId) {
  const response = await fetch(`${API_BASE}/api/analyze/${resumeId}`, {
    method: "POST",
  });
  return _parseResponse(response);
}

export async function getResults(resumeId) {
  const response = await fetch(`${API_BASE}/api/results/${resumeId}`);
  return _parseResponse(response);
}
