const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["brand", "signs"],
  properties: {
    brand: {
      type: "object",
      additionalProperties: false,
      required: ["venueName", "venueType", "brandStyle", "tone", "typography", "primaryColor", "secondaryColor", "textColor", "accentColor", "summary"],
      properties: {
        venueName: { type: "string" },
        venueType: { type: "string" },
        brandStyle: { type: "string" },
        tone: { type: "string" },
        typography: { type: "string" },
        primaryColor: { type: "string" },
        secondaryColor: { type: "string" },
        textColor: { type: "string" },
        accentColor: { type: "string" },
        summary: { type: "string" },
      },
    },
    signs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "subtitle", "originalCopy", "suggestedCopy", "flags"],
        properties: {
          id: { type: "string", enum: ["pizza", "lunch", "drinks", "food", "payments", "reserved", "garden", "toilet", "qr", "event", "function", "custom"] },
          title: { type: "string" },
          subtitle: { type: "string" },
          originalCopy: { type: "string" },
          suggestedCopy: { type: "string" },
          flags: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ ok: true });
    if (url.pathname !== "/analyse" || request.method !== "POST") return json({ error: "Not found" }, 404);
    if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY is not configured" }, 500);

    try {
      const body = await request.json();
      const files = Array.isArray(body.files) ? body.files.slice(0, 12) : [];
      if (!files.length) return json({ error: "Add at least one readable image or PDF" }, 400);

      const content = [{
        type: "input_text",
        text: `Analyse the uploaded material for a pub, restaurant, bar or cafe.

Goals:
1. Infer a practical brand direction from logos, colours, venue photos and existing signs.
2. Extract each distinct menu or sign as accurately as possible.
3. Return the exact visible wording as originalCopy.
4. Suggest a clearer, concise, on-brand version as suggestedCopy.

Non-negotiable rules:
- Never invent or alter prices, dates, times, URLs, phone numbers, fees, legal claims, licensing wording or allergy statements.
- Preserve exact wording when it looks contractual, legal, safety-related or policy-related.
- If any text or number is unclear, write "Needs checking" at that position and add a specific flag.
- Keep menu items in this format: SECTION then "Item | Description | Price", one per line.
- Suggestions should improve tone, spelling and clarity without changing meaning.
- Use hex colour values.
- Choose the closest supported sign id.

Venue hint: ${body.venueHint || "Not supplied"}
Notes: ${body.notes || "None supplied"}`,
      }];

      for (const file of files) {
        if (!file.dataUrl) continue;
        if (String(file.type).includes("pdf")) {
          content.push({ type: "input_file", filename: file.name || "upload.pdf", file_data: file.dataUrl });
        } else if (String(file.type).startsWith("image/")) {
          content.push({ type: "input_image", image_url: file.dataUrl, detail: "high" });
        }
      }

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-5.4-mini",
          input: [{ role: "user", content }],
          text: {
            format: {
              type: "json_schema",
              name: "pub_sign_analysis",
              strict: true,
              schema,
            },
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) return json({ error: result.error?.message || "OpenAI request failed" }, response.status);
      const outputText = result.output_text || result.output?.flatMap(item => item.content || []).find(item => item.type === "output_text")?.text;
      if (!outputText) return json({ error: "The model returned no analysis" }, 502);
      return json(JSON.parse(outputText));
    } catch (error) {
      return json({ error: error.message || "Analysis failed" }, 500);
    }
  },
};
