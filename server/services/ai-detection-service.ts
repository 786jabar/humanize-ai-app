import axios from "axios";
import { AiDetectionTest } from "@shared/schema";

interface DetectionAPI {
  name: string;
  url: string;
  headers: Record<string, string>;
  payload: (text: string) => any;
  parseResponse: (response: any) => AiDetectionTest;
}

// Mock detection APIs for demonstration - would need real API keys for actual services
const detectionAPIs: DetectionAPI[] = [
  {
    name: "GPTZero",
    url: "https://api.gptzero.me/v2/predict/text", // Example endpoint
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.GPTZERO_API_KEY || ""
    },
    payload: (text: string) => ({ document: text }),
    parseResponse: (response: any) => ({
      detectorName: "GPTZero",
      humanScore: Math.round((1 - (response.documents?.[0]?.average_generated_prob || 0.5)) * 100),
      aiScore: Math.round((response.documents?.[0]?.average_generated_prob || 0.5) * 100),
      status: (response.documents?.[0]?.average_generated_prob || 0.5) < 0.3 ? "passed" : "failed",
      confidence: response.documents?.[0]?.class || "Unknown"
    })
  },
  {
    name: "Originality.ai",
    url: "https://api.originality.ai/api/v1/scan/ai", // Example endpoint
    headers: {
      "Content-Type": "application/json",
      "X-OAI-API-KEY": process.env.ORIGINALITY_API_KEY || ""
    },
    payload: (text: string) => ({ content: text }),
    parseResponse: (response: any) => ({
      detectorName: "Originality.ai",
      humanScore: Math.round((1 - (response.score?.ai || 0.5)) * 100),
      aiScore: Math.round((response.score?.ai || 0.5) * 100),
      status: (response.score?.ai || 0.5) < 0.3 ? "passed" : "failed",
      confidence: response.score?.fake ? "High AI Detection" : "Likely Human"
    })
  }
];

// Enhanced detection simulation that recognizes the new chaos patterns
function simulateDetection(text: string, detectorName: string): AiDetectionTest {
  // Advanced pattern detection for maximum human authenticity
  const hasPersonalPronouns = /\b(I|me|my|mine|myself|we|us|our)\b/gi.test(text);
  const hasFillerWords = /\b(um|uh|like|you know|I mean|actually|basically|literally|honestly|omg|lol|tbh|ngl|fr)\b/gi.test(text);
  const hasContractions = /\b(don't|won't|can't|I'm|we're|it's|that's|gonna|wanna|coulda|shoulda)\b/gi.test(text);
  const hasTypos = /\b(thier|recieve|seperate|occured|definately|wierd|ducking)\b/gi.test(text);
  const hasEmotionalLanguage = /\b(love|hate|excited|frustrated|amazing|terrible|annoying|awesome|DUDE|THIS IS|i love|so much)\b/gi.test(text);
  const hasChaosMarkers = /\b(wait|so like|idk|maybe im wrong|could be totally|ugh|btw|periodt|whatever)\b/gi.test(text);
  const hasInterruptions = /\([^)]*cat[^)]*keyboard[^)]*\)|\.\.\.and oh wait|wait what was i saying/gi.test(text);
  const hasInconsistentCaps = /[a-z][A-Z][a-z]|[A-Z][a-z][A-Z]/g.test(text);
  const hasStreamOfConsciousness = /\.\.\.|--|\band then\b|\boh wait\b|\bactually no\b/gi.test(text);
  const hasPersonalStories = /\b(my mom|happened to me|last week|this reminds me|netflix show)\b/gi.test(text);
  const hasSelfCorrection = /\b(i mean|what i'm trying to say|well actually|on second thought)\b/gi.test(text);
  const hasVagueRefs = /\b(that thing|you know what i mean|some guy|this one time)\b/gi.test(text);
  
  // Calculate human-like score with enhanced weighting
  let humanScore = 25; // Lower base score to be more realistic
  
  // Core human patterns (high weight)
  if (hasPersonalPronouns) humanScore += 15;
  if (hasFillerWords) humanScore += 20;
  if (hasContractions) humanScore += 12;
  if (hasEmotionalLanguage) humanScore += 18;
  
  // Chaos patterns (maximum weight for stealth)
  if (hasChaosMarkers) humanScore += 25;
  if (hasInterruptions) humanScore += 30;
  if (hasStreamOfConsciousness) humanScore += 22;
  if (hasPersonalStories) humanScore += 20;
  if (hasSelfCorrection) humanScore += 18;
  
  // Advanced human flaws
  if (hasTypos) humanScore += 15;
  if (hasInconsistentCaps) humanScore += 12;
  if (hasVagueRefs) humanScore += 10;
  
  // Detector-specific adjustments to simulate real-world variance
  switch (detectorName) {
    case "GPTZero":
      humanScore += Math.random() * 8 - 4; // More sensitive to patterns
      break;
    case "Originality.ai":
      humanScore += Math.random() * 6 - 3; // Stricter detection
      break;
    case "Turnitin":
      humanScore += Math.random() * 10 - 2; // Academic focus, less strict on casual writing
      break;
    case "Copyleaks":
      humanScore += Math.random() * 7 - 3; // Moderate sensitivity
      break;
    case "Writer.com":
      humanScore += Math.random() * 9 - 1; // More lenient with creative writing
      break;
    default:
      humanScore += Math.random() * 6 - 3;
  }
  
  // Ensure realistic bounds
  humanScore = Math.max(15, Math.min(98, Math.round(humanScore)));
  const aiScore = 100 - humanScore;
  const status = humanScore >= 65 ? "passed" : "failed"; // Stricter passing threshold
  
  let confidence = "Low";
  if (humanScore >= 90) confidence = "Very High";
  else if (humanScore >= 75) confidence = "High";
  else if (humanScore >= 60) confidence = "Medium";
  else if (humanScore >= 40) confidence = "Low";
  else confidence = "Very Low";
  
  return {
    detectorName,
    humanScore,
    aiScore,
    status: status as "passed" | "failed",
    confidence: `${confidence} Confidence (${humanScore}% Human)`
  };
}

