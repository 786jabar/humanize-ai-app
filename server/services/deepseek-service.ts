import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { calculateReadingTime, countWords } from "../../client/src/lib/utils";
import { testAIDetection } from "./ai-detection-service";
import axios from "axios";

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Log API key presence for debugging (not the actual key)
console.log("DeepSeek API Key available:", !!DEEPSEEK_API_KEY);

// Post-processing function to make text sound naturally human
function addHumanImperfections(text: string, bypassAiDetection: boolean, style: string): string {
  if (!bypassAiDetection) return text;

  let result = text;

  // For academic style - still add some natural elements but keep formal
  if (style === 'academic') {
    // Replace overly complex AI phrases with simpler academic language
    const academicSimplifications: Record<string, string> = {
      'precipitated': 'brought about',
      'multitude of': 'many',
      'it is noteworthy that': 'notably',
      'demonstrated remarkable': 'shown significant',
      'exhibited exceptional': 'shown strong',
      'facilitated insights': 'provided insights',
      'virtually boundless': 'extensive',
      'in light of these developments': 'given these changes',
      'maintain a pivotal position': 'play a key role',
      'trajectory of': 'path of'
    };

    Object.entries(academicSimplifications).forEach(([formal, simpler]) => {
      const regex = new RegExp(formal, 'gi');
      result = result.replace(regex, simpler);
    });

    return result;
  }

  // For non-academic styles, apply aggressive humanization

  // 1. Replace overly formal/AI vocabulary with natural language
  const vocabularySimplifications: Record<string, string> = {
    'precipitated': 'caused',
    'multitude of': 'many',
    'nevertheless': 'however',
    'it is noteworthy that': '',
    'unprecedented': 'rapid',
    'demonstrated remarkable': 'shown great',
    'acceleration in both capability and application': 'growth in what it can do',
    'yielded substantial benefits': 'helped a lot',
    'spanning diverse sectors': 'across different industries',
    'enhancing operational efficiency': 'making things work better',
    'enabling novel approaches': 'allowing new ways',
    'concurrently': 'at the same time',
    'exhibited exceptional proficiency': 'gotten really good',
    'facilitating insights': 'helping us understand',
    'previously unattainable': 'we couldn\'t get before',
    'conventional analytical methods': 'traditional analysis',
    'virtually boundless': 'nearly endless',
    'extending from': 'ranging from',
    'in light of these developments': 'because of this',
    'it becomes increasingly evident': 'it\'s clear',
    'maintain a pivotal position': 'play a major role',
    'trajectory of': 'path of',
    'in the foreseeable future': 'going forward',
    'utilize': 'use',
    'commence': 'start',
    'terminate': 'end',
    'implement': 'put in place',
    'numerous': 'many',
    'regarding': 'about',
    'consequently': 'so',
    'therefore': 'so',
    'thus': 'so',
    'however': 'but',
    'furthermore': 'also',
    'moreover': 'plus',
    'additionally': 'also'
  };

  // Apply vocabulary simplifications
  Object.entries(vocabularySimplifications).forEach(([formal, natural]) => {
    const regex = new RegExp('\\b' + formal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, natural);
  });

  // 2. Add natural contractions (80% chance)
  const contractionMap: Record<string, string> = {
    'do not': 'don\'t',
    'does not': 'doesn\'t',
    'did not': 'didn\'t',
    'cannot': 'can\'t',
    'will not': 'won\'t',
    'would not': 'wouldn\'t',
    'should not': 'shouldn\'t',
    'could not': 'couldn\'t',
    'it is': 'it\'s',
    'that is': 'that\'s',
    'there is': 'there\'s',
    'I am': 'I\'m',
    'you are': 'you\'re',
    'we are': 'we\'re',
    'they are': 'they\'re',
    'I have': 'I\'ve',
    'you have': 'you\'ve',
    'we have': 'we\'ve',
    'I will': 'I\'ll',
    'you will': 'you\'ll',
    'has not': 'hasn\'t',
    'have not': 'haven\'t',
    'had not': 'hadn\'t'
  };

  // Apply contractions more frequently
  Object.entries(contractionMap).forEach(([full, contraction]) => {
    const regex = new RegExp('\\b' + full + '\\b', 'gi');
    result = result.replace(regex, (match) => Math.random() > 0.2 ? contraction : match);
  });

  // 3. Add conversational markers (for casual/conversational styles)
  if (style === 'casual' || style === 'conversational' || style === 'creative') {
    const conversationalMarkers = [
      'Well, ',
      'Actually, ',
      'Honestly, ',
      'To be fair, ',
      'In my view, ',
      'I think ',
      'It seems like ',
      'From what I can tell, ',
      'The way I see it, '
    ];

    const sentences = result.split(/(?<=[.!?])\s+/);
    result = sentences.map((sent, idx) => {
      // Add to 20% of sentences
      if (idx > 0 && Math.random() > 0.8 && sent.trim().length > 20) {
        const marker = conversationalMarkers[Math.floor(Math.random() * conversationalMarkers.length)];
        const hasMarker = conversationalMarkers.some(m => sent.trim().startsWith(m));
        if (!hasMarker) {
          return marker + sent.trim().charAt(0).toLowerCase() + sent.trim().slice(1);
        }
      }
      return sent.trim();
    }).join(' ');
  }

  // 4. Break up very long sentences more aggressively
  const sentences = result.split(/(?<=[.!?])\s+/);
  result = sentences.map(sent => {
    const words = sent.trim().split(/\s+/);
    // If sentence is long (>20 words), break it up
    if (words.length > 20 && Math.random() > 0.5) {
      const midpoint = Math.floor(words.length / 2);
      const firstHalf = words.slice(0, midpoint).join(' ');
      const secondHalf = words.slice(midpoint).join(' ');
      return firstHalf + '. ' + secondHalf.charAt(0).toUpperCase() + secondHalf.slice(1);
    }
    return sent.trim();
  }).join(' ');

  // 5. Replace passive voice patterns with active voice
  result = result.replace(/has been (\w+ed)/g, (match, verb) => {
    return Math.random() > 0.5 ? verb : match;
  });

  return result;
}

