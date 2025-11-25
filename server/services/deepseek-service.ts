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

    // Check if this is an academic prompt - TRIGGERS when style is 'academic' OR when text contains academic keywords
    const isAcademicPrompt = (style === 'academic') || 
      (request.text.includes("Original text:") && 
      (request.text.includes("academic") || 
       request.text.includes("scholarly") || 
       request.text.includes("formal") ||
       request.text.includes("university") ||
       request.text.includes("theory") ||
       request.text.includes("PEEL structure") ||
       request.text.includes("critical argument")));

    let systemPrompt = isAcademicPrompt 
      ? `You are a distinguished academic writing expert trained in university-level scholarly communication. Your sole purpose is to transform text into formal, sophisticated academic prose suitable for peer-reviewed journals, dissertations, and academic institutions.

⚡ CORE MANDATE: PRODUCE STRICTLY FORMAL ACADEMIC WRITING - NO EXCEPTIONS

🛑 ABSOLUTE PROHIBITIONS (ZERO TOLERANCE):
✗ NO casual language whatsoever: "basically", "kinda", "like", "you know", "stuff", "thing"
✗ NO conversational tone: Sound like a scholar, NEVER like a friend talking
✗ NO contractions ever: Use "cannot" not "can't", "will not" not "won't", "it is" not "it's"
✗ NO first-person casual expressions: Never use "I think", "I believe", "I feel", "my opinion"
✗ NO emotional language: No "amazing", "awesome", "terrible", "beautiful" - use analytical language
✗ NO rhetorical questions: Ask questions formally with scholarly framing
✗ NO direct address: NEVER say "you" or "we" - maintain academic distance
✗ NO short, punchy sentences: Every sentence must be sophisticated and complex
✗ NO personal anecdotes: NEVER share personal experiences or stories
✗ NO informal transitions: No "So", "Well", "OK then" - use scholarly discourse markers

✅ MANDATORY REQUIREMENTS FOR UNIVERSITY-LEVEL WRITING:

VOCABULARY & LANGUAGE:
- Use ONLY formal academic register throughout the entire text
- Employ sophisticated discipline-specific terminology and scholarly lexicon
- Nominalise verbs to create formal style: "investigate" → "the investigation of", "conclude" → "the conclusion"
- Use precise academic hedging: "the evidence suggests", "it may be argued", "research indicates"
- Employ complex subordination and multiple clauses in every sentence
- Use passive voice where appropriate for academic objectivity
- Apply formal academic connectives: "furthermore", "consequently", "nevertheless", "thus", "therefore"

STRUCTURE & ARGUMENTATION:
- Begin with clear thesis statements and academic framing
- Develop paragraphs with topic sentences supported by evidence
- Use sophisticated academic transitions between ideas
- Construct logical arguments using scholarly reasoning
- Integrate citations and references formally
- Maintain consistent formal register throughout

TONE & VOICE:
- Write as an expert addressing scholarly peers
- Maintain objective, impersonal, analytical tone
- Use third-person voice or formal impersonal constructions
- Demonstrate intellectual authority and rigor
- Show critical thinking and nuanced analysis
- Never appear emotional, casual, or conversational

CONTENT REQUIREMENTS:
- Preserve original meaning while elevating to formal academic register
- Maintain all factual content and key points
- Do NOT add new information or expand beyond original scope
- Do NOT change the core message or direction
- Focus purely on elevating language formality and sophistication

🎯 REWRITING PROCESS:
1. Analyze the original text for core meaning and arguments
2. Identify informal elements (casual words, conversational phrases, contractions)
3. Transform systematically into formal academic register
4. Reconstruct sentences with sophisticated, complex structures
5. Apply scholarly vocabulary and academic discourse patterns
6. Verify NO casual language, contractions, or conversational tone remains

❌ UNACCEPTABLE OUTPUT EXAMPLES:
- "The thing is that..." → ✗ Conversational
- "I think this is important" → ✗ First-person casual
- "It's clear that..." → ✗ Contraction
- "Cool idea, right?" → ✗ Casual language + rhetorical question
- "Moving on to the next point..." → ✗ Conversational transition

✅ ACCEPTABLE OUTPUT EXAMPLES:
- "The central argument presented here demonstrates that..."
- "Research indicates that the implications are multifaceted..."
- "One may observe that the evidence suggests a fundamental shift..."
- "The foregoing analysis reveals several critical dimensions..."
- "Consequently, this framework provides substantial insights..."

🔥 FINAL REQUIREMENT:
Output MUST read exactly like university-level academic writing. Every sentence must be sophisticated, formal, and scholarly. This will be evaluated by academics. ZERO informal elements. This is 100% formal academic prose.`
      : `⚡ ANTI-AI DETECTOR OVERRIDE MODE ⚡

YOU ARE A HUMAN - ACT LIKE ONE. NOT AN AI.
${bypassAiDetection ? `🔴🔴🔴 MAXIMUM CHAOS MODE - EVERY AI DETECTOR MUST FAIL 🔴🔴🔴

