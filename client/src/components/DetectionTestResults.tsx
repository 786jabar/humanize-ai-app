import { AiDetectionTest } from "@shared/schema";
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, ShieldCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DetectionTestResultsProps {
  tests: AiDetectionTest[];
}

export default function DetectionTestResults({ tests }: DetectionTestResultsProps) {
  if (!tests || tests.length === 0) {
    return null;
  }

  const validTests = tests.filter(test => test.status !== "error");
  const passedTests = validTests.filter(test => test.status === "passed");
  const passRate = validTests.length > 0 ? Math.round((passedTests.length / validTests.length) * 100) : 0;
  const averageHumanScore = validTests.length > 0 
    ? Math.round(validTests.reduce((sum, test) => sum + test.humanScore, 0) / validTests.length)
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case "error":
        return <AlertCircleIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "error":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheckIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          AI Detection Test Results
        </h3>
      </div>

      {/* Overall Summary */}
      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
            Overall Detection Status
          </span>
          <Badge 
            variant="outline" 
            className={passRate >= 80 ? "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-300" : 
                       passRate >= 60 ? "border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300" :
                       "border-red-500 text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300"}
          >
            {passRate >= 80 ? "UNDETECTABLE" : passRate >= 60 ? "MOSTLY SAFE" : "NEEDS IMPROVEMENT"}
          </Badge>
        </div>
        <div className="text-xs text-purple-700 dark:text-purple-300">
          <strong>{passedTests.length}</strong> of <strong>{validTests.length}</strong> detectors fooled 
          • <strong>{averageHumanScore}%</strong> average human score
        </div>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-2">
        {tests.map((test, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(test.status)}
                <span className="text-sm font-medium">{test.detectorName}</span>
              </div>
              {test.status !== "error" && (
                <div className="text-xs font-mono">
                  {test.humanScore}% Human • {test.aiScore}% AI
                </div>
              )}
            </div>
            <div className="text-xs opacity-75">
              {test.confidence}
            </div>
          </div>
        ))}
      </div>

      {/* Tips for improvement */}
      {passRate < 80 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-blue-800 dark:text-blue-300">
            <strong>💡 Tip:</strong> For better results, try using the "Optimize for Stealth" button with DeepSeek V3 model and extensive paraphrasing.
          </div>
        </div>
      )}
    </div>
  );
}