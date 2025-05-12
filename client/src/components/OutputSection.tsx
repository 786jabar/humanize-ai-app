import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, DownloadIcon, Underline } from "lucide-react";
import { HumanizeResponse } from "@shared/schema";
import FeatureHighlights from "./FeatureHighlights";

interface OutputSectionProps {
  outputText: string;
  stats: {
    wordCount: number;
    readingTime: number;
    aiDetectionRisk: HumanizeResponse["stats"]["aiDetectionRisk"];
  };
  isProcessing: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export default function OutputSection({
  outputText,
  stats,
  isProcessing,
  onCopy,
  onDownload
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
              <Underline className="h-10 w-10" />
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
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              <div><span className="font-medium">Reading time:</span> <span>{stats.readingTime} min</span></div>
              <div><span className="font-medium">Word count:</span> <span>{stats.wordCount}</span></div>
              <div>
                <span className="font-medium">AI detection risk:</span>{" "}
                <span className={
                  stats.aiDetectionRisk === "Low" 
                    ? "text-green-600 font-medium" 
                    : stats.aiDetectionRisk === "Medium"
                      ? "text-yellow-600 font-medium"
                      : "text-red-600 font-medium"
                }>
                  {stats.aiDetectionRisk}
                </span>
              </div>
            </div>

            {/* Action buttons for output */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-6"
                onClick={onCopy}
              >
                <ClipboardIcon className="h-4 w-4 mr-1.5" />
                Copy to Clipboard
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-6"
                onClick={onDownload}
              >
                <DownloadIcon className="h-4 w-4 mr-1.5" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>

      <FeatureHighlights />
    </section>
  );
}
