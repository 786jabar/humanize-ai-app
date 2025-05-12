import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { humanizeRequestSchema } from "@shared/schema";
import { humanizeText } from "./services/openai-service";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for humanizing text
  app.post("/api/humanize", async (req, res) => {
    try {
      // Validate request body
      const validatedData = humanizeRequestSchema.parse(req.body);
      
      // Call OpenAI service to humanize the text
      const result = await humanizeText(validatedData);
      
      // Return the humanized text and stats
      return res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: error.errors 
        });
      }
      
      console.error("Error humanizing text:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "An error occurred while processing your request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
