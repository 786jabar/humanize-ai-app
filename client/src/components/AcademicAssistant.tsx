import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, BookOpen, Brain, Edit3, Library, CheckCircle, Sparkles, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AcademicPrompt {
  id: number;
  category: string;
  icon: any;
  color: string;
  prompt: string;
}

interface AcademicAssistantProps {
  inputText: string;
  onTextChange: (text: string) => void;
  onHumanize: () => void;
  isProcessing: boolean;
}

const academicPrompts: AcademicPrompt[] = [
  // Academic Tone Conversion
  { id: 1, category: "Academic Tone", icon: GraduationCap, color: "purple", prompt: "Rewrite this paragraph in a formal academic tone suitable for university-level writing." },
  { id: 2, category: "Academic Tone", icon: GraduationCap, color: "purple", prompt: "Convert this casual explanation into scholarly language." },
  { id: 3, category: "Academic Tone", icon: GraduationCap, color: "purple", prompt: "Edit this text to sound more analytical and objective." },
  { id: 4, category: "Academic Tone", icon: GraduationCap, color: "purple", prompt: "Improve this writing by using complex sentence structures and academic vocabulary." },
  { id: 5, category: "Academic Tone", icon: GraduationCap, color: "purple", prompt: "Upgrade this sentence for use in an academic essay." },

  // Critical Thinking & Argument
  { id: 6, category: "Critical Thinking", icon: Brain, color: "blue", prompt: "Expand this idea into a critical argument with reasoning and evidence." },
  { id: 7, category: "Critical Thinking", icon: Brain, color: "blue", prompt: "Add a counterargument and response to this paragraph." },
  { id: 8, category: "Critical Thinking", icon: Brain, color: "blue", prompt: "Explain this concept using academic theories or terminology." },
  { id: 9, category: "Critical Thinking", icon: Brain, color: "blue", prompt: "Rephrase this paragraph to include critical evaluation, not just description." },
  { id: 10, category: "Critical Thinking", icon: Brain, color: "blue", prompt: "Strengthen this analysis by connecting it to a relevant academic debate." },

  // Structure & Clarity
  { id: 11, category: "Structure", icon: Edit3, color: "green", prompt: "Organize this content into an introduction, body, and conclusion." },
  { id: 12, category: "Structure", icon: Edit3, color: "green", prompt: "Rewrite this paragraph using the PEEL structure: Point, Evidence, Explanation, Link." },
  { id: 13, category: "Structure", icon: Edit3, color: "green", prompt: "Suggest a topic sentence for this paragraph." },
  { id: 14, category: "Structure", icon: Edit3, color: "green", prompt: "Summarize this paragraph in one concise academic sentence." },
  { id: 15, category: "Structure", icon: Edit3, color: "green", prompt: "Improve the flow and cohesion between these two paragraphs." },

  // Theory Integration
  { id: 16, category: "Theory", icon: Library, color: "indigo", prompt: "Explain this topic using Stuart Hall's encoding/decoding theory." },
  { id: 17, category: "Theory", icon: Library, color: "indigo", prompt: "Include Roland Barthes' concept of 'Death of the Author' in this analysis." },
  { id: 18, category: "Theory", icon: Library, color: "indigo", prompt: "Compare this idea to a media theory from Barthes, Hall, or McLuhan." },
  { id: 19, category: "Theory", icon: Library, color: "indigo", prompt: "Mention a key academic author relevant to this argument." },
  { id: 20, category: "Theory", icon: Library, color: "indigo", prompt: "Add an example from film, video games, or fandom to support this point." },

  // Grammar & Vocabulary
  { id: 21, category: "Grammar", icon: BookOpen, color: "orange", prompt: "Correct grammar errors in this paragraph while keeping a formal tone." },
  { id: 22, category: "Grammar", icon: BookOpen, color: "orange", prompt: "Replace simple words with more academic synonyms." },
  { id: 23, category: "Grammar", icon: BookOpen, color: "orange", prompt: "Check this writing for passive voice and revise where needed." },
  { id: 24, category: "Grammar", icon: BookOpen, color: "orange", prompt: "Turn bullet points into full academic sentences." },
  { id: 25, category: "Grammar", icon: BookOpen, color: "orange", prompt: "Simplify this academic text into clear, readable English for general understanding." },

  // Ethical & Supportive
  { id: 26, category: "Ethics", icon: CheckCircle, color: "emerald", prompt: "Highlight any parts of this text that may require citation." },
  { id: 27, category: "Ethics", icon: CheckCircle, color: "emerald", prompt: "Check this essay for potential bias or uncritical assumptions." },
  { id: 28, category: "Ethics", icon: CheckCircle, color: "emerald", prompt: "Provide feedback on how inclusive and respectful the language is." },
  { id: 29, category: "Ethics", icon: CheckCircle, color: "emerald", prompt: "Suggest ways to improve clarity for non-native English readers." },
  { id: 30, category: "Ethics", icon: CheckCircle, color: "emerald", prompt: "Ensure this paragraph aligns with academic integrity standards." }
];