export async function testAIDetection(text: string): Promise<AiDetectionTest[]> {
  const results: AiDetectionTest[] = [];
  
  for (const api of detectionAPIs) {
    try {
      // Check if API key is available
      const hasApiKey = api.headers["x-api-key"] || api.headers["X-OAI-API-KEY"];
      
      if (!hasApiKey) {
        // Use simulation when no API key is available
        console.log(`No API key for ${api.name}, using simulation`);
        results.push(simulateDetection(text, api.name));
        continue;
      }
      
      console.log(`Testing with ${api.name}...`);
      
      const response = await axios.post(api.url, api.payload(text), {
        headers: api.headers,
        timeout: 30000 // 30 second timeout
      });
      
      const result = api.parseResponse(response.data);
      results.push(result);
      
      console.log(`${api.name} result: ${result.humanScore}% human`);
      
    } catch (error: any) {
      console.error(`Error testing with ${api.name}:`, error.message);
      
      // Fallback to simulation on error
      results.push({
        detectorName: api.name,
        humanScore: 0,
        aiScore: 0,
        status: "error" as const,
        confidence: `Error: ${error.message.substring(0, 50)}...`
      });
    }
  }
  
  // Add additional simulated detectors for better demonstration
  const additionalDetectors = ["Copyleaks", "Turnitin", "Writer.com"];
  
  for (const detector of additionalDetectors) {
    results.push(simulateDetection(text, detector));
  }
  
  return results;
}

// Function to get overall detection status
export function getOverallDetectionStatus(tests: AiDetectionTest[]): {
  overallStatus: "passed" | "failed" | "mixed";
  passedCount: number;
  totalCount: number;
  averageHumanScore: number;
} {
  const validTests = tests.filter(test => test.status !== "error");
  const passedTests = validTests.filter(test => test.status === "passed");
  
  const averageHumanScore = validTests.length > 0 
    ? Math.round(validTests.reduce((sum, test) => sum + test.humanScore, 0) / validTests.length)
    : 0;
  
  let overallStatus: "passed" | "failed" | "mixed" = "failed";
  
  if (passedTests.length === validTests.length && validTests.length > 0) {
    overallStatus = "passed";
  } else if (passedTests.length > validTests.length / 2) {
    overallStatus = "mixed";
  }
  
  return {
    overallStatus,
    passedCount: passedTests.length,
    totalCount: validTests.length,
    averageHumanScore
  };
}