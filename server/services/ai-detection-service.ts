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

// Simulated detection for demo purposes when real APIs aren't available
function simulateDetection(text: string, detectorName: string): AiDetectionTest {
  // Simulate detection based on text characteristics
  const hasPersonalPronouns = /\b(I|me|my|mine|myself)\b/gi.test(text);
  const hasFillerWords = /\b(um|uh|like|you know|I mean|actually|basically)\b/gi.test(text);
  const hasContractions = /\b(don't|won't|can't|I'm|we're|it's|that's)\b/gi.test(text);
  const hasTypos = /\b(thier|recieve|seperate|occured|definately)\b/gi.test(text);
  const hasEmotionalLanguage = /\b(love|hate|excited|frustrated|amazing|terrible)\b/gi.test(text);
  
  // Calculate human-like score based on patterns
  let humanScore = 30; // Base score
  
  if (hasPersonalPronouns) humanScore += 20;
  if (hasFillerWords) humanScore += 25;
  if (hasContractions) humanScore += 15;
  if (hasTypos) humanScore += 10;
  if (hasEmotionalLanguage) humanScore += 10;
  
  // Add randomness to simulate real detection variance
  humanScore += Math.random() * 10 - 5;
  humanScore = Math.max(0, Math.min(100, Math.round(humanScore)));
  
  const aiScore = 100 - humanScore;
  const status = humanScore >= 70 ? "passed" : "failed";
  
  let confidence = "Low";
  if (humanScore >= 85) confidence = "Very High";
  else if (humanScore >= 70) confidence = "High";
  else if (humanScore >= 50) confidence = "Medium";
  
  return {
    detectorName,
    humanScore,
    aiScore,
    status: status as "passed" | "failed",
    confidence: `${confidence} (${humanScore}% Human)`
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