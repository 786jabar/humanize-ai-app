import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { calculateReadingTime, countWords } from "../../client/src/lib/utils";

// Demo version for testing UI - simulates the humanizing process
export async function humanizeText(request: HumanizeRequest): Promise<HumanizeResponse> {
  try {
    const { text, style, emotion, bypassAiDetection, improveGrammar, preserveKeyPoints } = request;
    
    // Introduce a slight delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would call the OpenAI API
    // For now, we'll do some basic transformations to show the concept
    
    // Check if input text is too short or empty
    if (!text || text.trim().length < 10) {
      return {
        text: "Please provide a longer text input (at least 10 characters) for proper humanization.",
        stats: {
          wordCount: 0,
          readingTime: 0,
          aiDetectionRisk: "Medium"
        }
      };
    }
    
    // Simple text transformation based on selected options
    let humanizedText = text;
    
    // Add style-specific modifications
    if (style === "casual") {
      humanizedText = addCasualElements(humanizedText);
    } else if (style === "formal") {
      humanizedText = addFormalElements(humanizedText);
    } else if (style === "academic") {
      humanizedText = addAcademicElements(humanizedText);
    } else if (style === "creative") {
      humanizedText = addCreativeElements(humanizedText);
    } else if (style === "technical") {
      humanizedText = addTechnicalElements(humanizedText);
    } else if (style === "conversational") {
      humanizedText = addConversationalElements(humanizedText);
    }
    
    // Add emotion-specific modifications
    if (emotion === "positive") {
      humanizedText = addPositiveElements(humanizedText);
    } else if (emotion === "critical") {
      humanizedText = addCriticalElements(humanizedText);
    }
    
    // If bypassing AI detection is enabled, add more human-like elements
    if (bypassAiDetection) {
      humanizedText = addHumanElements(humanizedText);
    }
    
    // Calculate stats
    const wordCount = countWords(humanizedText);
    const readingTime = calculateReadingTime(humanizedText);
    
    // Estimate AI detection risk based on complexity of transformation
    let aiDetectionRisk: HumanizeResponse["stats"]["aiDetectionRisk"] = "Medium";
    
    if (bypassAiDetection && style !== "academic" && style !== "technical") {
      aiDetectionRisk = "Low";
    } else if (!bypassAiDetection || style === "technical") {
      aiDetectionRisk = "High";
    }

    return {
      text: humanizedText,
      stats: {
        wordCount,
        readingTime,
        aiDetectionRisk
      }
    };
  } catch (error) {
    console.error("Error in text processing:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process text");
  }
}

// Helper functions to transform text based on different styles and options

