import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/utils";
import type { Candidate } from "@/types";
import { useNavigate } from "react-router";

const Interviewer = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("score", { ascending: false });

      if (error) {
        console.error("Error fetching candidates:", error.message);
      } else {
        setCandidates(data as Candidate[]);
      }
    };

    fetchCandidates();
  }, []);

  const handleNavigate = (data: Candidate) => {
    navigate("/summary", { state: { candidate: data } });
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#9d73ec]">Dashboard</h1>

      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md"
      />

      <Table>
        <TableHeader>
          <TableRow className="bg-[whitesmoke]">
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score (Out of 60)</TableHead>
            <TableHead>Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.length ? (
            filteredCandidates.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell className="font-semibold">{c.score}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate(c)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No candidates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Interviewer;
