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

            {/* Enhanced Output stats with progress bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-sm">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      <ClockIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-xs font-medium text-purple-700 dark:text-purple-300">Reading Time</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.readingTime}<span className="text-sm font-normal text-purple-600 dark:text-purple-400 ml-1">min</span></div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <TextIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Word Count</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.wordCount}<span className="text-sm font-normal text-blue-600 dark:text-blue-400 ml-1">words</span></div>
              </div>

              <div className={`rounded-xl p-4 border hover:shadow-md transition-shadow ${
                stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30"
                  : stats.aiDetectionRisk === "Medium"
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-100 dark:border-yellow-800/30"
                    : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800/30"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shadow-sm ${
                      stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : stats.aiDetectionRisk === "Medium"
                          ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-br from-red-500 to-red-600"
                    }`}>
                      <ShieldIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className={`text-xs font-medium ${
                      stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                        ? "text-green-700 dark:text-green-300"
                        : stats.aiDetectionRisk === "Medium"
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-red-700 dark:text-red-300"
                    }`}>AI Detection</div>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  stats.aiDetectionRisk === "Low" || stats.aiDetectionRisk === "Very Low"
                    ? "text-green-900 dark:text-green-100"
                    : stats.aiDetectionRisk === "Medium"
                      ? "text-yellow-900 dark:text-yellow-100"
                      : "text-red-900 dark:text-red-100"
                }`}>{stats.aiDetectionRisk}</div>
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
