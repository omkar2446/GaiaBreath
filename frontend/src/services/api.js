const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
export const ADMIN_TOKEN_KEY = "gaiabreath_admin_token";
export const AUTH_TOKEN_KEY = "gaiabreath_auth_token";
export const AUTH_ROLE_KEY = "gaiabreath_auth_role";
export const AUTH_NAME_KEY = "gaiabreath_auth_name";
export const AUTH_EMAIL_KEY = "gaiabreath_auth_email";

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

export function getHealthReport(data) {
  return requestJson("/api/health/report", data);
}

export async function getIotReport(node = "NODE-01") {
  const res = await fetch(`${BASE_URL}/api/iot/report?node=${encodeURIComponent(node)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to load IoT report");
  }
  return data;
}

export function getAqiTileUrl(z, x, y, layer = "usepa-aqi") {
  return `${BASE_URL}/api/aqi/map/tile/${z}/${x}/${y}.png?layer=${encodeURIComponent(layer)}`;
}

export function getBaseMapTileUrl(z, x, y) {
  return `${BASE_URL}/api/map/base/tile/${z}/${x}/${y}.png`;
}

export function resolveApiUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path}`;
}

export async function getCommunityPosts() {
  const res = await fetch(`${BASE_URL}/api/community/posts`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to load posts");
  }
  return data.posts || [];
}

export async function createCommunityPost(formData) {
  const res = await fetch(`${BASE_URL}/api/community/posts`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to create post");
  }
  return data;
}

export async function adminLogin(email, password) {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Admin login failed");
  }
  return data;
}

export async function signupUser(payload) {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Signup failed");
  }
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
}

export async function getAuthMe(token) {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Session invalid");
  }
  return data;
}

export async function logoutAuth(token) {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Logout failed");
  }
  return data;
}

export async function deleteCommunityPost(postId, token) {
  const res = await fetch(`${BASE_URL}/api/community/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete post");
  }
  return data;
}

export async function askAqiBot(question) {
  const hint = "Use Health Advisor for personalized AQI risk prediction.";
  return Promise.resolve({ answer: `${hint} You asked: ${question}` });
}
