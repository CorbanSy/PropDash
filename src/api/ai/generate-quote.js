//levlpro-mvp\src\api\ai\generate-quote.js
import { streamText } from "ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  try {
    const result = await streamText({
      model: "google/gemini-1.5-flash", // FREE MODEL ✔
      prompt: `
        Turn this description into a structured job cost breakdown.
        Respond ONLY with valid JSON.

        Description: ${description}
      `,
    });

    // Aggregate streamed output
    let fullText = "";
    for await (const part of result.textStream) {
      fullText += part;
    }

    return res.status(200).json(JSON.parse(fullText));
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
