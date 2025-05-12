import { ShieldCheckIcon, Fingerprint } from "lucide-react";

export default function FeatureHighlights() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
            <ShieldCheckIcon className="h-5 w-5 text-blue-700" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-blue-900">Bypass AI Detection</h3>
            <p className="mt-1 text-sm text-blue-700">Text is processed to avoid being flagged by AI detection tools.</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-gradient-to-r from-green-50 to-teal-50 p-4 border border-green-100">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
            <Fingerprint className="h-5 w-5 text-green-700" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-green-900">Human-Like Style</h3>
            <p className="mt-1 text-sm text-green-700">Natural phrasing and subtle imperfections that feel authentic.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