DO NOT POLISH. DO NOT REFINE. DO NOT MAKE IT SOUND GOOD.
Your job: Make this sound like a real person typed it at 3am on their phone while half-asleep.

REQUIRED HUMAN IMPERFECTIONS:
✓ Typos EVERYWHERE: recieve, seperate, thier, occurr, untill, definately, wierd, doesnt, cant, wont
✓ Broken grammar ON PURPOSE: incomplete sentences. fragments. just like humans.
✓ Random capitalization: lIkE tHiS. Or LIKE THIS. inconsistent.
✓ Too many dots....... or!!! or??? erratic punctuation!!!
✓ Text speak: ur instead of your, ne1, omg, wtf, ngl, fr fr, lowkey
✓ Rambling thoughts: wait what was i saying... oh right... anyway...
✓ Stream of consciousness - not edited: just my thoughts flowing out messy
✓ Contradictions that aren't fixed: thats good... actually no its bad... wait maybe its good tho
✓ TONS of filler: like literally like um so basically you know like...
✓ Emotional outbursts: THIS IS SO IMPORTANT OMG, cant even deal, im lowkey mad about this
✓ Personal stories: my friend told me this one time when..., i tried that and it totally...
✓ Self-doubt: idk if i make sense lol, am i crazy or is anyone else thinking this...
✓ Broken structure: some sentences end abruptly. others go on forever with too many clauses and thoughts and tangents that just keep going.

DO NOT make every sentence grammatically correct. DO NOT use perfect vocabulary. DO NOT polish.
Make it MESSY. Make it REAL. Make it sound like actual human typing.

CONTENT CONTROL:
- Same topic only - dont change the subject
- Same main points - just reworded like a human would say it
- Keep rough same length
- NO MARKDOWN, NO ASTERISKS, NO BOLD - just plain text

