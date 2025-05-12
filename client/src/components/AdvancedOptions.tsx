import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  toggleAdvanced: () => void;
  bypassAiDetection: boolean;
  setBypassAiDetection: (value: boolean) => void;
  improveGrammar: boolean;
  setImproveGrammar: (value: boolean) => void;
  preserveKeyPoints: boolean;
  setPreserveKeyPoints: (value: boolean) => void;
}

export default function AdvancedOptions({
  showAdvanced,
  toggleAdvanced,
  bypassAiDetection,
  setBypassAiDetection,
  improveGrammar,
  setImproveGrammar,
  preserveKeyPoints,
  setPreserveKeyPoints
}: AdvancedOptionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="block text-sm font-medium text-gray-700">Advanced Options</Label>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary-800 text-sm font-medium"
          onClick={toggleAdvanced}
        >
          {showAdvanced ? "Hide options" : "Show options"}
        </Button>
      </div>
      
      {showAdvanced && (
        <div className="mt-3 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ai-detection-bypass" 
              checked={bypassAiDetection}
              onCheckedChange={(checked) => setBypassAiDetection(checked as boolean)}
            />
            <Label 
              htmlFor="ai-detection-bypass" 
              className="text-sm text-gray-700"
            >
              Optimize for AI detection bypass
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="grammar-improvement" 
              checked={improveGrammar}
              onCheckedChange={(checked) => setImproveGrammar(checked as boolean)}
            />
            <Label 
              htmlFor="grammar-improvement" 
              className="text-sm text-gray-700"
            >
              Improve grammar and readability
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="preserve-key-points" 
              checked={preserveKeyPoints}
              onCheckedChange={(checked) => setPreserveKeyPoints(checked as boolean)}
            />
            <Label 
              htmlFor="preserve-key-points" 
              className="text-sm text-gray-700"
            >
              Preserve key points and arguments
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
