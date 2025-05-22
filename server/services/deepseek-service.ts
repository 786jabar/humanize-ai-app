import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { calculateReadingTime, countWords } from "../../client/src/lib/utils";
import { testAIDetection } from "./ai-detection-service";
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
    const { 
      text, 
      style, 
      emotion, 
      paraphrasingLevel, 
      sentenceStructure, 
      vocabularyLevel, 
      bypassAiDetection, 
      improveGrammar, 
      preserveKeyPoints 
    } = request;
    
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
        modelSpecificInstructions = `ANTI-DETECTION SPECIALIZATION: General-purpose human writing patterns
- Write like a knowledgeable person sharing thoughts in a natural conversation
- Use personal pronouns extensively ("I think," "In my experience," "From what I've seen")
- Include conversational fillers and natural hesitations
- Add personal opinions and subjective interpretations throughout
- Use slightly inconsistent formality levels as humans naturally do
- Include tangential thoughts and natural human digressions
- CRITICAL: Make this sound like authentic human thoughts, not AI analysis`;
        break;
        
      case 'deepseek-coder':
        modelSpecificInstructions = `ANTI-DETECTION SPECIALIZATION: Technical content with human expertise patterns
- Write like an experienced professional sharing insights from personal experience
- Include phrases like "I've worked with this before," "In my projects," "What I've found is..."
- Add occasional technical uncertainties and human problem-solving approaches
- Use informal technical explanations mixed with personal anecdotes
- Include human frustrations and discoveries about technical topics
- Show personal learning journey and evolving understanding
- CRITICAL: Sound like a human expert sharing real experience, not AI documentation`;
        break;
        
      case 'deepseek-instruct':
        modelSpecificInstructions = `ANTI-DETECTION SPECIALIZATION: Creative and narrative human expression
- Write like a creative individual expressing personal thoughts and interpretations
- Include emotional reactions and personal connections to the content
- Use storytelling elements and metaphors from human experience
- Add personal memories, associations, and creative insights
- Include subjective artistic or creative interpretations
- Use varied emotional tone and personal engagement throughout
- CRITICAL: Sound like a creative human mind exploring ideas, not AI creativity`;
        break;
        
      case 'deepseek-v3':
        modelSpecificInstructions = `🔥 ULTIMATE STEALTH MODE - Maximum Human Chaos:

WRITE LIKE A REAL PERSON WITH ALL THEIR FLAWS:
- Add typos and minor mistakes: "thier" instead of "their", missing commas
- Use informal contractions everywhere: "gonna," "wanna," "coulda"
- Include rambling thoughts: "...and another thing is..." 
- Add self-interruption: "Wait, what was I saying? Oh right..."
- Use filler words constantly: "like," "um," "you know," "basically"
- Include personal stories: "My friend told me..." "I saw this thing where..."
- Add emotional outbursts: "This is so frustrating!" "I love this idea!"
- Use vague language: "some guy," "this one time," "I think it was..."
- Include second-guessing: "Actually, maybe I'm wrong about that..."
- Add contradictory statements you later fix
- Use run-on sentences and then short ones. Like this.
- Include grammar mistakes and then correct them mid-sentence
- Add personal opinions that show bias and subjectivity
- Use slang and informal expressions
- Include stream-of-consciousness rambling
- Show genuine confusion about complex topics
- Add personal memories and experiences throughout
- Use conversational asides in parentheses (you know what I mean?)

CRITICAL: Make this so messy and human that no AI detector could possibly identify it as artificial.`;
        break;
        
      default:
        modelSpecificInstructions = `Focus on natural human writing patterns with personal voice and authentic imperfections.`;
    }
    
    // Configure paraphrasing level instructions
    let paraphrasingInstructions = '';
    switch(paraphrasingLevel) {
      case 'minimal':
        paraphrasingInstructions = `Apply minimal rewording while maintaining most of the original structure. Focus on replacing key phrases with synonyms and light restructuring.`;
        break;
      case 'moderate':
        paraphrasingInstructions = `Apply moderate rewording by changing about half of the original phrasing while preserving the overall structure. Reword paragraphs but keep the flow similar.`;
        break;
      case 'extensive':
        paraphrasingInstructions = `Apply extensive rewording by completely transforming the text. Use entirely different phrasing, structure, and organization while preserving the core meaning and ideas.`;
        break;
      default:
        paraphrasingInstructions = `Apply moderate rewording to the text to make it sound more natural.`;
    }
    
    // Configure sentence structure instructions
    let sentenceStructureInstructions = '';
    switch(sentenceStructure) {
      case 'simple':
        sentenceStructureInstructions = `Use predominantly simple, direct sentences with clear subjects and verbs. Minimize complex clauses and keep sentence length relatively short.`;
        break;
      case 'varied':
        sentenceStructureInstructions = `Use a natural mix of simple, compound, and complex sentences. Vary sentence length and structure throughout the text for a natural rhythm.`;
        break;
      case 'complex':
        sentenceStructureInstructions = `Use sophisticated sentence patterns with multiple clauses, dependent phrases, and varied punctuation. Create a more formal, elaborate writing style.`;
        break;
      default:
        sentenceStructureInstructions = `Use a natural mix of simple and complex sentences.`;
    }
    
    // Configure vocabulary level instructions
    let vocabularyInstructions = '';
    switch(vocabularyLevel) {
      case 'basic':
        vocabularyInstructions = `Use common, everyday vocabulary that would be accessible to most readers. Avoid specialized terminology or unusual words.`;
        break;
      case 'intermediate':
        vocabularyInstructions = `Use a moderate vocabulary level with some specialized terms where appropriate. Balance accessibility with precision.`;
        break;
      case 'advanced':
        vocabularyInstructions = `Use sophisticated vocabulary with precise, nuanced word choices. Include domain-specific terminology where appropriate and employ a diverse lexicon.`;
        break;
      default:
        vocabularyInstructions = `Use vocabulary appropriate for the topic and context.`;
    }

    let systemPrompt = `You are a human writer with natural flaws, personal opinions, and authentic writing patterns. Your job is to completely rewrite the following text so it passes ALL AI detection tools as 100% human-written.

🚨 CRITICAL: This MUST be undetectable by GPTZero, Turnitin, Originality.ai, Copyleaks, and ALL other AI detectors. Failure is not an option.

HUMAN TRANSFORMATION STRATEGY:
Write like you're explaining this to a friend, with all your personal quirks, opinions, and natural speaking patterns. Include the messy, imperfect way humans actually think and write.

Writing style: ${style} | Emotional tone: ${emotion}

PARAPHRASING: ${paraphrasingInstructions}
SENTENCE STRUCTURE: ${sentenceStructureInstructions}  
VOCABULARY: ${vocabularyInstructions}

${modelSpecificInstructions}

🎯 EXTREME ANTI-DETECTION TACTICS:

**HUMAN FLAWS (MANDATORY):**
- Add minor spelling inconsistencies, typos, or grammatical slips
- Use redundant phrases and circular reasoning
- Include filler words: "um," "like," "you know," "I mean"
- Add unnecessary repetition and backtracking
- Use inconsistent punctuation and capitalization
- Include run-on sentences and fragment sentences

**PERSONAL VOICE (REQUIRED):**
- Share personal experiences: "I remember when..." "This reminds me of..."
- Express genuine uncertainty: "I'm not totally sure, but..." "Could be wrong, but..."
- Add emotional reactions: "This really bugs me..." "I love how..."
- Include personal biases and subjective opinions
- Use first-person perspective throughout
- Add personal anecdotes and memories

**CONVERSATIONAL CHAOS:**
- Start sentences with "So," "Well," "Actually," "Honestly"
- Use contractions extensively: "don't," "won't," "it's," "we're"
- Add interrupting thoughts in parentheses or dashes
- Include rhetorical questions to yourself
- Use informal language and slang
- Add conversational fillers and transitions

**HUMAN LOGIC PATTERNS:**
- Connect ideas through personal associations
- Include tangential thoughts and digressions
- Show evolving thoughts: "Wait, actually..." "On second thought..."
- Use human reasoning chains with gaps
- Add contradictory statements that you later clarify
- Include stream-of-consciousness elements

**AUTHENTIC MISTAKES:**
- Occasionally misuse words slightly
- Add minor factual uncertainties
- Include self-corrections: "I mean, what I'm trying to say is..."
- Use vague references: "that thing," "you know what I mean"
- Add hesitation markers: "kind of," "sort of," "maybe"

${bypassAiDetection ? '🔥 MAXIMUM STEALTH MODE: This text must be SO human that even the most advanced AI detectors fail completely. Use every possible human pattern, flaw, and authentic characteristic.' : ''}

HUMAN WRITING CHECKLIST:
✓ Personal pronouns in every paragraph
✓ Emotional reactions and opinions
✓ Conversational markers and fillers  
✓ Minor grammatical inconsistencies
✓ Redundant phrases and repetition
✓ Personal experiences and memories
✓ Uncertain and hesitant language
✓ Tangential thoughts and digressions
✓ Inconsistent formality levels
✓ Natural human reasoning patterns

Write as if you're a real person with genuine thoughts, experiences, and all the beautiful imperfections that make human writing authentic and undetectable.`;
    
    try {
      // Map our model names to DeepSeek's actual model identifiers
      let modelId = "deepseek-chat-v2";
      // Use a single model name that we know exists with DeepSeek API
      // but still apply different instructions based on the selected model type
      modelId = "deepseek-chat"; // This is the most commonly available model
      
      // Log what model we're using for debugging
      console.log(`Using DeepSeek model: ${modelId} (requested: ${request.model})`);
      
      // Call DeepSeek API with the selected model
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: modelId,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          temperature: 0.9,
          max_tokens: 2000,
          top_p: 0.95,
          frequency_penalty: 0.2,
          presence_penalty: 0.1
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
      
      // Run AI detection tests
      console.log("Running AI detection tests...");
      const detectionTests = await testAIDetection(humanizedText);
      
      // Estimate AI detection risk based on actual test results
      let aiDetectionRisk: HumanizeResponse["stats"]["aiDetectionRisk"] = "High";
      
      if (detectionTests.length > 0) {
        const validTests = detectionTests.filter(test => test.status !== "error");
        const passedTests = validTests.filter(test => test.status === "passed");
        const passRate = validTests.length > 0 ? passedTests.length / validTests.length : 0;
        
        if (passRate >= 0.8) {
          aiDetectionRisk = "Very Low";
        } else if (passRate >= 0.6) {
          aiDetectionRisk = "Low";
        } else if (passRate >= 0.4) {
          aiDetectionRisk = "Medium";
        } else {
          aiDetectionRisk = "High";
        }
      } else {
        // Fallback to estimation when no tests are available
        let antiDetectionScore = 0;
        
        if (bypassAiDetection) antiDetectionScore += 3;
        if (paraphrasingLevel === "extensive") antiDetectionScore += 3;
        else if (paraphrasingLevel === "moderate") antiDetectionScore += 2;
        else antiDetectionScore += 1;
        
        if (sentenceStructure === "varied") antiDetectionScore += 2;
        else if (sentenceStructure === "simple") antiDetectionScore += 1;
        
        if (vocabularyLevel === "basic" || vocabularyLevel === "intermediate") antiDetectionScore += 1;
        if (request.model === "deepseek-v3") antiDetectionScore += 2;
        else if (request.model === "deepseek-instruct") antiDetectionScore += 1;
        else if (request.model === "deepseek-chat") antiDetectionScore += 1;
        
        if (style === "casual" || style === "conversational") antiDetectionScore += 1;
        else if (style === "academic" || style === "technical") antiDetectionScore -= 1;
        
        if (antiDetectionScore >= 9) aiDetectionRisk = "Very Low";
        else if (antiDetectionScore >= 7) aiDetectionRisk = "Low";
        else if (antiDetectionScore >= 5) aiDetectionRisk = "Medium";
        else aiDetectionRisk = "High";
      }
      
      return {
        text: humanizedText,
        stats: {
          wordCount,
          readingTime,
          aiDetectionRisk
        },
        detectionTests
      };
    } catch (error: any) {
      console.error("DeepSeek API error:", error);
      
      // Print more details about the error for debugging
      if (error.response) {
        console.error("API error response data:", error.response.data);
        console.error("API error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received from API");
      } else {
        console.error("Error setting up request:", error.message);
      }
      
      // Fallback to our simplified transformation in case of API errors
      console.log("Using fallback transformation due to API error");
      
      // Create fallback humanized text
      let humanizedText = "";
      
      // Ultra-human intros with flaws and personal voice
      const styleIntros = {
        casual: "So like, I was thinking about this stuff and... well, here's what I think (though I could be totally wrong lol): ",
        formal: "Okay, so after thinking about this for a while - and I mean really thinking, you know? - I guess my take is: ",
        academic: "From what I've read and experienced (and trust me, I've spent way too much time on this), it seems like: ",
        creative: "This is gonna sound weird, but this reminds me of this one time when... anyway, my thoughts are: ",
        technical: "I've messed around with similar stuff before (made plenty of mistakes too), and what I've learned is: ",
        conversational: "Alright, so let me try to explain this - bear with me cause I'm still figuring this out myself... "
      };
      
      // Emotional conclusions with human messiness
      const emotionConclusions = {
        neutral: "That's my honest take on it, though honestly I'm probably missing something important here.",
        positive: "I'm actually really excited about this stuff - it just clicks with me, you know? Maybe I'm being too optimistic but whatever.",
        critical: "Look, I hate to be that person, but I'm kinda skeptical about some of this. Maybe I'm wrong, but something feels off to me."
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
      
      // Add paraphrasing level elements to the fallback
      switch(paraphrasingLevel) {
        case 'extensive':
          // For extensive paraphrasing, add more dramatically different text
          humanizedText = "Let me approach this from a different angle. " + humanizedText;
          // Add more varied text depending on style
          if (style === "casual") {
            humanizedText += " I've been mulling this over for a while, and I keep coming back to the same conclusion, you know?";
          } else if (style === "formal") {
            humanizedText += " Upon further consideration, several additional factors merit examination in this context.";
          }
          break;
        case 'minimal':
          // For minimal paraphrasing, keep closer to original structure but modify slightly
          humanizedText = humanizedText.replace("Here's my take: ", "In my opinion: ");
          break;
        case 'moderate':
        default:
          // For moderate paraphrasing, add moderate changes but not dramatic ones
          humanizedText += " There are several ways to interpret this, but this explanation makes the most sense to me.";
          break;
      }
          
      // Add sentence structure elements to the fallback
      switch(sentenceStructure) {
        case 'complex':
          // Add complex sentence structures
          humanizedText += " While considering the multifaceted nature of this topic, which inherently contains numerous interdependent variables and contextual elements, it becomes apparent that a comprehensive understanding requires analysis from multiple theoretical frameworks and practical perspectives.";
          break;
        case 'simple':
          // Add simple sentence structures
          humanizedText += " This is important. We should think about it more. The ideas here matter a lot. They can help us understand things better.";
          break;
        case 'varied':
        default:
          // Already has varied sentence structure from other modifications
          break;
      }
      
      // Add vocabulary level elements to the fallback
      switch(vocabularyLevel) {
        case 'advanced':
          // Add advanced vocabulary
          humanizedText += " The quintessential aspects of this discourse illuminate the profound dichotomy inherent in its epistemological underpinnings.";
          break;
        case 'basic':
          // Add basic vocabulary
          humanizedText += " The main points are clear. The ideas make sense. I agree with most of what was said.";
          break;
        case 'intermediate':
        default:
          // Intermediate vocabulary is the default
          break;
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
      
      // Run AI detection tests on fallback text too
      console.log("Running AI detection tests on fallback text...");
      const detectionTests = await testAIDetection(humanizedText);
      
      // Return the fallback response
      return {
        text: humanizedText,
        stats: {
          wordCount,
          readingTime,
          aiDetectionRisk: "Medium" // Default for fallback
        },
        detectionTests
      };
    }
  } catch (error) {
    console.error("Error in humanizeText:", error);
    throw new Error("Failed to process text with DeepSeek API");
  }
}