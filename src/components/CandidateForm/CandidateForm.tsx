import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CandidateData } from "@/types";


interface CandidateFormProps {
  initialData: CandidateData;
  onSubmit:(data:CandidateData)=>void;
}

const CandidateForm:React.FC<CandidateFormProps> = ({ onSubmit, initialData}) => {
  const [formData, setFormData] = useState<CandidateData>({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all fields.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-[#9d73ec]">Candidate Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-y-5 mb-6">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#9d73ec] hover:bg-[#8a5de8] text-white font-medium"
          >
            Save & Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CandidateForm;