function addCasualElements(text: string): string {
  // Add some casual language markers
  const casualPhrases = [
    "I think",
    "you know",
    "anyway",
    "basically",
    "to be honest",
    "pretty much",
    "kind of",
    "sort of"
  ];
  
  let result = text;
  
  // Replace some periods with more casual punctuation
  result = result.replace(/\. /g, (match) => {
    const rand = Math.random();
    if (rand < 0.1) return "... ";
    if (rand < 0.2) return "! ";
    return match;
  });
  
  // Insert casual phrases occasionally
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomPhrase = casualPhrases[Math.floor(Math.random() * casualPhrases.length)];
    sentences[randomIndex] = `${randomPhrase}, ${sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1)}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addFormalElements(text: string): string {
  // Add some formal language markers
  const formalPhrases = [
    "It is important to note that",
    "To that end",
    "In this regard",
    "Consequently",
    "Furthermore",
    "Moreover",
    "Nevertheless"
  ];
  
  let result = text;
  
  // Insert formal connectors occasionally
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomPhrase = formalPhrases[Math.floor(Math.random() * formalPhrases.length)];
    sentences[randomIndex] = `${randomPhrase}, ${sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1)}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addAcademicElements(text: string): string {
  // Add some academic language markers
  const academicPhrases = [
    "Research indicates that",
    "It has been demonstrated that",
    "Studies suggest that",
    "The evidence supports",
    "According to the literature",
    "This analysis reveals"
  ];
  
  let result = text;
  
  // Insert academic phrases occasionally
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomPhrase = academicPhrases[Math.floor(Math.random() * academicPhrases.length)];
    sentences[randomIndex] = `${randomPhrase} ${sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1)}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addCreativeElements(text: string): string {
  // Add some creative language elements
  let result = text;
  
  // Add a metaphor somewhere in the text
  const metaphors = [
    "Like a river flowing to the sea,",
    "Similar to a tapestry of interwoven threads,",
    "As with the changing of seasons,",
    "Much like stars in the night sky,"
  ];
  
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomMetaphor = metaphors[Math.floor(Math.random() * metaphors.length)];
    sentences[randomIndex] = `${randomMetaphor} ${sentences[randomIndex]}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addTechnicalElements(text: string): string {
  // Add some technical language markers
  const technicalPhrases = [
    "The system architecture",
    "When implementing this approach",
    "The underlying mechanism",
    "From a technical perspective",
    "The data indicates"
  ];
  
  let result = text;
  
  // Insert technical phrases occasionally
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomPhrase = technicalPhrases[Math.floor(Math.random() * technicalPhrases.length)];
    sentences[randomIndex] = `${randomPhrase}, ${sentences[randomIndex]}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addConversationalElements(text: string): string {
  // Add some conversational elements
  let result = text;
  
  // Add rhetorical questions
  const questions = [
    "Isn't that interesting?",
    "Don't you think?",
    "Can you imagine that?",
    "Right?",
    "You know what I mean?"
  ];
  
  const sentences = result.split(". ");
  if (sentences.length > 4) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 3)) + 2;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    sentences[randomIndex] = `${sentences[randomIndex]}. ${randomQuestion}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addPositiveElements(text: string): string {
  // Add positive emotional elements
  const positivePhrases = [
    "I'm really excited about this",
    "This is a fantastic opportunity",
    "I'm optimistic that",
    "The great thing is",
    "I'm happy to report that"
  ];
  
  let result = text;
  
  // Insert positive phrases occasionally
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomPhrase = positivePhrases[Math.floor(Math.random() * positivePhrases.length)];
    sentences[randomIndex] = `${randomPhrase}, ${sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1)}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addCriticalElements(text: string): string {
  // Add more critical/analytical elements
  const criticalPhrases = [
    "However, it's important to consider",
    "We need to be careful about",
    "A critical analysis reveals",
    "The challenge here is",
    "One could question whether"
  ];
  
  let result = text;
  
  // Insert critical phrases occasionally
  const sentences = result.split(". ");
  if (sentences.length > 3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
    const randomPhrase = criticalPhrases[Math.floor(Math.random() * criticalPhrases.length)];
    sentences[randomIndex] = `${randomPhrase} ${sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1)}`;
    result = sentences.join(". ");
  }
  
  return result;
}

function addHumanElements(text: string): string {
  // Add human-like imperfections and patterns
  let result = text;
  
  // Add parenthetical thoughts
  const parentheticals = [
    "(at least that's what I think)",
    "(though I could be wrong about this)",
    "(if I remember correctly)",
    "(it's been a while since I checked this)",
    "(this is just based on my experience)"
  ];
  
  const sentences = result.split(". ");
  if (sentences.length > 5) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 2;
    const randomParenthetical = parentheticals[Math.floor(Math.random() * parentheticals.length)];
    sentences[randomIndex] = `${sentences[randomIndex]} ${randomParenthetical}`;
    result = sentences.join(". ");
  }
  
  // Add hedge words
  result = result.replace(/\. /g, (match) => {
    const rand = Math.random();
    if (rand < 0.05) return ". I think ";
    if (rand < 0.1) return ". Probably ";
    if (rand < 0.15) return ". Maybe ";
    return match;
  });
  
  // Add fallback content for short inputs
  if (result.split(" ").length < 10) {
    result += " I've thought about this quite a bit and would add that there are several other perspectives to consider here as well. While every situation is unique, I find that approaching this with an open mind helps tremendously.";
  }
  
  return result;
}
