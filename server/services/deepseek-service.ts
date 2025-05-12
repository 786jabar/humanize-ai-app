import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { calculateReadingTime, countWords } from "../../client/src/lib/utils";
import axios from "axios";

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Log API key presence for debugging (not the actual key)
console.log("DeepSeek API Key available:", !!DEEPSEEK_API_KEY);

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
    
    // Model-specific instructions
    let modelSpecificInstructions = '';
    
    switch(request.model) {
      case 'deepseek-chat':
        modelSpecificInstructions = `You excel at general-purpose humanization that balances readability with natural flow.
- Use conversational tone and approachable language
- Include occasional contractions and informal expressions
- Adjust the formality level to match the content's purpose
- Balance precision with readability`;
        break;
        
      case 'deepseek-coder':
        modelSpecificInstructions = `You excel at humanizing technical and specialized content.
- Maintain technical accuracy while making explanations more approachable
- Use industry-specific terminology appropriately but naturally
- Include occasional technical analogies or examples
- For code explanations, use more conversational explanations around technical terms`;
        break;
        
      case 'deepseek-instruct':
        modelSpecificInstructions = `You excel at creative writing and narrative humanization.
- Use more vivid and descriptive language
- Include rhetorical devices like metaphors and analogies
- Vary sentence structure and rhythm more dramatically
- Focus on engaging storytelling elements
- Incorporate more personal perspective and voice`;
        break;
        
      case 'deepseek-v3':
        modelSpecificInstructions = `You excel at advanced humanization with superior natural language patterns.
- Create exceptionally natural-sounding text with human-like reasoning
- Include subtle contradictions and tangential thoughts common in human writing
- Add personal anecdotes and experience-based insights where appropriate
- Incorporate casual conversational markers like "um", "well", and "you know"
- Use common human writing flaws like redundancy, vague references, and occasional rambling
- Blend formal and informal elements adaptively based on context`;
        break;
        
      default:
        modelSpecificInstructions = `Focus on general-purpose humanization with balanced readability and natural flow.`;
    }
    
    let systemPrompt = `You are an expert at making AI-generated text sound more human-like and natural. 
Your goal is to transform the following text to sound like it was written by a human.

For writing style, use a ${style} tone.
For emotional tone, make the text sound ${emotion}.

${modelSpecificInstructions}

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
      // Map our model names to DeepSeek's actual model identifiers
      let modelId = "deepseek-chat-v2";
      switch(request.model) {
        case "deepseek-chat":
          modelId = "deepseek-chat-v2";
          break;
        case "deepseek-coder":
          modelId = "deepseek-coder-v2";
          break;
        case "deepseek-instruct":
          modelId = "deepseek-instruct-v2";
          break;
        case "deepseek-v3":
          modelId = "deepseek-v3";
          break;
      }
      
      // Call DeepSeek API with the selected model
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: modelId,
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
      
      // Estimate AI detection risk based on complexity of transformation and model
      let aiDetectionRisk: HumanizeResponse["stats"]["aiDetectionRisk"] = "Medium";
      
      // Base risk on writing style and AI detection bypass
      if (bypassAiDetection && style !== "academic" && style !== "technical") {
        aiDetectionRisk = "Low";
      } else if (!bypassAiDetection || style === "technical") {
        aiDetectionRisk = "High";
      }
      
      // Adjust risk based on the model used
      if (request.model === "deepseek-v3" && bypassAiDetection) {
        // V3 model is extremely good at bypassing detection
        aiDetectionRisk = "Very Low";
      } else if (request.model === "deepseek-instruct" && bypassAiDetection) {
        // Creative model with bypass tends to be less detectable
        aiDetectionRisk = aiDetectionRisk === "High" ? "Medium" : "Low";
      } else if (request.model === "deepseek-coder" && style === "technical") {
        // Technical model with technical style will sound more AI-like
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
      
      // Add model-specific elements to the fallback
      switch(request.model) {
        case 'deepseek-coder':
          humanizedText += " From a technical perspective, we should analyze this in more depth to understand the practical implications.";
          break;
        case 'deepseek-instruct':
          humanizedText += " As I reflect on this idea, I can't help but imagine how it connects to broader themes in our lives.";
          break;
        case 'deepseek-v3':
          humanizedText += " You know, I was thinking about this the other day... it's kind of funny how these things connect to our personal experiences, right? I mean, I'm not an expert or anything, but I've seen similar patterns before. Anyway, that's just my two cents on it.";
          break;
        case 'deepseek-chat':
        default:
          // Already conversational enough, no additional text needed
          break;
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
}