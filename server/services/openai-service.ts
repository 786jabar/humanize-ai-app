import OpenAI from "openai";
import { HumanizeRequest, HumanizeResponse } from "@shared/schema";
import { calculateReadingTime, countWords } from "../../client/src/lib/utils";

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function humanizeText(request: HumanizeRequest): Promise<HumanizeResponse> {
  try {
    const { text, style, emotion, bypassAiDetection, improveGrammar, preserveKeyPoints } = request;

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

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the humanized text
    const humanizedText = response.choices[0].message.content || "";

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
    console.error("OpenAI API error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process text with OpenAI");
  }
}
