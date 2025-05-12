import { useState } from "react";
import InstructionsCard from "./InstructionsCard";
import { CircleHelp, Heading6 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <header className="mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human-Sounding AI Summarizer</h1>
          <p className="mt-2 text-lg text-gray-600">Transform AI-generated content into natural, human-like text</p>
        </div>
        <div className="mt-4 md:mt-0 inline-flex gap-4">
          <Button variant="ghost" className="text-primary font-medium">
            <CircleHelp className="h-4 w-4 mr-1" />
            Help
          </Button>
          <Button variant="ghost" className="text-primary font-medium">
            <Heading6 className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {showInstructions && <InstructionsCard onClose={() => setShowInstructions(false)} />}
    </header>
  );
}