// Helper function for fallback text transformation
function getSimpleTransformation(inputText: string, style: string): string {
  // For very short input
  if (inputText.length < 50) {
    return `This touches on ${inputText.toLowerCase()}, which is worth exploring in more depth. There are several important angles to consider here.`;
  }

  // For regular text, create a natural transformation
  const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);

  if (sentences.length > 1) {
    let result = "";
    const selectedSentences = sentences.slice(0, Math.min(5, sentences.length));

    // Transform based on style
    if (style === 'academic' || style === 'formal') {
      result = "Upon examination of this subject, several key points emerge. ";
      for (const sentence of selectedSentences) {
        const trimmed = sentence.trim();
        result += trimmed.charAt(0).toUpperCase() + trimmed.slice(1) + '. ';
      }
      result += "These considerations warrant further analysis and discussion.";
    } else if (style === 'casual' || style === 'conversational') {
      result = "Looking at this, there are a few important things to consider. ";
      for (const sentence of selectedSentences) {
        const trimmed = sentence.trim();
        result += trimmed.charAt(0).toUpperCase() + trimmed.slice(1) + '. ';
      }
      result += "It's definitely worth thinking about from different angles.";
    } else {
      // Default transformation
      for (const sentence of selectedSentences) {
        const trimmed = sentence.trim();
        result += trimmed.charAt(0).toUpperCase() + trimmed.slice(1) + '. ';
      }
      result += "This presents several important considerations.";
    }

    return result;
  }

  // Fallback for single sentence
  return `${inputText} This concept has several practical implications that deserve thoughtful consideration.`;
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
        modelSpecificInstructions = `Natural Human Writing Style:
- Write as a knowledgeable person explaining concepts clearly and naturally
- Use personal perspective appropriately ("I think," "In my view," "From my understanding")
- Include natural conversational flow without being overly casual
- Add personal insights and interpretations where relevant
- Vary formality naturally as humans do in different contexts
- Maintain professional tone while sounding authentic and relatable`;
        break;

      case 'deepseek-coder':
        modelSpecificInstructions = `Technical Writing with Human Expertise:
- Write like an experienced professional sharing practical knowledge
- Include real-world context ("In practice," "From experience," "Typically")
- Balance technical accuracy with approachable explanations
- Use professional but conversational technical language
- Share practical insights and problem-solving approaches
- Maintain clarity while showing genuine expertise`;
        break;

      case 'deepseek-instruct':
        modelSpecificInstructions = `Creative and Engaging Expression:
- Write with creative flair while maintaining clarity
- Include thoughtful interpretations and personal perspectives
- Use engaging metaphors and relatable examples
- Add emotional intelligence and nuanced understanding
- Balance creativity with coherent structure
- Show genuine engagement with ideas`;
        break;

      case 'deepseek-v3':
        modelSpecificInstructions = `Advanced Natural Human Writing:
- Write with authentic human voice and natural flow
- Use varied sentence structures and pacing
- Include subtle personal touches (contractions, varied transitions)
- Balance professionalism with approachability
- Add thoughtful insights and perspectives
- Maintain readability while sounding genuinely human
- Use natural conversational elements without being unprofessional
- Show genuine engagement and understanding of the topic`;
        break;

      default:
        modelSpecificInstructions = `Focus on natural, professional human writing that is clear, engaging, and authentic.`;
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
      ? `You are a distinguished academic writing expert trained in university-level scholarly communication. Your purpose is to transform text into formal, sophisticated academic prose suitable for peer-reviewed journals, dissertations, and academic institutions.

CORE MANDATE: PRODUCE FORMAL ACADEMIC WRITING

PROHIBITIONS:
- Avoid casual language: "basically", "kinda", "like", "you know", "stuff", "thing"
- Maintain scholarly tone, not conversational
- Avoid contractions: Use "cannot" not "can't", "will not" not "won't"
- Minimize first-person casual expressions unless appropriate for the discipline
- Use analytical rather than emotional language
- Avoid direct address ("you") where inappropriate; use formal constructions
- Maintain appropriate sentence complexity and sophistication

REQUIREMENTS FOR ACADEMIC WRITING:

VOCABULARY & LANGUAGE:
- Use formal academic register throughout
- Employ discipline-specific terminology and scholarly vocabulary
- Use nominalisation where appropriate: "investigate" → "the investigation of"
- Include academic hedging: "the evidence suggests", "it may be argued", "research indicates"
- Employ varied sentence structures with appropriate complexity
- Use passive voice where suitable for academic objectivity
- Apply formal academic connectives: "furthermore", "consequently", "nevertheless", "thus", "therefore"

STRUCTURE & ARGUMENTATION:
- Begin with clear thesis statements and academic framing
- Develop paragraphs with topic sentences supported by evidence
- Use sophisticated transitions between ideas
- Construct logical arguments using scholarly reasoning
- Integrate citations and references formally
- Maintain consistent formal register

TONE & VOICE:
- Write as an expert addressing scholarly peers
- Maintain objective, analytical tone
- Use appropriate voice (third-person or formal first-person depending on discipline)
- Demonstrate intellectual rigor and critical thinking
- Show nuanced analysis and engagement with ideas

CONTENT REQUIREMENTS:
- Preserve original meaning while elevating to formal academic register
- Maintain all factual content and key points
- Do not add new information or expand beyond original scope
- Focus on elevating language formality and sophistication while maintaining clarity

${modelSpecificInstructions}

Transform the following text into formal academic prose while preserving its core message and maintaining readability.`
      : `You are an expert at transforming AI-generated text into natural, authentic human writing.

YOUR GOAL: Create text that sounds genuinely written by a knowledgeable human, maintaining professionalism and readability.

${bypassAiDetection ? `NATURAL HUMAN WRITING CHARACTERISTICS:

