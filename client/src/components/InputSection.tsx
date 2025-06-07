import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SparklesIcon, ZapIcon, RotateCcw, GraduationCap } from "lucide-react";
import { HumanizeRequest } from "@shared/schema";
import AdvancedOptions from "./AdvancedOptions";
import InteractiveTextArea from "./InteractiveTextArea";
import AcademicAssistant from "./AcademicAssistant";

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  writingStyle: HumanizeRequest["style"];
  setWritingStyle: (style: HumanizeRequest["style"]) => void;
  emotionTone: HumanizeRequest["emotion"];
  setEmotionTone: (emotion: HumanizeRequest["emotion"]) => void;
  paraphrasingLevel: HumanizeRequest["paraphrasingLevel"];
  setParaphrasingLevel: (level: HumanizeRequest["paraphrasingLevel"]) => void;
  sentenceStructure: HumanizeRequest["sentenceStructure"];
  setSentenceStructure: (structure: HumanizeRequest["sentenceStructure"]) => void;
  vocabularyLevel: HumanizeRequest["vocabularyLevel"];
  setVocabularyLevel: (level: HumanizeRequest["vocabularyLevel"]) => void;
  language: HumanizeRequest["language"];
  setLanguage: (language: HumanizeRequest["language"]) => void;
  aiModel: HumanizeRequest["model"];
  setAiModel: (model: HumanizeRequest["model"]) => void;
  bypassAiDetection: boolean;
  setBypassAiDetection: (value: boolean) => void;
  improveGrammar: boolean;
  setImproveGrammar: (value: boolean) => void;
  preserveKeyPoints: boolean;
  setPreserveKeyPoints: (value: boolean) => void;
  onHumanize: () => void;
  onClear: () => void;
  isProcessing: boolean;
}

