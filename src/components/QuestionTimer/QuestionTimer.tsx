import { useEffect, useState } from "react";

interface QuestionTimerProps{
  duration: number;
  onTimeout: ()=>void;
  reset: number;
  paused: boolean;
  persistedTimeLeft?: number; 
  onTimeUpdate?: (time: number) => void;
}

const QuestionTimer: React.FC<QuestionTimerProps> = ({ 
  duration, 
  onTimeout, 
  reset, 
  paused, 
  persistedTimeLeft,
  onTimeUpdate 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(persistedTimeLeft ?? duration);

  useEffect(() => {
    const initialTime = persistedTimeLeft ?? duration;
    setTimeLeft(initialTime);
  }, [reset, duration, persistedTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    if (paused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout, paused, onTimeUpdate]);

  return (
    <div className="text-right text-md font-semibold text-red-600">
      ⏱ {timeLeft}s
    </div>
  );
};

export default QuestionTimer;