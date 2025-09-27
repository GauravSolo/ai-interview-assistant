import type { Difficulty, QuestionType } from "@/types";
import axios from "axios";

export const getQuestions = async (): Promise<QuestionType[]> => {
  const cached = localStorage.getItem("interviewQuestions");
  if (cached) {
    return JSON.parse(cached) as QuestionType[];
  }

  const prompt = `
Generate 6 interview questions on ReactJS.
- 2 Easy, 2 Medium, 2 Hard
- Return only JSON in this format:

[
  { "id": 1, "text": "question text", "difficulty": "Easy" },
  { "id": 2, "text": "question text", "difficulty": "Medium" },
  ...
]
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY || "",
        },
      }
    );

    let text = response.data.candidates[0].content.parts[0].text;

    text = text.replace(/```json|```/g, "").trim();

    const questions: QuestionType[] = JSON.parse(text);

    localStorage.setItem("interviewQuestions", JSON.stringify(questions));

    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);

    const fallback: QuestionType[] = [
      { id: 1, text: "What is React?", difficulty: "Easy" },
      { id: 2, text: "What are props in React?", difficulty: "Easy" },
      { id: 3, text: "Explain useState hook.", difficulty: "Medium" },
      { id: 4, text: "What is virtual DOM?", difficulty: "Medium" },
      { id: 5, text: "Explain React reconciliation.", difficulty: "Hard" },
      { id: 6, text: "What are React Fiber internals?", difficulty: "Hard" },
    ];

    return fallback;
  }
};

export const getTimeForDifficulty = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "Easy": return 20;
    case "Medium": return 60;
    case "Hard": return 120;
    default: return 30;
  }
};
