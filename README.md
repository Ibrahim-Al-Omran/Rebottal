# Rebottal - AI Debate Bot

[Live Demo](https://rebottal.vercel.app/)

Rebottal is an AI-powered debate bot web app built with Next.js, TypeScript, and Tailwind CSS. Users can enter arguments and receive AI-generated counterpoints, simulating a real debate experience.

## Features
- Chat interface for debating with an AI
- Smooth, modern UI with Tailwind CSS
- Light/dark theme support
- Animated intro message
- Powered by a serverless API route and an AI model

## What I Learned
- **TypeScript:** Strongly-typed React components and API logic
- **Tailwind CSS:** Utility-first styling for rapid UI development
- **AI API Integration:** Sending/receiving messages to/from an AI model via a REST API
- **Next.js App Router:** Modern file-based routing and serverless functions

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Ibrahim-Al-Omran/DebateMe.git
   cd DebateMe
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and add your AI API key.
4. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure
- `src/app/page.tsx` — Main chat UI
- `src/app/api/chat/route.ts` — API route for AI responses
- `src/components/` — Reusable UI components
- `src/styles/` — Global styles

## Live Demo
Check out the live app: [https://rebottal.vercel.app/](https://rebottal.vercel.app/)

## License
MIT
