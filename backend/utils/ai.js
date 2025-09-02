import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
});

export async function generateInsights(data) {
  try {
    const prompt = `
      You are a data analyst. Analyze this Excel data and provide clear, structured insights.
      Data:
      ${JSON.stringify(data, null, 2)}

      Return key points such as:
      - Summary
      - Trends
      - Outliers
      - Recommendations
    `;

    const response = await client.chat.completions.create({
      model: "llama3-8b-8192", // free Groq model
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("AI Error:", err);
    return "⚠️ Failed to generate insights.";
  }
}
