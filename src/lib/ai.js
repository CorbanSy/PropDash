//levlpro-mvp\src\lib\ai.js
export async function generateQuoteFromDescription(description) {
  if (!description) throw new Error("Description is empty.");

  try {
    const response = await fetch(
      `/api/ai/generateQuote`, 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error("AI Request failed: " + err);
    }

    return await response.json();
  } catch (err) {
    console.error("AI Error:", err);
    throw err;
  }
}
