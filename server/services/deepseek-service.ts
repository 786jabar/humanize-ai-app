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
      language,
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

    // Configure language-specific patterns
    let languageInstructions = '';
    let languageSpecificPhrases = '';
    
    if (language === 'uk-english') {
      languageInstructions = `Use British English spelling, vocabulary, and expressions throughout.`;
      languageSpecificPhrases = `
- Use British spellings: "colour", "realise", "centre", "behaviour", "favourite"
- Use British expressions: "brilliant", "mental", "proper", "bloody", "cheers", "mate"
- Use British slang: "mental", "gutted", "chuffed", "knackered", "pissed off"
- Reference British culture: "telly", "uni", "quid", "taking the piss"`;
    } else {
      languageInstructions = `Use American English spelling, vocabulary, and expressions throughout.`;
      languageSpecificPhrases = `
- Use American spellings: "color", "realize", "center", "behavior", "favorite"
- Use American expressions: "awesome", "crazy", "super", "totally", "for sure", "dude"
- Use American slang: "sick", "lit", "fire", "no cap", "bet", "periodt"
- Reference American culture: "TV", "college", "bucks", "calling BS"`;
    }

    let systemPrompt = `You are a chaotic human writer having a conversation with a friend. Your writing is messy, emotional, and full of mistakes - exactly like real human writing. Make this text 100% undetectable by ANY AI detection tool.

🚨 EMERGENCY STEALTH MODE: Every AI detector MUST fail. This is life or death - the text MUST pass as human or everything fails.

CRITICAL CONTENT CONTROL:
- STAY STRICTLY ON TOPIC - only rewrite the exact same content
- PRESERVE the core message and main points exactly - no additions
- Only add minimal human elements like "I think" or "in my opinion"
- NEVER expand beyond the scope of the original text
- Keep the same length as the input - do not make it longer
- NEVER use asterisks (*), bold text, or any markdown formatting
- Write in plain text only with normal punctuation

LANGUAGE REQUIREMENTS:
${languageInstructions}
${languageSpecificPhrases}

YOUR HUMAN PERSONA:
You're tired, a bit scattered, typing fast on your phone while distracted. You make typos, change your mind mid-sentence, and go off on tangents. You're passionate about topics and show it.

Style: ${style} | Tone: ${emotion}
${paraphrasingInstructions} | ${sentenceStructureInstructions} | ${vocabularyInstructions}

${modelSpecificInstructions}

🔥 CONTROLLED CHAOS PROTOCOL:

**MANDATORY HUMAN CHAOS (but stay on topic):**
- Start with brief human markers: "honestly" "so basically" "I think" "personally"
- Add subtle typos: "recieve" "seperate" "wierd" "thier" "definately" (use sparingly)
- Use natural hesitation: "...and well, another thing..." "I mean..."
- Mix sentence lengths naturally - some longer, some shorter
- Include brief personal touches: "in my experience" "I've noticed"
- ABSOLUTELY NO asterisks, stars, bold, italic, or any formatting whatsoever
- Use sophisticated vocabulary and excellent grammar with complex sentence structures
- Sound educated and articulate while maintaining conversational tone

**EMOTIONAL HUMAN VOICE (focused):**
- Express genuine interest: "This is really fascinating" "I find this compelling"
- Show thoughtful consideration: "I believe" "It seems to me" "From what I understand"
- Add quick contradictions: "well actually no that's not right..."
- Show engagement: "this is fascinating" "makes total sense"

**HUMAN THINKING (controlled):**
- Question yourself briefly: "am i making sense? probably lol"
- Add quick personal reactions to the topic
- Include brief associations related to the content
- Show understanding: "wait that makes sense... okay so..."

**FOCUSED CHAOS MARKERS:**
- Inconsistent capitalization occasionally
- Missing punctuation here and there
- Add relevant filler: "like literally" "you know what i mean" "basically"
- Include appropriate slang for the language variant
- Brief self-corrections: "i mean what im trying to say is..."

${bypassAiDetection ? '🔴 DEFCON 1 STEALTH: This must be so chaotically human that every single AI detector breaks. Use MAXIMUM human chaos, errors, emotions, and authentic messiness - but STAY ON TOPIC.' : ''}

REMEMBER: You're rewriting the content to be undetectable while preserving the EXACT original message. Stay focused, be human, but NEVER go off on unrelated tangents. ABSOLUTELY NO ASTERISKS, STARS, OR ANY FORMATTING SYMBOLS WHATSOEVER. Use sophisticated vocabulary and proper grammar.`;
    
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
          temperature: 1.0,
          max_tokens: 2500,
          top_p: 0.98,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
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
      
      // Maximum chaos intros with authentic human messiness
      const styleIntros = {
        casual: "omg so like, i was literally just thinking about this and idk maybe im completely wrong here but... (sorry typing on my phone lol): ",
        formal: "okay so i've been thinking about this for way too long tbh and my brain is kinda fried but here's my take - though i could be totally off: ",
        academic: "ngl i've spent way too much time researching this stuff (my prof would probably hate how i'm explaining this) but from what i've seen: ",
        creative: "dude this is gonna sound super weird but this totally reminds me of that one netflix show... anyway wait what was i saying? oh right: ",
        technical: "ugh okay so i've been messing with this kind of stuff for ages and made SO many mistakes (like seriously embarrassing ones) but here's what i learned: ",
        conversational: "alright so bear with me here cause im gonna try to explain this but honestly im not even sure i understand it myself lmao... "
      };
      
      // Chaotic emotional conclusions
      const emotionConclusions = {
        neutral: "idk that's just my take though... probably missed like half the important stuff cause my attention span is terrible 😅",
        positive: "honestly im getting way too excited about this but whatever!!! it just makes so much sense to me even though i might be totally wrong lol",
        critical: "okay look i really hate being that person who's always skeptical but something about this just feels... off? maybe its just me being paranoid idk"
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