// src/services/api.js
// All backend calls. REACT_APP_API_URL points to Express server (port 5000).

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function generateTestCases(input) {
  const res  = await fetch(`${BASE_URL}/generate-testcases`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}
