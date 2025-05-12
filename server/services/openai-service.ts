import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { calculateReadingTime, countWords } from "../../client/src/lib/utils";
import axios from "axios";

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Helper function for fallback text transformation
function getSimpleTransformation(inputText: string): string {
  // For very short input
  if (inputText.length < 50) {
    return `The key point seems to be about ${inputText.toLowerCase()} — which I find to be a fascinating topic worth exploring further. There are several angles to consider when thinking about this.`;
  }
  
  // For regular text, create something obviously different
  const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    // Take just some sentences and modify them
    let result = "";
    const selectedSentences = sentences.slice(0, Math.min(5, sentences.length));
    
    for (const sentence of selectedSentences) {
      // Add some filler text
      result += `I believe that ${sentence.trim().toLowerCase()}. `;
    }
    
    // Add some commentary
    result += `This is a complex topic with various perspectives to consider. `;
    return result;
  }
  
  // Fallback for other cases
  return `After analyzing this information, I'd summarize it as follows: ${inputText} This presents several interesting implications for further consideration.`;
}

// Main function to humanize text using DeepSeek API
export async function humanizeText(request: HumanizeRequest): Promise<HumanizeResponse> {
  try {
    const { text, style, emotion, bypassAiDetection, improveGrammar, preserveKeyPoints } = request;
    
    // Simple validation
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
    
    // Build the prompt based on user preferences
    let systemPrompt = `You are an expert at making AI-generated text sound more human-like and natural. 
Your goal is to transform the following text to sound like it was written by a human.

For writing style, use a ${style} tone.
For emotional tone, make the text sound ${emotion}.

${bypassAiDetection ? 'Importantly, modify the text to bypass AI detection tools by introducing natural human-like patterns, subtle imperfections, and varying sentence structures.' : ''}
${improveGrammar ? 'Improve grammar and readability while maintaining a natural human voice.' : ''}
${preserveKeyPoints ? 'Preserve all key points and arguments from the original text.' : ''}

Follow these specific guidelines to make the text more human-like:
1. Vary sentence lengths and structures
2. Use more transitional phrases and personal pronouns
3. Include occasional informal language elements where appropriate
4. Add natural thought progression markers like "however," "actually," or "I think"
5. Incorporate rhetorical questions occasionally
6. Introduce minor grammatical nuances that humans typically make
7. Replace complex words with simpler alternatives when possible
8. Add occasional hedging language like "probably," "seems like," "I believe"
9. Restructure ideas in a more human-like flow of thought
10. Insert occasional parenthetical asides or brief digressions

Analyze the content and rewrite it while maintaining the core message and intent.`;
    
    try {
      // Call DeepSeek API
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
          }
        }
      );
      
      // Extract the humanized text from the response
      const humanizedText = response.data.choices[0].message.content || "";
      
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
    } catch (apiError) {
      console.error("DeepSeek API error:", apiError);
      
      // Fallback to our simplified transformation in case of API errors
      console.log("Using fallback transformation due to API error");
      
      // Create fallback humanized text
      let humanizedText = "";
      
      // Common intro based on writing style
      const styleIntros = {
        casual: "So here's what I think... ",
        formal: "Upon consideration, the following can be stated: ",
        academic: "Research and analysis suggest the following interpretation: ",
        creative: "Imagine, if you will, a perspective where: ",
        technical: "Technical assessment yields the following observations: ",
        conversational: "Let's chat about this for a sec. "
      };
      
      // Common conclusion based on emotion
      const emotionConclusions = {
        neutral: "That's my objective assessment of the matter.",
        positive: "Overall, I'm quite optimistic about these points!",
        critical: "We should, however, carefully examine these claims before proceeding."
      };
      
      // Add intro based on style
      humanizedText += styleIntros[style] || "Here's my take: ";
      
      // Add transformed content
      humanizedText += getSimpleTransformation(text);
      
      // Add conclusion based on emotion
      humanizedText += " " + (emotionConclusions[emotion] || "That's my take on it.");
      
      // Add AI detection bypass elements if requested
      if (bypassAiDetection) {
        humanizedText += " I'm not entirely sure about all of this, but it's what makes sense to me based on what I've learned and experienced.";
      }
    
      // Calculate stats for fallback response
      const wordCount = countWords(humanizedText);
      const readingTime = calculateReadingTime(humanizedText);
      
      // Return the fallback response
      return {
        text: humanizedText,
        stats: {
          wordCount,
          readingTime,
          aiDetectionRisk: "Medium" // Default for fallback
        }
      };
    }
  } catch (error) {
    console.error("Error in humanizeText:", error);
    throw new Error("Failed to process text with DeepSeek API");
  }
    
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

// This function applies basic transformation to the text to make it obviously different
function applyBasicTransformation(text: string): string {
  // Split into sentences
  const sentences = text.split(". ");
  
  // Process and rearrange sentences
  let result = "";
  
  // If only one short sentence, expand it
  if (sentences.length <= 1 && text.length < 100) {
    return `${text} To expand on this point, I would say there are multiple ways to think about it. From one perspective, it makes complete sense. From another, one might need more context to fully assess the implications.`;
  }
  
  // For longer text, reword and rearrange
  if (sentences.length > 2) {
    // Add an introduction
    result += `Here's what I understand from this: `;
    
    // Add main content with slight rewording
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i].trim().length === 0) continue;
      
      // Skip some sentences
      if (i % 3 === 0 && i > 0) continue;
      
      // Reword others
      if (i % 2 === 0) {
        result += sentences[i] + ". ";
      } else {
        result += `I believe that ${sentences[i].toLowerCase()}. `;
      }
    }
    
    // Add a conclusion
    result += `That's my understanding of it, anyway.`;
  } else {
    // For shorter text
    result = `I would say that ${text.toLowerCase()} This, I think, captures the essence of what's being conveyed.`;
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
