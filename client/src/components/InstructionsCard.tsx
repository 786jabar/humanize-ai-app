import { XIcon, LightbulbIcon } from "lucide-react";

interface InstructionsCardProps {
  onClose: () => void;
}

export default function InstructionsCard({ onClose }: InstructionsCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <LightbulbIcon className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">How it works</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>1. Paste your AI-generated text in the input area</p>
            <p>2. Select your preferred writing style and tone</p>
            <p>3. Click "Humanize" to transform your content</p>
            <p>4. Copy your human-sounding text from the output area</p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 text-blue-500 hover:bg-blue-100"
              onClick={onClose}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
