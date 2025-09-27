import { Chat } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { ScoredAnswer } from "@/types";
import { useLocation, useNavigate } from "react-router";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const candidate = location.state?.candidate;

  if (!candidate) return <p>No candidate selected!</p>;

  return (
    <>
      <Button variant="secondary" className="cursor-pointer mt-2 ms-2" onClick={() => navigate("/")} >Back</Button>
      <Card className="min-w-[80vw] min-h-[90vh] flex flex-col rounded-2xl gap-y-4 border-2 border-[#9d73ec] shadow-xl m-3">
        <CardHeader className="flex justify-between items-end">
          <CardTitle className="text-[#9d73ec] flex justify-between w-full">
            <span className="font-semibold text-xl text-[#9d73ec] flex flex-end">
              Candidate:
              <span className="text-gray-700 ms-2 font-semibold text-lg">
                {candidate?.name}
              </span>
            </span>
            <span className="font-bold flex items-end">
              Score:
              <span className="text-gray-700 ms-2">
                {candidate?.score}/{(candidate?.chat_history.length - 1) * 5}
              </span>
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow justify-between">
          <div className="border rounded-lg p-4 h-60 overflow-y-auto bg-gray-50 mb-1 flex-grow">
            {candidate.chat_history.map((msg: ScoredAnswer) => (
              <>
                <Chat key={msg.id} chat={msg.text} role={msg.role} />
                {msg.role == "Interviewee" && (
                  <Label className="font-bold flex justify-end me-3">
                    {msg.score}/10
                  </Label>
                )}
              </>
            ))}
          </div>
        </CardContent>
        <CardFooter className="mx-6 flex flex-col items-start gap-y-3 border rounded-xl bg-white shadow-sm  py-5">
          <Label className="text-xl border-b-2">Summary : </Label>
          <p>{candidate.summary}</p>
        </CardFooter>
      </Card>
    </>
  );
};

export default Summary;
