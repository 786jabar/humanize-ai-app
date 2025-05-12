import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { HumanizeRequest, HumanizeResponse } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [writingStyle, setWritingStyle] = useState<HumanizeRequest["style"]>("casual");
  const [emotionTone, setEmotionTone] = useState<HumanizeRequest["emotion"]>("neutral");
  const [bypassAiDetection, setBypassAiDetection] = useState(true);
  const [improveGrammar, setImproveGrammar] = useState(true);
  const [preserveKeyPoints, setPreserveKeyPoints] = useState(true);
  const [stats, setStats] = useState({
    wordCount: 0,
    readingTime: 0,
    aiDetectionRisk: "Low" as HumanizeResponse["stats"]["aiDetectionRisk"]
  });

  const humanizeMutation = useMutation({
    mutationFn: async () => {
      const payload: HumanizeRequest = {
        text: inputText,
        style: writingStyle,
        emotion: emotionTone,
        bypassAiDetection,
        improveGrammar,
        preserveKeyPoints
      };

      const response = await apiRequest("POST", "/api/humanize", payload);
      return response.json() as Promise<HumanizeResponse>;
    },
    onSuccess: (data) => {
      setOutputText(data.text);
      setStats(data.stats);
      toast({
        title: "Success!",
        description: "Your text has been humanized successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to humanize text",
        variant: "destructive",
      });
    },
  });

  const clearInput = () => {
    setInputText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard.",
    });
  };

  const downloadOutput = () => {
    if (!outputText.trim()) return;
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'humanized-text.txt';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <>
      <Helmet>
        <title>Human-Sounding AI Summarizer</title>
        <meta name="description" content="Transform AI-generated content into natural, human-like text that bypasses AI detection tools." />
        <meta property="og:title" content="Human-Sounding AI Summarizer" />
        <meta property="og:description" content="Make your AI-generated text sound more human and undetectable." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Header />
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection 
            inputText={inputText}
            setInputText={setInputText}
            writingStyle={writingStyle}
            setWritingStyle={setWritingStyle}
            emotionTone={emotionTone}
            setEmotionTone={setEmotionTone}
            bypassAiDetection={bypassAiDetection}
            setBypassAiDetection={setBypassAiDetection}
            improveGrammar={improveGrammar}
            setImproveGrammar={setImproveGrammar}
            preserveKeyPoints={preserveKeyPoints}
            setPreserveKeyPoints={setPreserveKeyPoints}
            onHumanize={() => humanizeMutation.mutate()}
            onClear={clearInput}
            isProcessing={humanizeMutation.isPending}
          />
          
          <OutputSection 
            outputText={outputText}
            stats={stats}
            isProcessing={humanizeMutation.isPending}
            onCopy={copyToClipboard}
            onDownload={downloadOutput}
          />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
