import type { Role } from "@/types";

interface ChatProps {
  chat: string;
  role: Role;
}

const Chat: React.FC<ChatProps> = ({ chat, role }) => {
  const isInterviewee = role === "Interviewee";

  return (
    <div
      className={`flex flex-col w-full p-2 ${
        isInterviewee ? "items-end self-end" : "items-start self-start mt-5"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-2xl text-sm shadow-md w-auto md:max-w-[50%] ${
          isInterviewee
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {chat}
      </div>
    </div>
  );
};

export default Chat;
