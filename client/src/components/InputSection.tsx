import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { HumanizeRequest } from "@shared/schema";
import AdvancedOptions from "./AdvancedOptions";

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  writingStyle: HumanizeRequest["style"];
  setWritingStyle: (style: HumanizeRequest["style"]) => void;
  emotionTone: HumanizeRequest["emotion"];
  setEmotionTone: (emotion: HumanizeRequest["emotion"]) => void;
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

  const charCount = inputText.length;

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Input</h2>
          <div className="text-sm text-gray-500">{charCount} characters</div>
        </div>

        {/* Text input area */}
        <div className="mb-6">
          <Label htmlFor="ai-text" className="block text-sm font-medium text-gray-700 mb-2">
            Paste your AI-generated text here
          </Label>
          <Textarea
            id="ai-text"
            rows={12}
            className="resize-none"
            placeholder="Enter or paste your AI-generated text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Style controls section */}
        <div className="space-y-5 mb-6">
          <h3 className="text-base font-medium text-gray-800">Style & Tone Settings</h3>
          
          {/* Writing style selection */}
          <div>
            <Label htmlFor="writing-style" className="block text-sm font-medium text-gray-700 mb-2">
              Writing Style
            </Label>
            <Select value={writingStyle} onValueChange={(value) => setWritingStyle(value as HumanizeRequest["style"])}>
              <SelectTrigger id="writing-style">
                <SelectValue placeholder="Select a writing style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emotion tuning */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Emotion Tuning
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={emotionTone === "neutral" ? "secondary" : "outline"}
                onClick={() => setEmotionTone("neutral")}
                className="py-2 px-3 text-sm font-medium"
              >
                Neutral
              </Button>
              <Button
                type="button"
                variant={emotionTone === "positive" ? "secondary" : "outline"}
                onClick={() => setEmotionTone("positive")}
                className="py-2 px-3 text-sm font-medium"
              >
                Positive
              </Button>
              <Button
                type="button"
                variant={emotionTone === "critical" ? "secondary" : "outline"}
                onClick={() => setEmotionTone("critical")}
                className="py-2 px-3 text-sm font-medium"
              >
                Critical
              </Button>
            </div>
          </div>
          
          {/* AI Model Selection */}
          <div>
            <Label htmlFor="ai-model" className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </Label>
            <Select value={aiModel} onValueChange={(value) => setAiModel(value as HumanizeRequest["model"])}>
              <SelectTrigger id="ai-model">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-chat">DeepSeek Chat (General Purpose)</SelectItem>
                <SelectItem value="deepseek-coder">DeepSeek Coder (Technical Content)</SelectItem>
                <SelectItem value="deepseek-instruct">DeepSeek Instruct (Creative Writing)</SelectItem>
                <SelectItem value="deepseek-v3">DeepSeek V3 (Advanced Humanization)</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-gray-500">
              Choose Chat for general content, Coder for technical text, Instruct for creative writing, or V3 for advanced humanization
            </p>
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
            className="flex-1 sm:flex-initial border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 py-3 px-7 rounded-full animated-button"
            onClick={onClear}
            disabled={!inputText.trim() || isProcessing}
          >
            Clear
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
