import { useState } from "react";
import InstructionsCard from "./InstructionsCard";
import { CircleHelp, Sparkles, Wand2, BrainCircuit, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export default function Header() {
  const [showInstructions, setShowInstructions] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <header className="mb-12">
      {/* Logo and branding section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
        <div className="flex items-center">
          <div className="mr-3 bg-gradient-to-br from-purple-600 to-indigo-600 p-2.5 rounded-lg shadow-lg">
            <Wand2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold gradient-text">Humanize.AI</h1>
            <p className="mt-1.5 text-muted-foreground flex items-center">
              <BrainCircuit className="h-4 w-4 mr-1.5 text-purple-500" />
              Transform AI-generated content into natural, human-like text
            </p>
          </div>
        </div>
        
        {/* Actions section */}
        <div className="mt-6 md:mt-0 inline-flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9 p-0 animated-button"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowInstructions(true)}
            className="rounded-full animated-button"
          >
            <CircleHelp className="h-4 w-4 mr-1.5 text-purple-500" />
            Help
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            className="rounded-full animated-button"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Pro Features
          </Button>
        </div>
      </div>

      {/* Animated divider */}
      <div className="relative h-0.5 w-full bg-gradient-to-r from-purple-500/10 via-purple-500/50 to-purple-500/10 mb-8 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse rounded-full" style={{ width: '30%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
      </div>

      {/* Instructions card */}
      {showInstructions && (
        <div className="glass-card p-6 mb-8 animate-in fade-in duration-300">
          <InstructionsCard onClose={() => setShowInstructions(false)} />
        </div>
      )}
    </header>
  );
}
