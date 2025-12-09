/*{
  "contents": [
    {
      "parts": [
        // 1. Client Photo (The Image Input)
        {
          "inlineData": {
            "mimeType": "image/jpeg",
            "data": "[BASE64_ENCODED_IMAGE_STRING_HERE]" 
            // NOTE: The image must be converted to a Base64 string before being inserted here.
          }
        },
        // 2. The Detailed Prompt (Text Instructions)
        {
          "text": "Analyze the attached image showing damage to the interior drywall. Based on the visual evidence, act as a professional handyman estimator. Provide a comprehensive quote that includes materials, labor, and a brief assessment. **Crucially, ensure the entire response strictly conforms to the provided JSON schema.** The estimated hourly labor rate is $65/hour."
        }
      ]
    }
  ],
  // 3. Configuration to Force Structured Output (CRITICAL)
  "config": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "object",
      "properties": {
        "job_title": {"type": "string", "description": "Short, professional title for the job (e.g., Drywall Patch and Finish)."},
        "damage_assessment": {"type": "string", "description": "Brief description of the observed damage and size estimation."},
        "labor_estimate_hours": {"type": "number", "description": "Estimated labor time in hours (e.g., 2.5)."},
        "cost_breakdown": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "item": {"type": "string", "description": "Name of material or labor (e.g., 4x4 Drywall Patch, Joint Compound, Skilled Labor)."},
              "quantity": {"type": "number"},
              "unit_cost": {"type": "number", "description": "Estimated cost per unit (e.g., $15 for the patch, $65 for labor per hour)."},
              "total_cost": {"type": "number"}
            },
            "required": ["item", "quantity", "unit_cost", "total_cost"]
          }
        },
        "estimated_total_cost": {"type": "number"}
      }
    }
  },
  // 4. Model Selection (The Budget Winner)
  "model": "gemini-2.5-flash"
}
  */