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
  const [paraphrasingLevel, setParaphrasingLevel] = useState<HumanizeRequest["paraphrasingLevel"]>("moderate");
  const [sentenceStructure, setSentenceStructure] = useState<HumanizeRequest["sentenceStructure"]>("varied");
  const [vocabularyLevel, setVocabularyLevel] = useState<HumanizeRequest["vocabularyLevel"]>("intermediate");
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
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
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
            onDownload={downloadOutput}
            onClear={clearOutput}
          />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
