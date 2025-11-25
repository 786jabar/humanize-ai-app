import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { humanizeRequestSchema, summaryRequestSchema, scoreRequestSchema, citationTransformSchema } from "@shared/schema";
import { humanizeText, summarizeText, scoreText, transformCitations } from "./services/deepseek-service";
import { ZodError } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import express from "express";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Get current user endpoint
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.json(user);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // API endpoint for humanizing text
  app.post("/api/humanize", async (req, res) => {
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

  // API endpoint for summarizing text
  app.post("/api/summarize", async (req, res) => {
    try {
      const validatedData = summaryRequestSchema.parse(req.body);
      const summary = await summarizeText(validatedData.text, validatedData.length, validatedData.format);
      return res.json({ summary });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: error.errors 
        });
      }
      console.error("Error summarizing text:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to summarize text" 
      });
    }
  });

  // API endpoint for scoring text
  app.post("/api/score", async (req, res) => {
    try {
      const validatedData = scoreRequestSchema.parse(req.body);
      const scoreResult = await scoreText(validatedData.text, validatedData.criteria);
      return res.json(scoreResult);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: error.errors 
        });
      }
      console.error("Error scoring text:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to score text" 
      });
    }
  });

  // API endpoint for transforming citations
  app.post("/api/transform-citations", async (req, res) => {
    try {
      const validatedData = citationTransformSchema.parse(req.body);
      const transformed = await transformCitations(validatedData.text, validatedData.fromStyle, validatedData.toStyle);
      return res.json({ text: transformed });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: error.errors 
        });
      }
      console.error("Error transforming citations:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to transform citations" 
      });
    }
  });

  // Serve built frontend if it exists (for production or when built files are available)
  const distPublicPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  if (fs.existsSync(distPublicPath)) {
    app.use(express.static(distPublicPath));

    // Catch-all route for frontend routing - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      const indexPath = path.resolve(distPublicPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
