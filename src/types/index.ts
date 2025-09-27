type Difficulty = "Easy" | "Medium" | "Hard";
type Role = "Interviewee" | "Interviewer";

interface QuestionType {
  id: number;
  text: string;
  difficulty: Difficulty;
}

interface Message {
  id: string;
  role: Role;
  text: string;
}

interface ScoredAnswer extends Message{
    score: number
}

interface CandidateData {
  name: string;
  email: string;
  phone: string;
}

interface InterviewState {
  candidate: CandidateData | null;
  questions: QuestionType[];
  index: number;
  messages: Message[];
  turn: "Interviewer" | "Interviewee" | "Finished";
  isPaused: boolean;
  timeLeft: number;
  submitted: boolean;
}

interface Candidate extends CandidateData{
  id: string;
  score: number;
  summary: string;
  chat_history: ScoredAnswer[];
};


export type {
  Role,
  Difficulty,
  QuestionType,
  Message,
  InterviewState,
  CandidateData,
  ScoredAnswer,
  Candidate,
};
