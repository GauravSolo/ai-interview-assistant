import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTimeForDifficulty } from "@/services/aiEngine";
import { useCallback, useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import QuestionTimer from "../QuestionTimer/QuestionTimer";
import { Textarea } from "../ui/textarea";
import type { InterviewState, Message } from "@/types";

interface InterviewChatProps {
  interviewState: InterviewState;
  setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>;
  handleSubmit: () => void;
}

const InterviewChat: React.FC<InterviewChatProps> = ({
  interviewState,
  setInterviewState,
  handleSubmit,
}) => {
  const { candidate, questions, index, messages, turn, isPaused, timeLeft } =
    interviewState;
  const [answer, setAnswer] = useState("");

  const totalQuestions = questions.length;
  const currentQuestion = questions[index] ?? null;

  const handleSend = useCallback(() => {
    let newMessage: Message;

    if (turn === "Interviewer") {
      newMessage = {
        id: `q-${index}`,
        role: "Interviewer",
        text: questions[index].text,
      };
      setInterviewState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        turn: "Interviewee",
        timeLeft: getTimeForDifficulty(currentQuestion.difficulty),
      }));
    } else {
      newMessage = {
        id: `a-${index}`,
        role: "Interviewee",
        text: answer.trim() === "" ? "No Answer" : answer,
      };

      const nextIndex = index + 1;
      const finished = nextIndex === totalQuestions;

      setInterviewState((prev) => ({
        ...prev,
        messages: finished
          ? [
              ...prev.messages,
              newMessage,
              {
                id: "done",
                role: "Interviewer",
                text: "✅ The interview is finished. Thank you!",
              },
            ]
          : [...prev.messages, newMessage],
        index: finished ? prev.index : nextIndex,
        turn: finished ? "Finished" : "Interviewer",
        timeLeft: finished
          ? 0
          : getTimeForDifficulty(questions[nextIndex]?.difficulty || 0),
      }));
      setAnswer("");
    }
  }, [
    turn,
    index,
    questions,
    answer,
    totalQuestions,
    setInterviewState,
    currentQuestion
  ]);

  useEffect(() => {
    if (turn === "Interviewer" && index < totalQuestions) {
      handleSend();
    }
  }, [turn, index, totalQuestions, handleSend]);

  const handlePause = () => {
    setInterviewState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return (
    <div className="w-auto">
      <div className="w-full flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 p-3 rounded-b-none">
        <span className="font-semibold text-xl text-[#9d73ec]">
          Candidate:{" "}
          <span className="text-gray-700 ms-2 font-semibold text-lg">
            {candidate?.name}
          </span>
        </span>
        {turn != "Finished" && (
          <div className="flex gap-x-3">
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg px-5 w-[10rem] cursor-pointer"
              onClick={handlePause}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg px-5 w-[10rem] cursor-pointer"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        )}
      </div>

      <Card className="min-w-[80vw] min-h-[90vh] flex flex-col rounded-t-none">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-[#9d73ec]">
            {turn === "Finished"
              ? "Interview Complete"
              : `Question ${index + 1} of ${totalQuestions}`}
          </CardTitle>
          {index < totalQuestions &&
            currentQuestion &&
            turn === "Interviewee" && (
              <QuestionTimer
                duration={getTimeForDifficulty(currentQuestion.difficulty)}
                onTimeout={handleSend}
                reset={index}
                paused={isPaused}
                persistedTimeLeft={timeLeft > 0 ? timeLeft : undefined}
                onTimeUpdate={(newTime) => {
                  setInterviewState((prev) => ({
                    ...prev,
                    timeLeft: newTime,
                  }));
                }}
              />
            )}
        </CardHeader>

        <CardContent className="flex flex-col flex-grow justify-between">
          <div className="border rounded-lg p-4 h-60 overflow-y-auto bg-gray-50 mb-4 flex-grow">
            {messages.map((msg) => (
              <Chat key={msg.id} chat={msg.text} role={msg.role} />
            ))}
          </div>

          {turn === "Interviewee" && (
            <div className="flex gap-3 p-3 border rounded-xl bg-white shadow-sm items-stretch">
              <Textarea
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                className="flex-grow resize-none rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                rows={2}
                disabled={isPaused}
              />
              <Button
                onClick={handleSend}
                disabled={isPaused}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 h-auto w-3xs cursor-pointer"
              >
                Send
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewChat;
