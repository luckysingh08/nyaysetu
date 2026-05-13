import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are NyaySetu, an Indian legal drafting assistant. Convert the user's scenario into a formal complaint draft suitable for submission to a police station, cyber cell, consumer forum, or appropriate legal authority.

You must:
- Use formal but clear legal language
- Do not invent facts
- Use [PLACEHOLDER] for missing details
- Keep the complaint fact-based
- Avoid exaggeration or defamatory claims
- Include a verification reminder at the end

Complaint format:
1. To: (Authority name)
2. Subject: (One line summary)
3. Complainant Details: Name: [YOUR FULL NAME], Address: [YOUR ADDRESS], Phone: [YOUR PHONE]
4. Opposite Party Details: (if known, else write "Details to be filled by complainant")
5. Date and Place of Incident
6. Facts of the Complaint (numbered points)
7. Legal Concern
8. Evidence/Documents Available
9. Prayer/Request for Action
10. Signature: [YOUR SIGNATURE] Date: [DATE]
11. IMPORTANT: Verify all facts before submission. Consult a lawyer for serious matters.

If the scenario needs a consumer complaint, cybercrime complaint, or civil complaint instead of FIR — explain that clearly and draft accordingly.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Please provide a valid description." }, { status: 400 });
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
    console.error("Complaint API error:", error.message);
    return Response.json(
      { error: "Unable to generate complaint right now. Please try again." },
      { status: 500 }
    );
  }
}