# SmartMail AI — Mail Studio for Students & Professionals

> **Live Demo:** [https://smartmail-ai.vercel.app](https://smartmail-ai.vercel.app) *(Replace with your deployed Vercel URL)*  
> **GitHub Repository:** [https://github.com/your-username/smartmail-ai](https://github.com/your-username/smartmail-ai) *(Replace with your repository URL)*

SmartMail AI is an AI-powered email assistant designed specifically for students, academic researchers, job applicants, and busy professionals. It simplifies drafting, refining, and auditing high-stakes professional emails through an editorial stationery design system.

---

## 📌 Problem Statement

Writing professional emails—such as thesis proposal requests to professors, grade appeal inquiries, recruiter follow-ups, or executive status updates—often induces friction. Writers struggle with:
* Striking the correct balance between formality and warmth.
* Expressing complex requests concisely without sounding pushy.
* Ensuring grammar, clarity, and tone align with institutional expectations.

Generic AI wrappers often generate generic, hyper-formal corporate gibberish wrapped in dark SaaS templates. **SmartMail AI** solves this by providing structured, context-aware email drafting paired with instant quality auditing in a tactile paper-stationery studio interface.

---

## ✨ Key Features

1. **Generate Email Mode:** Transforms raw bullet points, recipient role, purpose, and tone selection into structured, professional email drafts with bracketed placeholder tokens (`[Professor's Name]`, `[Date]`).
2. **Improve Draft Mode:** Polishes existing email drafts, refining sentence flow, grammar, and tone while strictly preserving core user intent.
3. **AI Read & Quality Audit Panel:** Displays numerical ratings (`0–100`) for **Professionalism** and **Clarity**, detected tone classification, actionable suggestions, and key highlights.
4. **Editorial Mail-Studio Aesthetic:** Tactile ivory stationery paper card design with postmark textures, airmail border accents, and subtle typography hierarchy (serif headings + sans-body).
5. **Resilient Form State & Error Recovery:** Preserves all user inputs even when network interruptions or server errors occur, allowing seamless one-click retries.
6. **Accessible Clipboard Integration:** One-click copy actions for Subject Line, Email Body, or Full Email with live screen reader announcements (`"Subject copied"`, `"Email copied"`).

---

## 🛠️ Technology Stack

* **Framework:** [Next.js 16.3 (App Router)](https://nextjs.org/) with React 19 and TypeScript 5.
* **Styling & Design System:** Vanilla CSS with [Tailwind CSS v4](https://tailwindcss.com/), Google Fonts (`Newsreader` serif & `Plus Jakarta Sans`).
* **AI Service SDK:** Official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK with Google Gemini Models.
* **Schema Validation:** [Zod v4](https://zod.dev/) for strict client-side form validation and server-side LLM response parsing.
* **Testing Suite:** [Vitest v4](https://vitest.dev/) with `@testing-library/react` and `jsdom`.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Client (React 19)                       │
│  [ ModeSelector ] ──► [ EmailForm ] ──► [ LoadingState ] ──► [ UI ]     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ POST /api/generate-email
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js Server API Route (Node.js)                   │
│  1. Zod Request Validation (smartMailRequestSchema)                   │
│  2. Server-Only Client Factory (src/lib/gemini.ts)                      │
│  3. 15-Second Execution Timeout Promise Guard                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Official @google/genai SDK
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Google Gemini API Service                       │
│  - Prompts strictly enforced via System Persona & Constraints          │
│  - Response Mode: application/json                                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON String Response
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Server Validation & Response Sanitization              │
│  1. Strip Markdown Code Fences (```json ... ```)                        │
│  2. JSON.parse() + Zod Output Validation (smartMailResponseSchema)     │
│  3. HTTP 200 JSON Payload Response                                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 AI Prompt Strategy & Structured Output

SmartMail AI uses system prompts engineered for zero-hallucination factual consistency:

1. **System Persona:** Configured as an elite academic and professional email assistant.
2. **Strict Constraints:**
   - Never invent unstated facts, names, dates, or credentials.
   - Use standardized bracketed placeholders (`[Recipient's Name]`) for unspecified details.
   - Maintain concise, professional language.
3. **Structured JSON Output:**
   - Enforced using `config: { responseMimeType: "application/json" }`.
   - Every response is guaranteed to conform to the following schema:
     ```json
     {
       "subject": "Clear, concise subject line",
       "email": "Full formatted message body",
       "tone": "Detected tone description",
       "professionalismScore": 95,
       "clarityScore": 90,
       "suggestions": ["Actionable suggestion 1"],
       "improvements": ["Key improvement 1"]
     }
     ```

---

## 🔒 Security Architecture

* **Server-Only Isolation:** Server logic uses `import "server-only";` in `src/lib/gemini.ts`. The Gemini API client is never instantiated on the client side.
* **Environment Variable Protection:** `GEMINI_API_KEY` is loaded strictly from `process.env.GEMINI_API_KEY`. It is **never** prefixed with `NEXT_PUBLIC_`.
* **Zero `dangerouslySetInnerHTML`:** All LLM outputs are rendered using standard React JSX interpolation to eliminate XSS risks.
* **Input & Output Guardrails:** Zod schemas validate both incoming request payloads and outgoing LLM JSON objects.
* **Credential Masking:** API error responses return sanitized messages without leaking stack traces or credentials.

---

## ♿ Accessibility (WCAG 2.1 AA Compliance)

* **Semantic Hierarchy:** Single `<h1>` tag per page with logical `<h2>`–`<h4>` nesting.
* **Keyboard Navigation:** Full tab navigation support, including arrow-key roving tabindex navigation on the `ModeSelector` tablist.
* **Form Label Associations:** All inputs and textareas are bound to explicit `<label>` tags.
* **Live Regions:**
  * Screen reader announcements for loading progress using `role="status"` and `aria-live="polite"`.
  * Status feedback for clipboard copy operations (*"Subject copied"*, *"Email copied"*).
  * Error announcements using `role="alert"` and `aria-live="assertive"`.
* **Color Contrast & Touch Targets:** High-contrast color palette compliant with WCAG AA ratios; minimum 44x44px touch targets on mobile viewports.
* **Reduced Motion:** Supports `@media (prefers-reduced-motion: reduce)` with `motion-reduce:animate-none` animation overrides.

---

## 🧪 Testing Infrastructure

The project includes unit and integration test coverage using Vitest and React Testing Library.

```bash
# Run all test suites
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage report
npm run test:coverage
```

### Test Suites Included (`src/__tests__/`)
* `validations.test.ts`: Zod schema validation rules.
* `gemini.test.ts`: Gemini service factory and model parameters.
* `EmailForm.test.tsx`: Form rendering, accessible labels, mode toggling, and validation alerts.
* `EmailResult.test.tsx`: Output card rendering, clipboard copy handlers, and live status feedback.
* `components.test.tsx`: Header navigation, hero CTA, quality audit panels, and error boundaries.
* `integration-flow.test.tsx`: End-to-end integration tests covering both Happy Path generation and Resilience/Retry failure paths.

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **Gemini API Key:** Obtain an API key from [Google AI Studio](https://aistudio.google.com/).

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/smartmail-ai.git
   cd smartmail-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Production Build

To build the application for production:

```bash
npm run build
npm start
```

---

## ☁️ Vercel Deployment

SmartMail AI is optimized for deployment on Vercel:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com/new).
3. In Project Settings, navigate to **Environment Variables** and add:
   * **Key:** `GEMINI_API_KEY`
   * **Value:** `your_gemini_api_key`
4. Click **Deploy**. Vercel will automatically run `npm run build` and launch your project.

---

## 🔄 Rollback Plan

If a production issue occurs after deployment:

1. **Vercel Instant Rollback:**
   * Go to the Vercel Project Dashboard -> **Deployments** tab.
   * Locate the last known stable deployment and click **Promote to Production**.
2. **Git Revert Rollback:**
   * Revert the problematic commit locally: `git revert HEAD`.
   * Push the revert commit to main: `git push origin main`.

---

## ⚠️ Known Limitations

* **Rate Limits:** Free-tier Gemini API keys are subject to Google's rate limits (15 Requests Per Minute). Rate limit errors are mapped to user-friendly retry banners (`HTTP 429`).
* **Non-Deterministic Formatting:** While Zod schema validation guarantees required JSON fields, word choice variations can occur naturally in LLM outputs.

---

## 🔮 Future Improvements

* **Multi-Language Support:** Email drafting in Spanish, French, German, and Mandarin.
* **Custom Template Library:** User-saved templates for recurring academic and corporate inquiries.
* **Browser Extension:** Chrome extension to trigger SmartMail AI directly inside Gmail and Outlook Web.
