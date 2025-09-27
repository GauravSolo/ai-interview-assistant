/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";
import type { CandidateData } from "@/types";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const useResumeParser = () => {
  const [parsedData, setParsedData] = useState<CandidateData>({
    name: "",
    email: "",
    phone: "",
  });
  const [parsingData, setParsingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractFields = (text: string): CandidateData => {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const phoneRegex = /(?:\+91[-\s]?)?[0-9]{10}/;
    const nameRegex =
      /\b([A-Z][a-z]+|[A-Z]+)\s+([A-Z][a-z]+|[A-Z]+)(\s+[A-Z][a-z]+|[A-Z]+)?\b/i;
    const headerText = text.split("\n").slice(0, 5).join(" ");

    return {
      name: headerText.match(nameRegex)?.[0] || "",
      email: text.match(emailRegex)?.[0] || "",
      phone: text.match(phoneRegex)?.[0] || "",
    };
  };

  const parseResume = async (file: File) => {
    try {
      setParsingData(true);
      setError(null);
      let extractedText = "";

      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(" ") + "\n";
        }
        extractedText = text;
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        extractedText = value;
      } else {
        throw new Error("Unsupported file type");
      }

      const candidate = extractFields(extractedText);
      setParsedData(candidate);
    } catch (err: any) {
      setError(err.message || "Failed to parse resume");
    } finally {
      setParsingData(false);
    }
  };

  return { parsedData, parsingData, error, parseResume };
};
