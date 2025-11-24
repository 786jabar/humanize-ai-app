import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, CheckCircle, BookOpen } from "lucide-react";

interface AdvancedToolsProps {
  outputText: string;
  onTextUpdate: (text: string) => void;
}

export default function AdvancedTools({ outputText, onTextUpdate }: AdvancedToolsProps) {
  const { toast } = useToast();
  const [summaryFormat, setSummaryFormat] = useState<"paragraph" | "bullet-points" | "key-insights">("paragraph");
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "long">("medium");
  const [scoreType, setScoreType] = useState<"grammar" | "coherence" | "clarity" | "academic" | "formal">("grammar");
  const [fromStyle, setFromStyle] = useState<"APA" | "MLA" | "Chicago" | "Harvard">("APA");
  const [toStyle, setToStyle] = useState<"APA" | "MLA" | "Chicago" | "Harvard">("MLA");

  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/summarize", {
        text: outputText,
        format: summaryFormat,
        length: summaryLength
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Summary Generated",
        description: "Your text has been summarized successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    },
  });

  const scoreMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/score", {
        text: outputText,
        criteria: scoreType
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: `Score: ${data.score}/100`,
        description: data.feedback,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to score text",
        variant: "destructive",
      });
    },
  });

  const citationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/transform-citations", {
        text: outputText,
        fromStyle,
        toStyle
      });
      return response.json();
    },
    onSuccess: (data) => {
      onTextUpdate(data.text);
      toast({
        title: "Citations Transformed",
        description: `Text citations converted from ${fromStyle} to ${toStyle} format.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to transform citations",
        variant: "destructive",
      });
    },
  });

  if (!outputText) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        Advanced Tools
      </h3>
      
      <Tabs defaultValue="summarize" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summarize">Summarize</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
        </TabsList>

        <TabsContent value="summarize" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Format</label>
              <Select value={summaryFormat} onValueChange={(v: any) => setSummaryFormat(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="bullet-points">Bullet Points</SelectItem>
                  <SelectItem value="key-insights">Key Insights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Length</label>
              <Select value={summaryLength} onValueChange={(v: any) => setSummaryLength(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={() => summarizeMutation.mutate()} 
            disabled={summarizeMutation.isPending}
            className="w-full"
          >
            {summarizeMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Summary
          </Button>
        </TabsContent>

        <TabsContent value="score" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Evaluate For</label>
            <Select value={scoreType} onValueChange={(v: any) => setScoreType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grammar">Grammar</SelectItem>
                <SelectItem value="coherence">Coherence</SelectItem>
                <SelectItem value="clarity">Clarity</SelectItem>
                <SelectItem value="academic">Academic Writing</SelectItem>
                <SelectItem value="formal">Formality</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => scoreMutation.mutate()} 
            disabled={scoreMutation.isPending}
            className="w-full"
          >
            {scoreMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Score Text
          </Button>
        </TabsContent>

        <TabsContent value="citations" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From Style</label>
              <Select value={fromStyle} onValueChange={(v: any) => setFromStyle(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APA">APA</SelectItem>
                  <SelectItem value="MLA">MLA</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                  <SelectItem value="Harvard">Harvard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">To Style</label>
              <Select value={toStyle} onValueChange={(v: any) => setToStyle(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APA">APA</SelectItem>
                  <SelectItem value="MLA">MLA</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                  <SelectItem value="Harvard">Harvard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={() => citationMutation.mutate()} 
            disabled={citationMutation.isPending}
            className="w-full"
          >
            {citationMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookOpen className="w-4 h-4 mr-2" />}
            Transform Citations
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