const categories = [
  { name: "All", icon: Sparkles, color: "purple" },
  { name: "Academic Tone", icon: GraduationCap, color: "purple" },
  { name: "Critical Thinking", icon: Brain, color: "blue" },
  { name: "Structure", icon: Edit3, color: "green" },
  { name: "Theory", icon: Library, color: "indigo" },
  { name: "Grammar", icon: BookOpen, color: "orange" },
  { name: "Ethics", icon: CheckCircle, color: "emerald" }
];

export default function AcademicAssistant({ 
  inputText, 
  onTextChange, 
  onHumanize, 
  isProcessing 
}: AcademicAssistantProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrompt, setSelectedPrompt] = useState<AcademicPrompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const { toast } = useToast();

  const filteredPrompts = selectedCategory === "All" 
    ? academicPrompts 
    : academicPrompts.filter(p => p.category === selectedCategory);

  const applyPrompt = (prompt: AcademicPrompt) => {
    if (!inputText.trim()) {
      toast({
        title: "No input text",
        description: "Please enter some text first to apply academic prompts.",
        variant: "destructive"
      });
      return;
    }

    setSelectedPrompt(prompt);
    const enhancedText = `${prompt.prompt}\n\nOriginal text: ${inputText}`;
    onTextChange(enhancedText);
    
    toast({
      title: "Academic prompt applied",
      description: `Applied: ${prompt.category} prompt`,
    });

    // Auto-trigger humanization after applying prompt
    setTimeout(() => {
      onHumanize();
    }, 500);
  };

  const applyCustomPrompt = () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a custom academic prompt.",
        variant: "destructive"
      });
      return;
    }

    if (!inputText.trim()) {
      toast({
        title: "No input text",
        description: "Please enter some text first to apply custom prompts.",
        variant: "destructive"
      });
      return;
    }

    const enhancedText = `${customPrompt}\n\nOriginal text: ${inputText}`;
    onTextChange(enhancedText);
    
    toast({
      title: "Custom prompt applied",
      description: "Your custom academic prompt has been applied.",
    });

    setTimeout(() => {
      onHumanize();
    }, 500);
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt copied",
      description: "Academic prompt copied to clipboard.",
    });
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800",
      blue: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
      green: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800",
      orange: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800"
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <Card className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-purple-600" />
          Academic Writing Assistant
          <Badge variant="secondary" className="ml-auto">30 Expert Prompts</Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Transform your text with professional academic writing prompts designed for university-level work.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "text-xs h-8",
                  selectedCategory === category.name && getColorClasses(category.color)
                )}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Prompt Grid */}
        <ScrollArea className="h-64 w-full">
          <div className="grid grid-cols-1 gap-2 pr-4">
            {filteredPrompts.map((prompt) => {
              const IconComponent = prompt.icon;
              return (
                <div
                  key={prompt.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group",
                    getColorClasses(prompt.color),
                    selectedPrompt?.id === prompt.id && "ring-2 ring-purple-400"
                  )}
                  onClick={() => applyPrompt(prompt)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4" />
                        <Badge variant="outline" className="text-xs">
                          {prompt.category}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100">
                        {prompt.prompt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyPrompt(prompt.prompt);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Custom Prompt Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Custom Academic Prompt</h4>
          <div className="flex gap-2">
            <Textarea
              placeholder="Write your own academic writing prompt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-1 h-20 text-sm"
            />
            <Button
              onClick={applyCustomPrompt}
              disabled={!customPrompt.trim() || !inputText.trim() || isProcessing}
              className="self-end"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {filteredPrompts.length}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Available Prompts</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                6
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Categories</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}