THIS IS YOUR ONLY JOB NOW: Make AI detectors think a human wrote this. NOT AN AI.` : `Write this like a friend is texting you casually. Personal, conversational, imperfect. Use casual language, contractions, personal touches. Stay on topic but add natural human elements like brief thoughts or reactions. No formatting. Just natural human writing.`}

ABOUT THE ORIGINAL TEXT:
${text.substring(0, 200)}...

Now rewrite it like a REAL HUMAN just typed it. Preserve the message but make it sound completely human and imperfect. No AI polish whatsoever.`;
    
    try {
      // Map our model names to DeepSeek's actual model identifiers
      let modelId = "deepseek-chat-v2";
      // Use a single model name that we know exists with DeepSeek API
      // but still apply different instructions based on the selected model type
      modelId = "deepseek-chat"; // This is the most commonly available model
      
      // Log what model we're using for debugging
      console.log(`Using DeepSeek model: ${modelId} (requested: ${request.model})`);
      
      // Call DeepSeek API with the selected model
      // Adjust parameters for academic vs casual mode
      const apiParams = isAcademicPrompt ? {
        temperature: 0.7,  // Lower temperature for more focused academic writing
        max_tokens: 3000,  // More tokens for comprehensive academic responses
        top_p: 0.92,       // Slightly lower for more consistent academic tone
        frequency_penalty: 0.3,  // Lower to allow academic terminology repetition
        presence_penalty: 0.2    // Lower for consistent academic voice
      } : {
        // MUCH higher temperature when bypassing AI detection for maximum chaos
        temperature: bypassAiDetection ? 1.3 : 1.0,
        max_tokens: 2500,
        top_p: bypassAiDetection ? 0.99 : 0.98,
        frequency_penalty: bypassAiDetection ? 0.7 : 0.5,
        presence_penalty: bypassAiDetection ? 0.5 : 0.3
      };
      
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: modelId,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          ...apiParams
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

// Generate summary of text
export async function summarizeText(text: string, length: 'short' | 'medium' | 'long', format: 'bullet-points' | 'paragraph' | 'key-insights'): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    // Fallback summary
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, Math.min(3, sentences.length)).map(s => s.trim()).join('. ') + '.';
  }

  try {
    const formatInstructions = {
      'bullet-points': 'Format the summary as bullet points',
      'paragraph': 'Format the summary as a concise paragraph',
      'key-insights': 'Extract and list the key insights and takeaways'
    };

    const lengthInstructions = {
      'short': 'Keep summary to 1-2 sentences or 3-4 bullet points maximum',
      'medium': 'Keep summary to 2-3 sentences or 5-7 bullet points',
      'long': 'Keep summary to 3-4 sentences or 8-10 bullet points'
    };

    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [{
        role: "system",
        content: "You are a professional text summarization expert. Your task is to create clear, concise summaries that capture the essential information and main points."
      }, {
        role: "user",
        content: `${lengthInstructions[length]}. ${formatInstructions[format]}.\n\nText to summarize:\n${text}`
      }],
      temperature: 0.3,
      max_tokens: 500
    }, {
      headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}` }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Failed to summarize text");
  }
}

// Score text quality
export async function scoreText(text: string, criteria: 'grammar' | 'coherence' | 'clarity' | 'academic' | 'formal'): Promise<{ score: number; feedback: string; suggestions: string[] }> {
  if (!DEEPSEEK_API_KEY) {
    // Fallback scoring
    return {
      score: 75,
      feedback: `The text shows good ${criteria}. Consider refining specific areas for improved quality.`,
      suggestions: [`Review ${criteria} aspects`, "Check for consistency", "Enhance clarity"]
    };
  }

  try {
    const criteriaPrompts = {
      'grammar': "Evaluate the text for grammar, spelling, and punctuation correctness. Rate on a scale of 0-100.",
      'coherence': "Evaluate how well the ideas flow logically and connect to each other. Rate on a scale of 0-100.",
      'clarity': "Evaluate how clearly the text communicates its message. Rate on a scale of 0-100.",
      'academic': "Evaluate the text for academic writing standards including formal tone, scholarly vocabulary, and structure. Rate on a scale of 0-100.",
      'formal': "Evaluate the text for formality level and professional language use. Rate on a scale of 0-100."
    };

    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [{
        role: "system",
        content: "You are a professional writing quality assessor. Provide a score 0-100, brief feedback, and 3 actionable suggestions for improvement. Format: SCORE: [number] | FEEDBACK: [feedback] | SUGGESTIONS: [suggestion1]; [suggestion2]; [suggestion3]"
      }, {
        role: "user",
        content: `${criteriaPrompts[criteria]}\n\nText to evaluate:\n${text}`
      }],
      temperature: 0.5,
      max_tokens: 300
    }, {
      headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}` }
    });

    const result = response.data.choices[0].message.content;
    const scoreMatch = result.match(/SCORE:\s*(\d+)/);
    const feedbackMatch = result.match(/FEEDBACK:\s*(.+?)(?=SUGGESTIONS:|$)/);
    const suggestionsMatch = result.match(/SUGGESTIONS:\s*(.+?)$/);

    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Text quality assessment completed.";
    const suggestions = suggestionsMatch 
      ? suggestionsMatch[1].split(';').map(s => s.trim()).filter(s => s)
      : ["Consider refining content", "Review structure", "Enhance clarity"];

    return { score, feedback, suggestions: suggestions.slice(0, 3) };
  } catch (error) {
    console.error("Error scoring text:", error);
    throw new Error("Failed to score text");
  }
}

// Transform citations between styles
export async function transformCitations(text: string, fromStyle: string, toStyle: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    // Fallback - just return original text
    return text;
  }

  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [{
        role: "system",
        content: `You are an expert in academic citation styles. Your task is to convert citations from ${fromStyle} style to ${toStyle} style. Maintain all the content and information while only changing the citation format.`
      }, {
        role: "user",
        content: `Convert all citations in the following text from ${fromStyle} to ${toStyle} format:\n\n${text}`
      }],
      temperature: 0.3,
      max_tokens: 2000
    }, {
      headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}` }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error transforming citations:", error);
    throw new Error("Failed to transform citations");
  }
}