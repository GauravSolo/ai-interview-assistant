/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { InterviewChat, ResumeCard, Spinner } from "@/components";
import CandidateForm from "@/components/CandidateForm/CandidateForm";
import { useResumeParser } from "@/hooks/useResumeParser";
import type { CandidateData, InterviewState, ScoredAnswer } from "@/types";
import { getQuestions } from "@/services/aiEngine";
import { useInterviewState } from "@/hooks/useInterviewState";
import { getGeminiSummary } from "@/services/gemini";
import { supabase } from "@/lib/utils";
import { useNavigate } from "react-router";
const LOCAL_STORAGE_KEY = "interviewData";

const Interviewee = () => {
  const [interviewState, setInterviewState] = useInterviewState<InterviewState>(
    LOCAL_STORAGE_KEY,
    {
      candidate: null,
      questions: [],
      index: 0,
      messages: [],
      turn: "Interviewer",
      isPaused: false,
      timeLeft: 0,
      submitted: false,
    }
  );

  const [step, setStep] = useInterviewState<"upload" | "form" | "chat">(
    "interviewStep",
    interviewState.submitted
      ? "upload"
      : interviewState.candidate
      ? "chat"
      : "upload"
  );
  const [fileName, setFileName] = useState<string>();
  const { parsedData, parsingData, error, parseResume } = useResumeParser();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleResumeUpload = (file: File) => {
    if (!file.name) return;

    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      alert("Only PDF or DOCX files are allowed!");
      return;
    }

    setFileName(file.name);
    parseResume(file);
    setStep("form");
  };

  const handleFormSubmit = (formData: CandidateData) => {
    setInterviewState((prev: InterviewState) => ({
      ...prev,
      candidate: formData,
    }));
    setStep("chat");
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(interviewState));
  }, [interviewState]);

  const handleContinue = () => {
    setStep("chat");
    setShowModal(false);
    setInterviewState((prev) => ({
      ...prev,
      isPaused: false,
    }));
  };

  const handleRestart = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInterviewState({
      candidate: null,
      questions: [],
      index: 0,
      messages: [],
      turn: "Interviewer",
      isPaused: false,
      timeLeft: 0,
      submitted: false,
    });
    setStep("upload");
    localStorage.removeItem("interviewQuestions");
    setShowModal(false);
  };

  useEffect(() => {
    if (interviewState.candidate && interviewState.turn !== "Finished") {
      setInterviewState((prev) => ({
        ...prev,
        isPaused: true,
      }));
      setShowModal(true);
    }
  }, []);

  const handleFinishInterview = async () => {
    setInterviewState((prev) => ({
      ...prev,
      turn: "Finished",
    }));
    setSubmitting(true);

    const candidate = interviewState.candidate;
    if (
      !candidate ||
      candidate.name.trim() === "" ||
      candidate.email.trim() === "" ||
      candidate.phone.trim() === ""
    ) {
      console.error("No candidate data found!");
      return;
    }

    const { answers, summary } = await getGeminiSummary(
      interviewState.messages,
      interviewState.questions
    );

    let totalScore = 0;

    const final_response = interviewState.messages.map((m) => {
      if (m.role === "Interviewee") {
        const scored = answers.find((a: ScoredAnswer) => a.id === m.id);
        if (scored && typeof scored.score === "number") {
          totalScore += scored.score;
          return { ...m, score: scored.score };
        }
      }
      return m;
    });

    const candidateData = {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      score: totalScore,
      chat_history: final_response,
      summary: summary || "No summary available",
    };

    console.log(candidateData);

    const { data, error } = await supabase
      .from("candidates")
      .upsert([candidateData], { onConflict: "phone" })
      .select();

    if (error) {
      console.error("Error saving candidate:", error.message);
    } else {
      setInterviewState((prev) => ({
        ...prev,
        submitted: true,
      }));

      setSubmitting(false);
      navigate("/summary", { state: { candidate: candidateData } });
      console.log("Interview submitted and saved:", data);
    }
  };

  useEffect(() => {
    if (!interviewState.submitted && interviewState.turn == "Finished")
      handleFinishInterview();
  }, [interviewState.turn]);

  useEffect(() => {
    const loadQuestions = async () => {
      const qs = await getQuestions();
      setInterviewState((prev) => ({ ...prev, questions: qs }));
    };
    loadQuestions();
  }, []);
  return (
    <div className="relative">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-96">
            <h2 className="text-xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-6">
              We found an unfinished interview session. Do you want to continue
              where you left off or start fresh?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Start New
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {submitting && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-96">
            <p className="text-gray-600 mb-6">
              <Spinner />
            </p>
            <h2 className="text-xl font-bold mb-4">Summarizing...</h2>
          </div>
        </div>
      )}
      <div className="min-h-screen flex justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center gap-10 p-6 w-full max-w-lg">
          {step === "upload" && (
            <ResumeCard fileName={fileName} onUpload={handleResumeUpload} />
          )}

          {step === "form" && (
            <>
              {parsingData ? (
                <p className="text-gray-600 text-center">
                  Parsing your resume...
                </p>
              ) : (
                <CandidateForm
                  initialData={parsedData}
                  onSubmit={handleFormSubmit}
                />
              )}
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
            </>
          )}

          {step === "chat" && (
            <InterviewChat
              interviewState={interviewState}
              setInterviewState={setInterviewState}
              handleSubmit={handleFinishInterview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Interviewee;
