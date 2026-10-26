const ALLOWED_ORIGIN = "https://manjit-singh-portfolio.mbmanjit5.workers.dev";
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function json(data, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...JSON_HEADERS,
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
      "vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Keep normal portfolio page requests working through the static asset binding.
    if (url.pathname !== "/api/demo-request") {
      return env.ASSETS.fetch(request);
    }

    const origin = request.headers.get("Origin") || "";
    if (origin && origin !== ALLOWED_ORIGIN) {
      return json({ ok: false, error: "Origin not allowed." }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": ALLOWED_ORIGIN,
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          "access-control-max-age": "86400",
          "vary": "Origin"
        }
      });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405);
    }

    try {
      const length = Number(request.headers.get("content-length") || "0");
      if (length > 12000) return json({ ok: false, error: "Request too large." }, 413);
      const data = await request.json();

      // Honeypot field: bots that fill it are silently rejected.
      if (typeof data.website === "string" && data.website.trim()) {
        return json({ ok: true });
      }

      const name = String(data.name || "").trim().slice(0, 120);
      const email = String(data.email || "").trim().slice(0, 254);
      const appType = String(data.appType || "").trim().slice(0, 100);
      const budget = String(data.budget || "").trim().slice(0, 120);
      const idea = String(data.idea || "").trim().slice(0, 4000);
      const features = String(data.features || "").trim().slice(0, 4000);

      if (!name || !email || !appType || !idea || !features) {
        return json({ ok: false, error: "Please complete all required fields." }, 400);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ ok: false, error: "Please enter a valid email address." }, 400);
      }

      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const recent = await env.DB.prepare(
        "SELECT COUNT(*) AS count FROM demo_requests WHERE ip_hash = ? AND created_at >= datetime('now', '-10 minutes')"
      ).bind(ip).first();
      if ((recent?.count || 0) >= 5) {
        return json({ ok: false, error: "Too many requests. Please try again later." }, 429);
      }

      await env.DB.prepare(
        "INSERT INTO demo_requests (name, email, app_type, budget, idea, features, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(name, email, appType, budget || null, idea, features, ip).run();

      return json({ ok: true, message: "Request saved." }, 201);
    } catch (error) {
      console.error("Demo request save failed:", error);
      return json({ ok: false, error: "We could not save your request. Please try WhatsApp or email instead." }, 500);
    }
  }
};