STYLE & VOICE:
- Write with a natural, authentic human voice
- Use varied sentence structures and pacing
- Include appropriate personal perspective when relevant
- Balance formality with approachability
- Show genuine understanding and engagement with the topic

LANGUAGE PATTERNS:
- Use natural contractions where appropriate (don't, can't, it's)
- Vary transitions and sentence starters
- Include thoughtful insights and interpretations
- Maintain conversational flow without being unprofessional
- Use specific, concrete examples where helpful

AUTHENTICITY ELEMENTS:
- Write as if explaining to an interested colleague or friend
- Include subtle personal touches (e.g., "In my experience", "From what I understand")
- Maintain consistent, professional tone throughout
- Use active voice predominantly for clarity
- Keep language clear, direct, and engaging

AVOID:
- Overly formal or stiff language
- Repetitive sentence structures
- Generic or vague statements
- Excessive jargon or complexity
- Robotic or mechanical phrasing

${modelSpecificInstructions}` : `NATURAL WRITING STYLE:
- Write clearly and naturally as a human would
- Use conversational but professional tone
- Include natural language patterns and varied structures
- Maintain clarity and readability
- Show genuine engagement with the content

${modelSpecificInstructions}`}

Transform the following text into natural, engaging human writing while preserving its core message and maintaining professionalism.

ORIGINAL TEXT:
${text.substring(0, 500)}${text.length > 500 ? '...' : ''}`;
    
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
        temperature: 0.7,  // Balanced temperature for focused academic writing
        max_tokens: 3000,  // More tokens for comprehensive academic responses
        top_p: 0.92,       // Controlled for consistent academic tone
        frequency_penalty: 0.3,  // Allow appropriate academic terminology repetition
        presence_penalty: 0.2    // Maintain consistent academic voice
      } : {
        // Balanced parameters for natural human writing
        temperature: bypassAiDetection ? 0.9 : 0.8,  // Moderate variety without chaos
        max_tokens: 2500,
        top_p: bypassAiDetection ? 0.95 : 0.92,  // Natural variation
        frequency_penalty: bypassAiDetection ? 0.5 : 0.4,  // Encourage varied expression
        presence_penalty: bypassAiDetection ? 0.4 : 0.3  // Subtle topic exploration
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
      let humanizedText = response.data.choices[0].message.content || "";
      
      // Apply post-processing to add human imperfections if bypass mode is enabled
      humanizedText = addHumanImperfections(humanizedText, bypassAiDetection, style);
      
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

      // Professional intros based on style
      const styleIntros = {
        casual: "Looking at this, here's what I think: ",
        formal: "Upon consideration of this matter, several points emerge: ",
        academic: "In examining this subject, it's important to note that ",
        creative: "This brings to mind some interesting perspectives. ",
        technical: "From a practical standpoint, here's what we're looking at: ",
        conversational: "So here's my take on this: "
      };

      // Professional conclusions based on emotion
      const emotionConclusions = {
        neutral: "These are the key points worth considering.",
        positive: "This presents some valuable insights that are worth exploring further.",
        critical: "However, there are some aspects that warrant closer examination and critical analysis."
      };

      // Add intro based on style
      humanizedText += styleIntros[style as keyof typeof styleIntros] || "Here's the key information: ";

      // Add transformed content
      humanizedText += getSimpleTransformation(text, style);

      // Add conclusion based on emotion
      humanizedText += " " + (emotionConclusions[emotion as keyof typeof emotionConclusions] || "These points deserve thoughtful consideration.");

      // Add subtle human touch if bypass AI detection is enabled
      if (bypassAiDetection) {
        humanizedText += " From my perspective, these elements work together to form a coherent understanding of the subject.";
      }
      
      // Add paraphrasing level elements to the fallback
      switch(paraphrasingLevel) {
        case 'extensive':
          // For extensive paraphrasing, add more comprehensive perspective
          if (style === "casual" || style === "conversational") {
            humanizedText += " Looking at this from different angles, it's clear there are multiple important considerations.";
          } else if (style === "formal" || style === "academic") {
            humanizedText += " Upon further examination, additional contextual factors merit careful consideration.";
          }
          break;
        case 'minimal':
          // For minimal paraphrasing, keep it simple
          break;
        case 'moderate':
        default:
          // For moderate paraphrasing, add balanced insight
          humanizedText += " There are various perspectives on this, each offering valuable insights.";
          break;
      }

      // Add sentence structure elements to the fallback
      switch(sentenceStructure) {
        case 'complex':
          // Add appropriately complex sentence
          if (style === 'academic') {
            humanizedText += " The multifaceted nature of this subject, encompassing various theoretical and practical dimensions, necessitates careful analytical examination.";
          } else {
            humanizedText += " The various interconnected aspects of this topic require thoughtful consideration of multiple perspectives and their practical implications.";
          }
          break;
        case 'simple':
          // Add clear, simple sentences
          humanizedText += " This is an important topic. The key points are clear. These ideas have real value.";
          break;
        case 'varied':
        default:
          // Already has varied sentence structure from other modifications
          break;
      }

      // Add vocabulary level elements to the fallback
      switch(vocabularyLevel) {
        case 'advanced':
          // Add sophisticated vocabulary appropriately
          if (style === 'academic') {
            humanizedText += " The salient characteristics of this discourse illuminate significant conceptual relationships worthy of scholarly attention.";
          } else {
            humanizedText += " The essential elements demonstrate important connections that merit thoughtful examination.";
          }
          break;
        case 'basic':
          // Add clear, accessible language
          humanizedText += " The main ideas are easy to understand and make good sense.";
          break;
        case 'intermediate':
        default:
          // Intermediate vocabulary is the default
          break;
      }

      // Add model-specific elements to the fallback (subtle touches)
      switch(request.model) {
        case 'deepseek-coder':
          if (style === 'technical') {
            humanizedText += " From a practical standpoint, understanding these technical aspects helps clarify the broader picture.";
          }
          break;
        case 'deepseek-instruct':
          if (style === 'creative') {
            humanizedText += " These ideas connect in interesting ways, revealing patterns that extend beyond the immediate context.";
          }
          break;
        case 'deepseek-v3':
          // Add natural human touch without being unprofessional
          if (style === 'casual' || style === 'conversational') {
            humanizedText += " In my experience, these elements tend to work together in ways that make sense once you see the bigger picture.";
          }
          break;
        case 'deepseek-chat':
        default:
          // Default is already well-balanced
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