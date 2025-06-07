import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Brain, Edit3, Library, CheckCircle, Sparkles, Copy, Zap, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AcademicTemplate {
  id: string;
  title: string;
  category: string;
  icon: any;
  color: string;
  prompt: string;
  example: string;
  level: "undergraduate" | "graduate" | "doctoral";
}

interface EnhancedAcademicAssistantProps {
  inputText: string;
  onTextChange: (text: string) => void;
  onHumanize: () => void;
  isProcessing: boolean;
}

const academicTemplates: AcademicTemplate[] = [
  // Formal Academic Tone
  {
    id: "formal-1",
    title: "University Essay Tone",
    category: "Academic Tone",
    icon: GraduationCap,
    color: "purple",
    level: "undergraduate",
    prompt: "Transform this text into formal academic language suitable for university-level essays. Use sophisticated vocabulary, complex sentence structures, and scholarly tone while maintaining clarity and precision.",
    example: "Instead of 'This is really important' → 'This phenomenon demonstrates considerable significance within the academic discourse'"
  },
  {
    id: "formal-2", 
    title: "Research Paper Style",
    category: "Academic Tone",
    icon: GraduationCap,
    color: "purple", 
    level: "graduate",
    prompt: "Rewrite this content using research paper conventions: objective tone, evidence-based language, scholarly vocabulary, and formal academic register appropriate for peer-reviewed publications.",
    example: "Transforms personal opinions into scholarly arguments with academic backing"
  },
  {
    id: "formal-3",
    title: "Dissertation Academic Voice", 
    category: "Academic Tone",
    icon: GraduationCap,
    color: "purple",
    level: "doctoral",
    prompt: "Elevate this text to dissertation-level academic writing with advanced theoretical engagement, sophisticated argumentation, and scholarly rigor expected in doctoral research.",
    example: "Creates PhD-level academic discourse with theoretical depth"
  },

  // Critical Analysis & Arguments
  {
    id: "critical-1",
    title: "Analytical Framework",
    category: "Critical Thinking", 
    icon: Brain,
    color: "blue",
    level: "undergraduate",
    prompt: "Transform this into a critical analysis by adding analytical frameworks, evaluating evidence, questioning assumptions, and developing reasoned arguments with supporting evidence.",
    example: "Converts descriptions into critical evaluations with scholarly reasoning"
  },
  {
    id: "critical-2",
    title: "Thesis Development",
    category: "Critical Thinking",
    icon: Brain, 
    color: "blue",
    level: "graduate",
    prompt: "Develop this content into a strong academic thesis with clear argumentation, counterargument consideration, evidence integration, and logical progression of ideas.",
    example: "Builds robust academic arguments with thesis-antithesis-synthesis structure"
  },
  {
    id: "critical-3",
    title: "Theoretical Integration",
    category: "Critical Thinking",
    icon: Brain,
    color: "blue", 
    level: "doctoral",
    prompt: "Integrate relevant academic theories (specify field if needed) into this analysis. Connect ideas to established scholarly frameworks and demonstrate theoretical sophistication.",
    example: "Weaves academic theories seamlessly into the argument"
  },

  // Structure & Organization
  {
    id: "structure-1", 
    title: "PEEL Paragraph Structure",
    category: "Structure",
    icon: Edit3,
    color: "green",
    level: "undergraduate", 
    prompt: "Reorganize this content using PEEL structure: Point (topic sentence), Evidence (supporting details), Explanation (analysis), Link (connection to thesis/next point).",
    example: "Creates well-structured academic paragraphs with clear progression"
  },
  {
    id: "structure-2",
    title: "Academic Essay Organization", 
    category: "Structure",
    icon: Edit3,
    color: "green",
    level: "graduate",
    prompt: "Structure this content with clear introduction (context + thesis), body paragraphs (topic sentences + evidence + analysis), and conclusion (synthesis + implications).",
    example: "Develops comprehensive academic essay structure"
  },
  {
    id: "structure-3",
    title: "Research Paper Framework",
    category: "Structure", 
    icon: Edit3,
    color: "green",
    level: "doctoral",
    prompt: "Organize this into research paper format with literature review integration, methodology consideration, findings analysis, and scholarly implications for the field.",
    example: "Creates publication-ready academic structure"
  },

  // Theory & Literature Integration
  {
    id: "theory-1",
    title: "Media Theory Application",
    category: "Theory Integration",
    icon: Library,
    color: "indigo", 
    level: "undergraduate",
    prompt: "Apply relevant media theories (Barthes, Hall, McLuhan, Baudrillard) to this analysis. Explain how theoretical frameworks illuminate the topic and provide scholarly depth.",
    example: "Integrates seminal media theories into contemporary analysis"
  },
  {
    id: "theory-2",
    title: "Interdisciplinary Synthesis", 
    category: "Theory Integration",
    icon: Library,
    color: "indigo",
    level: "graduate", 
    prompt: "Draw connections between this topic and multiple academic disciplines. Integrate theories from relevant fields to create interdisciplinary scholarly analysis.",
    example: "Bridges multiple academic fields for comprehensive understanding"
  },
  {
    id: "theory-3",
    title: "Advanced Theoretical Framework",
    category: "Theory Integration",
    icon: Library, 
    color: "indigo",
    level: "doctoral",
    prompt: "Develop sophisticated theoretical framework by synthesizing multiple academic theories, identifying gaps in current scholarship, and proposing new theoretical insights.",
    example: "Creates original theoretical contributions to academic discourse"
  },

  // Language & Style Enhancement
  {
    id: "language-1",
    title: "Academic Vocabulary",
    category: "Language Enhancement", 
    icon: BookOpen,
    color: "orange",
    level: "undergraduate",
    prompt: "Replace informal language with academic vocabulary. Use scholarly terminology, formal register, and university-appropriate linguistic choices while maintaining clarity.",
    example: "Elevates vocabulary to appropriate academic level"
  },
  {
    id: "language-2", 
    title: "Scholarly Voice Development",
    category: "Language Enhancement",
    icon: BookOpen,
    color: "orange",
    level: "graduate",
    prompt: "Develop authoritative scholarly voice using hedging language, academic modality, citation integration, and professional tone expected in academic publications.",
    example: "Creates confident yet appropriately hedged academic voice"
  },
  {
    id: "language-3",
    title: "Expert Academic Register",
    category: "Language Enhancement",
    icon: BookOpen, 
    color: "orange",
    level: "doctoral",
    prompt: "Achieve expert-level academic writing with sophisticated linguistic choices, nuanced argumentation, and the scholarly authority expected in high-level academic discourse.",
    example: "Demonstrates mastery of academic communication conventions"
  }
];