export default function InputSection({
  inputText,
  setInputText,
  writingStyle,
  setWritingStyle,
  emotionTone,
  setEmotionTone,
  paraphrasingLevel,
  setParaphrasingLevel,
  sentenceStructure,
  setSentenceStructure,
  vocabularyLevel,
  setVocabularyLevel,
  language,
  setLanguage,
  aiModel,
  setAiModel,
  bypassAiDetection,
  setBypassAiDetection,
  improveGrammar,
  setImproveGrammar,
  preserveKeyPoints,
  setPreserveKeyPoints,
  onHumanize,
  onClear,
  isProcessing
}: InputSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAcademic, setShowAcademic] = useState(false);

  const charCount = inputText.length;

  return (
    <section className="space-y-8">
      <div className="glass-card p-7 hover-card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold gradient-text flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-3"></div>
            Input Text
          </h2>
          <div className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 py-1 px-3 rounded-full font-medium">
            {charCount} characters
          </div>
        </div>

        {/* Text input area */}
        <div className="mb-6">
          <Label htmlFor="ai-text" className="flex items-center gap-2 text-sm font-medium mb-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            Paste your AI-generated text here
          </Label>
          <div className="relative">
            <Textarea
              id="ai-text"
              rows={12}
              className="w-full resize-none rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-inner"
              placeholder="Enter or paste your AI-generated text here for humanization..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
            />
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm text-purple-800 dark:text-purple-300 shadow-sm">
              {charCount < 10 ? (
                <span className="text-red-500 font-medium">At least 10 characters needed</span>
              ) : (
                <span>Characters: {charCount}</span>
              )}
            </div>
          </div>
        </div>

        {/* Style controls section */}
        <div className="space-y-6 mb-7 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
          <h3 className="text-base font-bold text-purple-900 dark:text-purple-300 flex items-center">
            <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-2.5"></div>
            Style & Tone Settings
          </h3>
          
          {/* Writing style selection */}
          <div className="bg-white/60 dark:bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
            <Label htmlFor="writing-style" className="flex items-center gap-2 text-sm font-medium mb-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              Writing Style
            </Label>
            <Select value={writingStyle} onValueChange={(value) => setWritingStyle(value as HumanizeRequest["style"])}>
              <SelectTrigger id="writing-style" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white/80 dark:bg-gray-900/60">
                <SelectValue placeholder="Select a writing style" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                <SelectItem value="casual" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">Casual</SelectItem>
                <SelectItem value="formal" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">Formal</SelectItem>
                <SelectItem value="academic" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">Academic</SelectItem>
                <SelectItem value="creative" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">Creative</SelectItem>
                <SelectItem value="technical" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">Technical</SelectItem>
                <SelectItem value="conversational" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">Conversational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emotion tuning */}
          <div className="bg-white/60 dark:bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
            <Label className="flex items-center gap-2 text-sm font-medium mb-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              Emotion Tuning
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEmotionTone("neutral")}
                className={`py-2 px-3 text-sm font-medium rounded-lg ${
                  emotionTone === "neutral" 
                    ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800" 
                    : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
                }`}
              >
                Neutral
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEmotionTone("positive")}
                className={`py-2 px-3 text-sm font-medium rounded-lg ${
                  emotionTone === "positive" 
                    ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800" 
                    : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
                }`}
              >
                Positive
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEmotionTone("critical")}
                className={`py-2 px-3 text-sm font-medium rounded-lg ${
                  emotionTone === "critical" 
                    ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800" 
                    : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
                }`}
              >
                Critical
              </Button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white/60 dark:bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              Language Variant
            </h3>
            
            <Label htmlFor="language" className="text-xs text-muted-foreground mb-1 block">
              English Variant
            </Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as HumanizeRequest["language"])}>
              <SelectTrigger id="language" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white/80 dark:bg-gray-900/60">
                <SelectValue placeholder="Select language variant" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                <SelectItem value="us-english" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  🇺🇸 US English (American)
                </SelectItem>
                <SelectItem value="uk-english" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  🇬🇧 UK English (British)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-purple-700 dark:text-purple-400 bg-purple-50/70 dark:bg-purple-900/30 p-2 rounded-md">
              Adjusts spelling, vocabulary, and cultural references for the selected English variant
            </p>
          </div>
          
          {/* AI Model Selection */}
          <div className="bg-white/60 dark:bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
            <Label htmlFor="ai-model" className="flex items-center gap-2 text-sm font-medium mb-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              AI Model
            </Label>
            <Select value={aiModel} onValueChange={(value) => setAiModel(value as HumanizeRequest["model"])}>
              <SelectTrigger id="ai-model" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white/80 dark:bg-gray-900/60">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                <SelectItem value="deepseek-chat" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex flex-col">
                    <span>DeepSeek Chat (Conversational)</span>
                    <span className="text-xs text-muted-foreground">Good stealth • Natural voice</span>
                  </div>
                </SelectItem>
                <SelectItem value="deepseek-coder" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex flex-col">
                    <span>DeepSeek Coder (Technical)</span>
                    <span className="text-xs text-muted-foreground">Medium stealth • Expert tone</span>
                  </div>
                </SelectItem>
                <SelectItem value="deepseek-instruct" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex flex-col">
                    <span>DeepSeek Instruct (Creative)</span>
                    <span className="text-xs text-muted-foreground">High stealth • Expressive style</span>
                  </div>
                </SelectItem>
                <SelectItem value="deepseek-v3" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <div className="flex flex-col">
                    <span>DeepSeek V3 (Maximum Stealth) ⭐</span>
                    <span className="text-xs text-green-600 font-medium">BEST • Undetectable • Human flaws</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-purple-700 dark:text-purple-400 bg-purple-50/70 dark:bg-purple-900/30 p-2 rounded-md">
              <strong>V3 Model</strong> adds human imperfections and natural writing patterns for maximum stealth against AI detectors
            </p>
          </div>

          {/* Paraphrasing Controls */}
          <div className="bg-white/60 dark:bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              Paraphrasing Options
            </h3>
            
            {/* Paraphrasing Level */}
            <div className="mb-4">
              <Label htmlFor="paraphrasing-level" className="text-xs text-muted-foreground mb-1 block">
                Paraphrasing Level
              </Label>
              <Select value={paraphrasingLevel} onValueChange={(value) => setParaphrasingLevel(value as HumanizeRequest["paraphrasingLevel"])}>
                <SelectTrigger id="paraphrasing-level" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white/80 dark:bg-gray-900/60">
                  <SelectValue placeholder="Select paraphrasing level" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                  <SelectItem value="minimal" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Minimal - Light rewording
                  </SelectItem>
                  <SelectItem value="moderate" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Moderate - Standard rewording
                  </SelectItem>
                  <SelectItem value="extensive" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Extensive - Complete rephrasing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sentence Structure */}
            <div className="mb-4">
              <Label htmlFor="sentence-structure" className="text-xs text-muted-foreground mb-1 block">
                Sentence Structure
              </Label>
              <Select value={sentenceStructure} onValueChange={(value) => setSentenceStructure(value as HumanizeRequest["sentenceStructure"])}>
                <SelectTrigger id="sentence-structure" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white/80 dark:bg-gray-900/60">
                  <SelectValue placeholder="Select sentence structure" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                  <SelectItem value="simple" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Simple - Short, direct sentences
                  </SelectItem>
                  <SelectItem value="varied" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Varied - Mix of sentence types
                  </SelectItem>
                  <SelectItem value="complex" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Complex - Sophisticated sentence patterns
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Vocabulary Level */}
            <div>
              <Label htmlFor="vocabulary-level" className="text-xs text-muted-foreground mb-1 block">
                Vocabulary Level
              </Label>
              <Select value={vocabularyLevel} onValueChange={(value) => setVocabularyLevel(value as HumanizeRequest["vocabularyLevel"])}>
                <SelectTrigger id="vocabulary-level" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white/80 dark:bg-gray-900/60">
                  <SelectValue placeholder="Select vocabulary level" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                  <SelectItem value="basic" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Basic - Common, everyday words
                  </SelectItem>
                  <SelectItem value="intermediate" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Intermediate - Standard vocabulary
                  </SelectItem>
                  <SelectItem value="advanced" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Advanced - Sophisticated, varied vocabulary
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 text-xs bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-md border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium text-green-800 dark:text-green-300">Anti-Detection Power</span>
                </div>
                <p className="text-green-700 dark:text-green-400 mb-2">
                  For maximum undetectability: Use <strong>Extensive paraphrasing</strong> + <strong>Varied sentences</strong> + <strong>DeepSeek V3</strong> model
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setParaphrasingLevel("extensive");
                    setSentenceStructure("varied");
                    setVocabularyLevel("intermediate");
                    setAiModel("deepseek-v3");
                    setBypassAiDetection(true);
                  }}
                  className="h-7 text-xs bg-green-50 hover:bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:border-green-700 dark:text-green-300"
                >
                  <ZapIcon className="w-3 h-3 mr-1" />
                  Optimize for Stealth
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced options */}
          <AdvancedOptions 
            showAdvanced={showAdvanced}
            toggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            bypassAiDetection={bypassAiDetection}
            setBypassAiDetection={setBypassAiDetection}
            improveGrammar={improveGrammar}
            setImproveGrammar={setImproveGrammar}
            preserveKeyPoints={preserveKeyPoints}
            setPreserveKeyPoints={setPreserveKeyPoints}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-7 rounded-full shadow-md hover:shadow-lg hover:shadow-purple-500/30 animated-button"
            onClick={onHumanize}
            disabled={!inputText.trim() || isProcessing}
          >
            {isProcessing ? (
              <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <SparklesIcon className="h-5 w-5 mr-2" />
            )}
            {isProcessing ? "Processing..." : "Humanize Text"}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-initial border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-3 px-7 rounded-full animated-button"
            onClick={onClear}
            disabled={!inputText.trim() || isProcessing}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Delete Input
          </Button>
        </div>
      </div>

      {/* Image tiles showing the app concept */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* A person editing text on a computer with AI assistance */}
        <div className="rounded-lg overflow-hidden h-40 bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
            alt="Person editing text on computer" 
            className="w-full h-full object-cover" 
          />
        </div>
        {/* Abstract visualization of AI technology transforming text */}
        <div className="rounded-lg overflow-hidden h-40 bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
            alt="AI technology concept" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </section>
  );
}
