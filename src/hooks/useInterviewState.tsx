import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export function useInterviewState<InterviewState>(key: string, initialValue: InterviewState) : [InterviewState, Dispatch<SetStateAction<InterviewState>>]{
  const [value, setValue] = useState<InterviewState>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch{
        console.log("Error in Local storage");
    }
  }, [key, value]);

  return [value, setValue];
}
