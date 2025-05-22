import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import SynonymPanel from "./SynonymPanel";

interface InteractiveTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function InteractiveTextArea({
  value,
  onChange,
  placeholder,
  className,
  disabled
}: InteractiveTextAreaProps) {
  const [selectedWord, setSelectedWord] = useState("");
  const [synonymPanelPosition, setSynonymPanelPosition] = useState<{ x: number; y: number } | null>(null);
  const [showSynonymPanel, setShowSynonymPanel] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextClick = useCallback((event: React.MouseEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    
    const textarea = event.currentTarget;
    const rect = textarea.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Get the position within the textarea
    const textPosition = textarea.selectionStart;
    const text = textarea.value;
    
    // Find the word at the clicked position
    let wordStart = textPosition;
    let wordEnd = textPosition;
    
    // Find the start of the word
    while (wordStart > 0 && /\w/.test(text[wordStart - 1])) {
      wordStart--;
    }
    
    // Find the end of the word
    while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
      wordEnd++;
    }
    
    const word = text.slice(wordStart, wordEnd).trim();
    
    if (word && word.length > 2) {
      setSelectedWord(word);
      setSynonymPanelPosition({ x: clickX, y: clickY });
      setShowSynonymPanel(true);
      
      // Highlight the selected word
      textarea.setSelectionRange(wordStart, wordEnd);
    }
  }, [disabled]);

  const handleReplaceWord = useCallback((originalWord: string, newWord: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    
    // Replace the selected word
    const beforeSelection = value.substring(0, selectionStart);
    const afterSelection = value.substring(selectionEnd);
    const newValue = beforeSelection + newWord + afterSelection;
    
    onChange(newValue);
    
    // Set cursor position after the replaced word
    setTimeout(() => {
      if (textarea) {
        const newCursorPosition = selectionStart + newWord.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }
    }, 0);
  }, [value, onChange]);

  const handleCloseSynonymPanel = useCallback(() => {
    setShowSynonymPanel(false);
    setSynonymPanelPosition(null);
    setSelectedWord("");
  }, []);

  // Close panel when clicking outside
  const handleTextareaBlur = useCallback((event: React.FocusEvent) => {
    // Small delay to allow clicking on synonym panel
    setTimeout(() => {
      if (!document.activeElement?.closest('[role="synonym-panel"]')) {
        handleCloseSynonymPanel();
      }
    }, 150);
  }, [handleCloseSynonymPanel]);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleTextClick}
        onBlur={handleTextareaBlur}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        style={{ caretColor: 'auto' }}
      />
      
      <SynonymPanel
        selectedWord={selectedWord}
        position={synonymPanelPosition}
        onClose={handleCloseSynonymPanel}
        onReplaceWord={handleReplaceWord}
        isVisible={showSynonymPanel}
      />
      
      {!disabled && (
        <div className="absolute bottom-2 right-2 opacity-60 pointer-events-none">
          <span className="text-xs text-purple-600 dark:text-purple-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded">
            💡 Click words for synonyms
          </span>
        </div>
      )}
    </div>
  );
}