import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RefreshCw, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SynonymSuggestion {
  word: string;
  definition: string;
  partOfSpeech: string;
  intensity: "weaker" | "similar" | "stronger";
  formality: "casual" | "neutral" | "formal";
}

interface SynonymPanelProps {
  selectedWord: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onReplaceWord: (originalWord: string, newWord: string) => void;
  isVisible: boolean;
}

export default function SynonymPanel({
  selectedWord,
  position,
  onClose,
  onReplaceWord,
  isVisible
}: SynonymPanelProps) {
  const [synonyms, setSynonyms] = useState<SynonymSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "formal" | "casual">("all");

  useEffect(() => {
    if (selectedWord && isVisible) {
      fetchSynonyms(selectedWord);
    }
  }, [selectedWord, isVisible]);

  const fetchSynonyms = async (word: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API like Merriam-Webster or WordsAPI
      // For now, we'll use a smart local suggestion system
      const suggestions = generateSmartSynonyms(word);
      setSynonyms(suggestions);
    } catch (error) {
      console.error("Error fetching synonyms:", error);
      setSynonyms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartSynonyms = (word: string): SynonymSuggestion[] => {
    // Smart synonym database - in production this would be from an API
    const synonymDatabase: Record<string, SynonymSuggestion[]> = {
      "good": [
        { word: "excellent", definition: "extremely good; outstanding", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "great", definition: "of an extent, amount, or intensity considerably above average", partOfSpeech: "adjective", intensity: "similar", formality: "casual" },
        { word: "superb", definition: "excellent; of very high quality", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "nice", definition: "pleasant; agreeable; satisfactory", partOfSpeech: "adjective", intensity: "weaker", formality: "casual" },
        { word: "outstanding", definition: "clearly noticeable; exceptionally good", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "awesome", definition: "extremely impressive or daunting", partOfSpeech: "adjective", intensity: "stronger", formality: "casual" }
      ],
      "bad": [
        { word: "terrible", definition: "extremely bad or serious", partOfSpeech: "adjective", intensity: "stronger", formality: "neutral" },
        { word: "awful", definition: "extremely bad or unpleasant", partOfSpeech: "adjective", intensity: "stronger", formality: "casual" },
        { word: "poor", definition: "of a low or inferior standard or quality", partOfSpeech: "adjective", intensity: "weaker", formality: "neutral" },
        { word: "dreadful", definition: "causing or involving great suffering, fear, or unhappiness", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "subpar", definition: "below an average level", partOfSpeech: "adjective", intensity: "weaker", formality: "formal" },
        { word: "lousy", definition: "very poor or bad", partOfSpeech: "adjective", intensity: "similar", formality: "casual" }
      ],
      "big": [
        { word: "enormous", definition: "very large in size, quantity, or extent", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "huge", definition: "extremely large; enormous", partOfSpeech: "adjective", intensity: "stronger", formality: "casual" },
        { word: "large", definition: "of considerable or relatively great size", partOfSpeech: "adjective", intensity: "similar", formality: "neutral" },
        { word: "massive", definition: "large and heavy or solid", partOfSpeech: "adjective", intensity: "stronger", formality: "neutral" },
        { word: "gigantic", definition: "of very great size or extent", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "substantial", definition: "of considerable importance, size, or worth", partOfSpeech: "adjective", intensity: "similar", formality: "formal" }
      ],
      "small": [
        { word: "tiny", definition: "very small", partOfSpeech: "adjective", intensity: "stronger", formality: "casual" },
        { word: "minuscule", definition: "extremely small", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" },
        { word: "little", definition: "small in size, amount, or degree", partOfSpeech: "adjective", intensity: "weaker", formality: "casual" },
        { word: "compact", definition: "closely and neatly packed together", partOfSpeech: "adjective", intensity: "similar", formality: "neutral" },
        { word: "petite", definition: "small and dainty", partOfSpeech: "adjective", intensity: "similar", formality: "formal" },
        { word: "microscopic", definition: "so small as to be visible only with a microscope", partOfSpeech: "adjective", intensity: "stronger", formality: "formal" }
      ],
      "said": [
        { word: "stated", definition: "expressed something definitely or clearly", partOfSpeech: "verb", intensity: "similar", formality: "formal" },
        { word: "mentioned", definition: "referred to something briefly", partOfSpeech: "verb", intensity: "weaker", formality: "neutral" },
        { word: "declared", definition: "announced something clearly and firmly", partOfSpeech: "verb", intensity: "stronger", formality: "formal" },
        { word: "remarked", definition: "said something as a comment", partOfSpeech: "verb", intensity: "similar", formality: "neutral" },
        { word: "explained", definition: "made something clear by describing it", partOfSpeech: "verb", intensity: "stronger", formality: "neutral" },
        { word: "noted", definition: "observed or pointed out", partOfSpeech: "verb", intensity: "weaker", formality: "formal" }
      ],
      "think": [
        { word: "believe", definition: "accept that something is true", partOfSpeech: "verb", intensity: "similar", formality: "neutral" },
        { word: "consider", definition: "think carefully about something", partOfSpeech: "verb", intensity: "stronger", formality: "formal" },
        { word: "suppose", definition: "assume that something is the case", partOfSpeech: "verb", intensity: "weaker", formality: "neutral" },
        { word: "contemplate", definition: "look thoughtfully at something for a long time", partOfSpeech: "verb", intensity: "stronger", formality: "formal" },
        { word: "reckon", definition: "establish by calculation or be of the opinion", partOfSpeech: "verb", intensity: "similar", formality: "casual" },
        { word: "ponder", definition: "think about something carefully", partOfSpeech: "verb", intensity: "stronger", formality: "formal" }
      ]
    };

    return synonymDatabase[word.toLowerCase()] || [
      { word: "alternative", definition: "Available as another possibility", partOfSpeech: "noun", intensity: "similar", formality: "neutral" },
      { word: "substitute", definition: "A person or thing acting in place of another", partOfSpeech: "noun", intensity: "similar", formality: "formal" }
    ];
  };

  const filteredSynonyms = synonyms.filter(synonym => {
    if (selectedCategory === "all") return true;
    return synonym.formality === selectedCategory;
  });

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "weaker": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "stronger": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getFormalityIcon = (formality: string) => {
    switch (formality) {
      case "formal": return "🎩";
      case "casual": return "👕";
      default: return "⚖️";
    }
  };

  if (!isVisible || !position) return null;

  return (
    <div
      className="fixed z-50 w-80 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-xl shadow-2xl backdrop-blur-sm"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 400),
        transform: position.x > window.innerWidth - 320 ? 'translateX(-100%)' : 'none'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Synonyms for "{selectedWord}"
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "formal" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("formal")}
            className="text-xs"
          >
            🎩 Formal
          </Button>
          <Button
            variant={selectedCategory === "casual" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("casual")}
            className="text-xs"
          >
            👕 Casual
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Finding synonyms...</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredSynonyms.map((synonym, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors group"
                onClick={() => {
                  onReplaceWord(selectedWord, synonym.word);
                  onClose();
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                        {synonym.word}
                      </span>
                      <span className="text-xs">{getFormalityIcon(synonym.formality)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {synonym.definition}
                    </p>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {synonym.partOfSpeech}
                      </Badge>
                      <Badge className={cn("text-xs", getIntensityColor(synonym.intensity))}>
                        {synonym.intensity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredSynonyms.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No synonyms found for this word</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}