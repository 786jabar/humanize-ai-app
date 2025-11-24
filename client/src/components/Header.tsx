import { useState } from "react";
import InstructionsCard from "./InstructionsCard";
import { CircleHelp, Sparkles, Wand2, BrainCircuit, Settings, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [showInstructions, setShowInstructions] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const handleLogout = () => {
    // Clear user cache before logout
    import("@/lib/queryClient").then(({ queryClient }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    });
    setTimeout(() => {
      window.location.href = "/api/logout";
    }, 100);
  };

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
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              {user.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                {user.email || user.firstName || 'User'}
              </span>
            </div>
          )}
          
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
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="rounded-full animated-button"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            Logout
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
