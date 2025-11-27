import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import EnhancedAcademicAssistant from "@/components/EnhancedAcademicAssistant";
import AdvancedTools from "@/components/AdvancedTools";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Layers } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [writingStyle, setWritingStyle] = useState<HumanizeRequest["style"]>("casual");
  const [emotionTone, setEmotionTone] = useState<HumanizeRequest["emotion"]>("neutral");
  const [paraphrasingLevel, setParaphrasingLevel] = useState<HumanizeRequest["paraphrasingLevel"]>("moderate");
  const [sentenceStructure, setSentenceStructure] = useState<HumanizeRequest["sentenceStructure"]>("varied");
  const [vocabularyLevel, setVocabularyLevel] = useState<HumanizeRequest["vocabularyLevel"]>("intermediate");
  const [formality, setFormality] = useState(50);
  const [complexity, setComplexity] = useState(50);
  const [language, setLanguage] = useState<HumanizeRequest["language"]>("us-english");
  const [aiModel, setAiModel] = useState<HumanizeRequest["model"]>("deepseek-chat");
  const [bypassAiDetection, setBypassAiDetection] = useState(true);
  const [improveGrammar, setImproveGrammar] = useState(true);
  const [preserveKeyPoints, setPreserveKeyPoints] = useState(true);
  const [stats, setStats] = useState({
    wordCount: 0,
    readingTime: 0,
    aiDetectionRisk: "Low" as HumanizeResponse["stats"]["aiDetectionRisk"]
  });
  const [detectionTests, setDetectionTests] = useState<HumanizeResponse["detectionTests"]>();
  const [comparisonView, setComparisonView] = useState(false);

  const humanizeMutation = useMutation({
    mutationFn: async () => {
      const payload: HumanizeRequest = {
        text: inputText,
        style: writingStyle,
        emotion: emotionTone,
        paraphrasingLevel,
        sentenceStructure,
        vocabularyLevel,
        language,
        model: aiModel,
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
      setDetectionTests(data.detectionTests);
      toast({
        title: "Success!",
        description: "Your text has been humanized and tested for AI detection.",
      });
    },
    onError: (error) => {
      if (error instanceof Error && isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
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

  const clearOutput = () => {
    setOutputText("");
    setDetectionTests(undefined);
    setStats({
      wordCount: 0,
      readingTime: 0,
      aiDetectionRisk: "Low"
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard.",
    });
  };

  const downloadOutput = (format: 'txt' | 'html' | 'md' = 'txt') => {
    if (!outputText.trim()) return;
    
    let content = outputText;
    let filename = 'humanized-text';
    let mimeType = 'text/plain';

    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Humanized Text</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 900px; margin: 40px auto; padding: 20px; }
    h1 { color: #333; }
    p { color: #555; white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <h1>Humanized Text</h1>
  <p>${outputText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
</body>
</html>`;
      filename = 'humanized-text.html';
      mimeType = 'text/html';
    } else if (format === 'md') {
      content = `# Humanized Text\n\n${outputText}`;
      filename = 'humanized-text.md';
      mimeType = 'text/markdown';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <>
      <Helmet>
        <title>Humanize.AI | Transform AI Content into Natural Human-like Text</title>
        <meta name="description" content="Humanize.AI transforms AI-generated content into natural, human-like text that bypasses AI detection tools. Choose from multiple writing styles and customize output to suit your needs." />
        <meta property="og:title" content="Humanize.AI | Transform AI Content into Natural Human-like Text" />
        <meta property="og:description" content="Bypass AI detection tools and make your AI-generated text sound naturally human with customizable styles, tones and advanced options." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="AI text humanizer, bypass AI detection, human writing style, paraphrasing tool, content rewriting" />
        <meta name="theme-color" content="#8b5cf6" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Header />
        
        <main className="space-y-10 mt-4">
          {/* View Toggle Bar */}
          <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Editor View</h2>
            </div>
            <Button
              variant={comparisonView ? "default" : "outline"}
              onClick={() => setComparisonView(!comparisonView)}
              className={comparisonView
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                : "border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              {comparisonView ? "Split View" : "Standard View"}
            </Button>
          </div>

          {/* Main Content Area */}
          <div className={comparisonView ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-10"}>
            <InputSection 
              inputText={inputText}
              setInputText={setInputText}
              writingStyle={writingStyle}
              setWritingStyle={setWritingStyle}
              emotionTone={emotionTone}
              setEmotionTone={setEmotionTone}
              paraphrasingLevel={paraphrasingLevel}
              setParaphrasingLevel={setParaphrasingLevel}
              sentenceStructure={sentenceStructure}
              setSentenceStructure={setSentenceStructure}
              vocabularyLevel={vocabularyLevel}
              setVocabularyLevel={setVocabularyLevel}
              language={language}
              setLanguage={setLanguage}
              aiModel={aiModel}
              setAiModel={setAiModel}
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
              setOutputText={setOutputText}
              stats={stats}
              detectionTests={detectionTests}
              isProcessing={humanizeMutation.isPending}
              onCopy={copyToClipboard}
              onDownload={() => downloadOutput('txt')}
              onClear={clearOutput}
            />
          </div>

          <AdvancedTools 
            outputText={outputText}
            onTextUpdate={setOutputText}
          />

          <EnhancedAcademicAssistant
            inputText={inputText}
            onTextChange={setInputText}
            onHumanize={() => humanizeMutation.mutate()}
            isProcessing={humanizeMutation.isPending}
          />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
