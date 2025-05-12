import { useState, useEffect } from "react";
import { calculateReadingTime, countWords } from "@/lib/utils";

export function useTextStats(text: string) {
  const [stats, setStats] = useState({
    characterCount: 0,
    wordCount: 0,
    readingTime: 0,
  });

  useEffect(() => {
    setStats({
      characterCount: text.length,
      wordCount: countWords(text),
      readingTime: calculateReadingTime(text),
    });
  }, [text]);

  return stats;
}
