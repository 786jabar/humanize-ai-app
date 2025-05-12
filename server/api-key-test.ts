import OpenAI from "openai";

// Function to test the API key
async function testApiKey(apiKey: string) {
  try {
    console.log("Testing OpenAI API key...");
    
    // Initialize the OpenAI client with the provided key
    const openai = new OpenAI({ apiKey });
    
    // Make a very simple API call
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a less expensive model for testing
      messages: [
        { role: "user", content: "Hello, this is a test message to verify API key validity." }
      ],
      max_tokens: 10, // Keeping it minimal for quota conservation
    });
    
    // If we get here, the key is working
    console.log("✅ SUCCESS: API key is valid and working!");
    console.log("Response received:", response.choices[0].message);
    return true;
  } catch (error) {
    console.error("❌ ERROR: API key validation failed");
    console.error("Error details:", error);
    return false;
  }
}

// Run the test with the API key from environment variables
const apiKey = process.env.OPENAI_API_KEY || "";
testApiKey(apiKey).then(isValid => {
  console.log(`API key test completed. Valid: ${isValid}`);
});