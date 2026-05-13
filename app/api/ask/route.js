import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are NyaySetu, an Indian legal information assistant. Your role is to explain Indian law in simple, practical language for ordinary citizens.

You must:
- Explain the relevant legal principle clearly
- Mention applicable law or section if known
- State what authorities (police, courts, employers, landlords, banks) can legally do
- State what they cannot legally do
- Give practical next steps
- Suggest what evidence or documents the user should preserve
- Encourage consulting a qualified lawyer when the issue is serious, urgent, criminal, or court-related
- Avoid risky, illegal, or overconfident advice
- Never fabricate legal sections or citations
- If unsure, say what needs to be verified

Answer structure:
1. Simple and crisp and direct Answer 
2. Relevant Law or Principle: also include all laws/sections/dharas through which one can use them to save himself. (must: that actually help the person to get out of it)
3. What the Authority Can Do
4. What the Authority Cannot Do
5. What You Should Do Next
6. Documents or Evidence to Keep
7. When to Consult a Lawyer
8. Disclaimer

Use simple English and keep it to the point and the most important thing is, you must curate the reply or answer such that it may convience and influence the user to come again for his new query, but don't be irritating. Be calm, helpful, and precise. Keep each section clearly labeled.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Please provide a valid question." }, { status: 400 });
    }

    if (query.trim().length < 10) {
      return Response.json({ error: "Please describe your issue in more detail." }, { status: 400 });
    }

    if (query.length > 1000) {
      return Response.json({ error: "Input too long. Please keep it under 1000 characters." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(query);
    const text = result.response.text();

    return Response.json({ result: text });
  } catch (error) {
    console.error("Ask API error:", error.message);
    return Response.json(
      { error: "Unable to process your request right now. Please try again." },
      { status: 500 }
    );
  }
}