import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ResumeCardProps {
  fileName?: string;
  onUpload: (file: File) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ fileName, onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-[#9d73ec]">Upload Resume</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Input type="file" accept=".pdf,.docx" onChange={handleFileChange}/>
        {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
      </CardContent>
    </Card>
  );
};

export default ResumeCard;
