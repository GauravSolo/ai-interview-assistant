import { Cards } from "@/components";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";

const roles = [
  {
    title: "I'm an Interviewee",
    description:
      "Prepare for interviews with AI-powered mock sessions and feedback.",
    role: "Interviewee",
  },
  {
    title: "I'm an Interviewer",
    description:
      "Conduct structured interviews, track candidates, and review responses.",
    role: "Interviewer",
  },
];

function Home() {
  const [selectedCard, setSelectedCard] = useState("");
   const navigate = useNavigate();

  const handleNavigate = () => {
    if (selectedCard === "Interviewee") {
      navigate("/interviewee");
    } else if (selectedCard === "Interviewer") {
      navigate("/interviewer");
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-10 p-6">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl text-center">
          Welcome to the{" "}
          <span className="text-primary font-bold">AI Interview Assistant</span>
        </h1>
        <p className="text-gray-400">
          Please select the role that best describes you to begin using the ai interview assistant
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {roles.map((role, index) => (
          <Cards
            key={index}
            title={role.title}
            description={role.description}
            selected={selectedCard == role.role}
            onClick={() => setSelectedCard(role.role)}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button  className="bg-[#804be4] hover:bg-[#986aee] cursor-pointer w-[200px] py-6 rounded-3xl" disabled={selectedCard==""} onClick={handleNavigate}>Continue</Button>
      </div>
    </div>
  );
}

export default Home;
