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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Humanized Output</h2>
          <div className="text-sm text-gray-500">{outputText.length} characters</div>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="loader mx-auto h-10 w-10 border-4 border-gray-200 rounded-full border-t-primary"></div>
              <p className="mt-2 text-sm font-medium text-gray-600">Processing your text...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a few moments.</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isProcessing && !hasOutput && (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Underline className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No output yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your humanized text will appear here after processing.</p>
          </div>
        )}

        {/* Output text area */}
        {!isProcessing && hasOutput && (
          <div>
            <Textarea
              rows={16}
              className="resize-none"
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
