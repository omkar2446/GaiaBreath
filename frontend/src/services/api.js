const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

async function requestJson(path, payload) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || "Request failed";
    throw new Error(message);
  }

  return data;
}

export function getHealthRisk(data) {
  return requestJson("/api/ai/predict", data);
}

export function getAqiRisk(data) {
  return requestJson("/api/aqi/predict", data);
}

export async function askAqiBot(question) {
  const hint = "Use Health Advisor for personalized AQI risk prediction.";
  return Promise.resolve({ answer: `${hint} You asked: ${question}` });
}
