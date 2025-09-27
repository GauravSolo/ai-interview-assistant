import type { Message, QuestionType } from "@/types";
import axios from "axios";

const prepareMessagesForScoring = (messages: Message[], questions: QuestionType[]) => {
  // Only consider the answers from the interviewee
  return messages
    .filter((m) => m.role === "Interviewee")
    .map((m, i) => ({
      id: m.id,
      question: questions[i]?.text || "N/A",
      answer: m.text,
    }));
};


const parseGeminiJson = (text: string) => {
  try {
    // Remove ```json ... ``` or ``` ... ``` fences
    const cleaned = text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", err, text);
    return { answers: [], summary: "Parsing failed" };
  }
};


export const getGeminiSummary = async (
  messages: Message[],
  questions: QuestionType[]
) => {
  const answersForScoring = prepareMessagesForScoring(messages, questions);
  const text = answersForScoring
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  const prompt = `
Please analyze the following interview answers. 
For each answer, provide a score (0-10) and include it in the JSON. 
Also provide an overall summary of the candidate.

Format:
{
"answers": [
    { "id": "a-0", "score": 8 },
    { "id": "a-1", "score": 7 }
],
"summary": "Overall summary text"
}

Interview:
${text}
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Summarize the following interview Q&A: \n\n${prompt}` },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY || "",
        },
      }
    );

    const summary = response.data.candidates[0].content.parts[0].text;
    return  parseGeminiJson(summary);
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Could not generate summary";
  }
};