const categories = [
  { name: "All", icon: Sparkles, color: "purple" },
  { name: "Academic Tone", icon: GraduationCap, color: "purple" },
  { name: "Critical Thinking", icon: Brain, color: "blue" },
  { name: "Structure", icon: Edit3, color: "green" },
  { name: "Theory Integration", icon: Library, color: "indigo" },
  { name: "Language Enhancement", icon: BookOpen, color: "orange" }
];

const levels = [
  { name: "All Levels", value: "all", icon: Target, color: "gray" },
  { name: "Undergraduate", value: "undergraduate", icon: BookOpen, color: "green" },
  { name: "Graduate", value: "graduate", icon: Brain, color: "blue" },
  { name: "Doctoral", value: "doctoral", icon: Award, color: "purple" }
];

export default function EnhancedAcademicAssistant({
  inputText,
  onTextChange,
  onHumanize,
  isProcessing
}: EnhancedAcademicAssistantProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [customPrompt, setCustomPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const { toast } = useToast();

  const filteredTemplates = academicTemplates.filter(template => {
    const categoryMatch = selectedCategory === "All" || template.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || template.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const applyTemplate = (template: AcademicTemplate) => {
    if (!inputText.trim()) {
      toast({
        title: "No input text",
        description: "Please enter some text first to apply academic templates.",
        variant: "destructive"
      });
      return;
    }

    const enhancedText = `${template.prompt}\n\nOriginal text: ${inputText}`;
    onTextChange(enhancedText);
    
    toast({
      title: "Academic template applied",
      description: `Applied: ${template.title} (${template.level})`,
    });

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
      title: "Custom template applied",
      description: "Your custom academic prompt has been applied.",
    });

    setTimeout(() => {
      onHumanize();
    }, 500);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800",
      blue: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800", 
      green: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800",
      orange: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
      gray: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800"
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "undergraduate": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "graduate": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "doctoral": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-purple-600" />
          Enhanced Academic Writing Assistant
          <Badge variant="secondary" className="ml-auto">Professional Templates</Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Transform your writing with expert academic templates designed for university success.
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Academic Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Prompts</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Filters */}
            <div className="space-y-3">
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
                      className="text-xs h-8"
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>

              {/* Level Filters */}
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => {
                  const IconComponent = level.icon;
                  return (
                    <Button
                      key={level.value}
                      variant={selectedLevel === level.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLevel(level.value)}
                      className="text-xs h-8"
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {level.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Templates Grid */}
            <ScrollArea className="h-80 w-full">
              <div className="grid grid-cols-1 gap-3 pr-4">
                {filteredTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-400"
                      onClick={() => applyTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-purple-600" />
                            <h4 className="font-medium text-sm">{template.title}</h4>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            <Badge className={cn("text-xs", getLevelBadgeColor(template.level))}>
                              {template.level}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {template.prompt}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 italic">
                          {template.example}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Create Custom Academic Prompt</h4>
                <Textarea
                  placeholder="Enter your custom academic writing instructions. Be specific about tone, structure, theories, or style requirements..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="h-32"
                />
              </div>
              <Button
                onClick={applyCustomPrompt}
                disabled={!customPrompt.trim() || !inputText.trim() || isProcessing}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Apply Custom Prompt
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-3 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {filteredTemplates.length}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Templates</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                5
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">Categories</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                3
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">Academic Levels</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}