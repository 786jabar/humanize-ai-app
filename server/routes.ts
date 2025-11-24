import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { humanizeRequestSchema } from "@shared/schema";
import { humanizeText } from "./services/deepseek-service";
import { ZodError } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Get current user endpoint (protected)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      // Disable caching to prevent 304 responses that break client-side auth detection
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // API endpoint for humanizing text (protected - requires login)
  app.post("/api/humanize", isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = humanizeRequestSchema.parse(req.body);
      
      // Call DeepSeek service to humanize the text
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
