import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  ClipboardIcon, 
  DownloadIcon, 
  RotateCcw, 
  Clock as ClockIcon, 
  FileText as TextIcon, 
  ShieldCheck as ShieldIcon 
} from "lucide-react";
import DetectionTestResults from "./DetectionTestResults";
import { HumanizeResponse } from "@shared/schema";
import FeatureHighlights from "./FeatureHighlights";
import InteractiveTextArea from "./InteractiveTextArea";

interface OutputSectionProps {
  outputText: string;
  setOutputText: (text: string) => void;
  stats: {
    wordCount: number;
    readingTime: number;
    aiDetectionRisk: HumanizeResponse["stats"]["aiDetectionRisk"];
  };
  detectionTests?: HumanizeResponse["detectionTests"];
  isProcessing: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
}

export default function OutputSection({
  outputText,
  setOutputText,
  stats,
  detectionTests,
  isProcessing,
  onCopy,
  onDownload,
  onClear
}: OutputSectionProps) {
  const hasOutput = outputText.trim().length > 0;
  
  return (
    <section>
      <div className="glass-card p-7 sticky top-6 hover-card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold gradient-text flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-3"></div>
            Humanized Output
          </h2>
          <div className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 py-1 px-3 rounded-full font-medium">
            {outputText.length} characters
          </div>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50/50 dark:bg-purple-900/10">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 border-4 border-purple-200 dark:border-purple-700 rounded-full border-t-purple-600 border-r-indigo-500 animate-spin"></div>
              <p className="mt-3 text-sm font-medium text-purple-800 dark:text-purple-200">Transforming your text into human-like content...</p>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isProcessing && !hasOutput && (
          <div className="border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-xl p-12 text-center bg-purple-50/50 dark:bg-purple-900/10">
            <div className="mx-auto h-16 w-16 text-purple-400 dark:text-purple-500 bg-white/80 dark:bg-gray-800/80 rounded-full p-3 shadow-md">
              <TextIcon className="h-10 w-10" />
            </div>
            <h3 className="mt-3 text-base font-medium text-purple-800 dark:text-purple-200">No output yet</h3>
            <p className="mt-2 text-sm text-purple-600/70 dark:text-purple-400/70">Your humanized text will appear here after processing</p>
          </div>
        )}

        {/* Output text area */}
        {!isProcessing && hasOutput && (
          <div>
            <Textarea
              rows={16}
              className="w-full resize-none rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-inner"
              readOnly
              value={outputText}
            />

            {/* Output stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-sm">
              <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-800/40 rounded-full flex items-center justify-center mr-3">
                  <ClockIcon className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Reading time</div>
                  <div className="font-semibold text-purple-900 dark:text-purple-200">{stats.readingTime} min</div>
                </div>
              </div>
              
              <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-800/40 rounded-full flex items-center justify-center mr-3">
                  <TextIcon className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Word count</div>
                  <div className="font-semibold text-purple-900 dark:text-purple-200">{stats.wordCount}</div>
                </div>
              </div>
              
              <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-3 flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                  stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                    ? "bg-green-100 dark:bg-green-900/30" 
                    : stats.aiDetectionRisk === "Medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                }`}>
                  <ShieldIcon className={`h-4 w-4 ${
                    stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                      ? "text-green-600 dark:text-green-400" 
                      : stats.aiDetectionRisk === "Medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`} />
                </div>
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">AI detection risk</div>
                  <div className={`font-semibold ${
                    stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                      ? "text-green-600 dark:text-green-400" 
                      : stats.aiDetectionRisk === "Medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`}>
                    {stats.aiDetectionRisk}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons for output */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-7 rounded-full shadow-md hover:shadow-lg hover:shadow-purple-500/30 animated-button"
                onClick={onCopy}
              >
                <ClipboardIcon className="h-5 w-5 mr-2" />
                Copy to Clipboard
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-initial border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 py-3 px-7 rounded-full animated-button"
                onClick={onDownload}
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-initial border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-3 px-7 rounded-full animated-button"
                onClick={onClear}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Delete Output
              </Button>
            </div>
          </div>
        )}
        
        {/* AI Detection Test Results */}
        {hasOutput && detectionTests && detectionTests.length > 0 && (
          <DetectionTestResults tests={detectionTests} />
        )}
      </div>

      <FeatureHighlights />
    </section>
  );
}
