# Humanize.AI - AI Content Transformation Platform

## Overview

Humanize.AI is a web application that transforms AI-generated text into natural, human-like content. The platform uses DeepSeek AI models to rewrite text with configurable writing styles, tones, and structural patterns while attempting to bypass AI detection tools. It's designed for students, content creators, and anyone who needs to make AI-generated content appear more authentic and human-written.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Upgrades (Current Session)

**Professional Feature Enhancements:**
- ✅ Fixed academic writing mode - now triggers when "academic" style is selected
- ✅ Implemented strict 100% formal academic writing prompt (no conversational tone, no contractions)
- ✅ Added advanced tools: summarize, score text, citation transformation (APA/MLA/Chicago/Harvard)
- ✅ Added export formats: TXT, HTML, Markdown
- ✅ Added formality and complexity sliders (0-100)
- ✅ Added AdvancedTools component with tabbed interface
- ✅ New API endpoints: `/api/summarize`, `/api/score`, `/api/transform-citations`
- ✅ Verified academic writing produces university-level scholarly output

**Academic Writing Quality:**
- Formal academic register enforced
- Complex sentence structures with multiple subordinate clauses
- Sophisticated scholarly vocabulary
- Zero casual language or contractions
- Objective, analytical tone suitable for peer-reviewed journals

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management and API caching

**UI Framework:**
- Shadcn/ui components (New York style variant) built on Radix UI primitives
- Tailwind CSS with custom design tokens for theming
- CSS variables for dynamic theming with light/dark mode support
- Custom gradient-based branding with purple/indigo color scheme

**State Management:**
- React hooks for local component state
- TanStack Query mutations for async API operations
- Custom hooks (useTextStats, useToast) for reusable logic

**Key Design Patterns:**
- Component composition with clear separation between presentational and container components
- Path aliases (@/, @shared, @assets) for clean imports
- Interactive text editing with synonym suggestions
- Academic writing assistant with pre-built prompts and templates

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript running on Node.js
- ESM module system for modern JavaScript support
- Custom middleware for request logging and error handling

**API Design:**
- RESTful endpoint structure
- Single primary endpoint: POST /api/humanize
- JSON request/response format
- Zod schema validation for type-safe request handling

**AI Integration:**
- Primary: DeepSeek API (chat, coder, instruct, v3 models)
- Fallback: Local text transformation when API unavailable
- Configurable model selection per request
- Structured prompt engineering for consistent output quality

**Text Processing Pipeline:**
1. Input validation using Zod schemas
2. AI model invocation with customized system prompts
3. Response parsing and statistics calculation
4. Optional AI detection simulation
5. Structured response with metadata

**Error Handling:**
- Graceful degradation with fallback transformations
- Comprehensive error logging
- User-friendly error messages
- HTTP status codes for proper error communication

### Data Storage

**Current Implementation:**
- In-memory storage using Map data structures
- User schema defined but not actively used
- No persistent database connection required for core functionality
- Stateless request processing

**Database Schema (Drizzle ORM):**
- Configured for PostgreSQL via Neon serverless
- User table with basic authentication fields
- Schema location: shared/schema.ts
- Migration output: ./migrations directory

**Note:** The application is configured for Postgres/Drizzle but currently operates without database persistence. All text processing is stateless.

### External Dependencies

**AI Services:**
- **DeepSeek API** - Primary text transformation service
  - Multiple model variants (chat, coder, instruct, v3)
  - Configured via DEEPSEEK_API_KEY environment variable
  - Endpoint: https://api.deepseek.com/v1/chat/completions

**Database Services:**
- **Neon Serverless PostgreSQL** - Configured but optional
  - Connection via @neondatabase/serverless
  - DATABASE_URL environment variable required for activation
  - Drizzle ORM for schema management and migrations

**Development Tools:**
- **Replit Integration** - Development environment features
  - Runtime error modal overlay
  - Cartographer plugin for code navigation
  - Development banner for external access

**UI Component Libraries:**
- **Radix UI** - Headless component primitives (17+ components)
- **Lucide React** - Icon library
- **React Day Picker** - Calendar components
- **Recharts** - Chart visualization support

**Validation & Forms:**
- **Zod** - Runtime type validation and schema definition
- **React Hook Form** - Form state management with @hookform/resolvers

**Styling:**
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe variant styling
- **tailwind-merge** - Intelligent class merging

**Build & Development:**
- **TypeScript** - Type safety across the stack
- **ESBuild** - Fast server bundle compilation
- **PostCSS** with Autoprefixer - CSS processing

**Optional Features:**
- AI Detection Testing - Simulated checks against GPTZero, Originality.ai
- Academic Assistant - Pre-built prompts for scholarly writing
- Synonym Panel - Interactive word replacement suggestions
- Theme Provider - Light/dark mode switching