# SmartMail AI

> **Live Demo:** [LIVE_URL_PLACEHOLDER]  
> **GitHub Repository:** [GITHUB_URL_PLACEHOLDER]

SmartMail AI is an intelligent email composition and auditing application designed to turn raw thoughts, context, or rough drafts into polished, high-impact professional emails. Built with an editorial paper-stationery design system, SmartMail AI combines automated email drafting with real-time quality analytics.

---

## Project Overview

Writing high-stakes professional emails—such as contacting a university professor for research opportunities, appealing a grade, following up with a recruiter, or sending an executive status update—frequently causes anxiety and friction. Writers struggle to:
- Balance formal respect with natural warmth.
- Express complex requests concisely without sounding demanding or timid.
- Ensure their tone, grammar, and structure conform to institutional and professional expectations.

Generic AI writing tools often produce sterile, hyper-formal corporate boilerplate presented in generic dark-mode SaaS dashboards. **SmartMail AI** solves this problem by providing structured, context-aware email drafting paired with an instant quality audit panel in an inviting, tactile stationery interface.

---

## Features

- **Generate Professional Emails:** Transforms key details, recipient roles, primary purpose, and tone preferences into structured professional email drafts with bracketed placeholder tokens (`[Recipient's Name]`, `[Date]`).
- **Improve Existing Drafts:** Refines sentence structure, grammar, word choice, and overall impact of existing email drafts while preserving the original intent.
- **AI Tone Analysis:** Detects and classifies the prevailing emotional and professional tone of the generated message (e.g., *Professional & Courteous*, *Direct & Persuasive*).
- **Professionalism Score:** Provides a numerical rating (0–100) assessing compliance with professional etiquette and formatting standards.
- **Clarity Score:** Measures readability, conciseness, and message flow on a 0–100 scale.
- **Actionable Suggestions:** Provides specific advice for further manual tweaking or situational customization.
- **Improvements Made:** Highlights specific sentence-level or structural enhancements applied during draft refinement.
- **One-Click Copy Functionality:** Allows users to independently copy the Subject Line, Email Body, or Full Dispatch to their clipboard with screen reader accessible feedback.

---

## Tech Stack

| Technology | Purpose & Rationale |
| :--- | :--- |
| **Next.js 16 (App Router)** | Full-stack React framework enabling serverless API routes, server component rendering, fast page loads, and built-in Turbopack builds. |
| **React 19 & TypeScript 5** | Modern declarative UI component model with strict static typing to eliminate runtime reference errors and enforce data contracts. |
| **Tailwind CSS v4** | Utility-first design system with CSS custom properties (`@theme`) for consistent paper typography, spacing, and high-contrast color tokens. |
| **Google Gemini API (`@google/genai`)** | Official Google GenAI SDK powering fast, high-reasoning email generation and structured JSON output. |
| **Zod** | TypeScript-first schema validation ensuring strict validation of client requests and server-side parsing of LLM JSON responses. |
| **Vitest & React Testing Library** | Next-generation unit and component integration testing framework with jsdom environment simulation. |

---

## Architecture

### End-to-End Data Flow

```
Browser (User Input)
   │
   ▼
Next.js Frontend (React 19 Component State)
   │
   ▼ POST /api/generate-email (Validated via Zod smartMailRequestSchema)
Next.js API Route Server Handler
   │
   ▼ Official @google/genai SDK (Server-Only Execution)
Google Gemini Model (System Prompt & Json Output Mode)
   │
   ▼ Raw JSON String Response
Zod Output Validation (smartMailResponseSchema safeParse)
   │
   ▼ Sanitized JSON Response (HTTP 200)
Frontend Result Presentation (EmailResult & AnalysisPanel)
```

### Folder & Directory Structure

- `src/app/`: Next.js App Router root containing page layouts, global styling (`globals.css`), error boundaries (`error.tsx`), and server API routes (`api/generate-email/route.ts`).
- `src/components/`: Modular React components separating UI concerns:
  - `Header.tsx`: Application title, postmark badge, and branding navigation.
  - `HeroSection.tsx`: Landing banner, micro-feature list, and stationery preview composition.
  - `ModeSelector.tsx`: WAI-ARIA compliant tabbed navigation toggling between *Generate Email* and *Improve Draft* modes.
  - `EmailForm.tsx`: Context-aware input form with validation, dropdown selectors, and submission state management.
  - `LoadingState.tsx`: Accessible loading indicator with animated paper plane and status announcements.
  - `EmailResult.tsx`: Output presentation card displaying subject line, email body, and copy controls.
  - `AnalysisPanel.tsx`: Quality audit breakdown containing Professionalism and Clarity metrics, tone detection, and suggestions.
  - `ErrorMessage.tsx`: Accessible error banner (`role="alert"`) with retry callback triggers.
- `src/lib/`: Core server utilities:
  - `gemini.ts`: Server-only Gemini client initialization (`import "server-only"`), prompt construction, model call Execution Timeout Promise guards, and response parsing.
  - `validations.ts`: Zod schema definitions for client requests and LLM JSON outputs.
- `src/types/`: TypeScript interfaces and type aliases for request/response contracts.
- `src/__tests__/`: Unit, component, and end-to-end integration test suites.

---

## AI Integration

### Selection of Google Gemini
Google Gemini was selected for its exceptional instruction-following capability, low latency, cost-efficiency, and native support for structured JSON schema outputs (`responseMimeType: "application/json"`).

### Meaningful AI Usage
Rather than operating as a basic text auto-completer, SmartMail AI acts as an analytical communication assistant. It performs dual tasks in a single invocation: drafting/refining the message body and conducting a multi-dimensional quality audit (evaluating clarity, formality, actionable suggestions, and sentence improvements).

### Prompt Engineering & Structured Output
Prompts are structured with strict system persona rules and anti-hallucination constraints:
1. **System Persona:** Configured as an expert academic and executive communication coach.
2. **Factual Integrity:** Enforces zero-hallucination rules—never invent unstated recipient details, dates, or credentials. Unspecified variables are formatted as bracketed tokens (e.g., `[Professor's Last Name]`).
3. **JSON Response Contract:** Enforced via Gemini `responseMimeType: "application/json"`. The model returns structured data strictly adhering to this schema:
   ```json
   {
     "subject": "Concise, descriptive subject line",
     "email": "Formatted message body",
     "tone": "Detected tone label",
     "professionalismScore": 95,
     "clarityScore": 90,
     "suggestions": ["Actionable advice for tweaking"],
     "improvements": ["Key enhancement made to draft"]
   }
   ```

### Output Validation & Failure Recovery
1. **Sanitization:** Markdown code fences (e.g., ````json ... ````) are stripped prior to JSON parsing.
2. **Schema Enforcement:** The parsed object is validated via Zod's `smartMailResponseSchema.safeParse()`.
3. **Fallback Handling:** If JSON parsing fails or schema validation fails, the server catches the exception and returns a structured `HTTP 500` error response, preventing malformed AI output from corrupting the UI.

---

## Security

- **Server-Only Isolation:** The Gemini API client factory in `src/lib/gemini.ts` utilizes the `import "server-only";` directive. This guarantees that API SDK calls and secrets are never bundled into client-side JavaScript.
- **Environment Variable Protection:** `GEMINI_API_KEY` is loaded exclusively from `process.env.GEMINI_API_KEY` on the server. It is **never** prefixed with `NEXT_PUBLIC_`.
- **Git Exclusion:** The `.gitignore` file includes strict `.env*` rules to prevent committing local environment files to source control.
- **XSS Prevention:** Zero usage of `dangerouslySetInnerHTML`. All LLM text is safely rendered via React JSX text node interpolation.
- **Error Masking:** Client-facing error responses return sanitized messages, preventing the leakage of internal stack traces, API keys, or infrastructure details.

---

## Error Handling

The application implements defense-in-depth error handling across API and component layers:

- **HTTP Status Mapping:**
  - `400 Bad Request`: Returned when input validation fails (e.g., context shorter than 10 characters).
  - `429 Too Many Requests`: Returned when Google API rate limits or quotas are exceeded.
  - `500 Internal Server Error`: Returned when server configuration is missing or JSON parsing fails.
  - `503 Service Unavailable`: Returned when the external Gemini API service is unreachable.
  - `504 Gateway Timeout`: Triggered by a 15-second Promise race guard if the AI generation exceeds acceptable response times.
- **Form State Retention:** If an API call fails, `<EmailForm>` retains the user's input text and selections, preventing frustration or data loss.
- **Accessible Error Banners:** Errors are announced via `ErrorMessage.tsx` using `role="alert"` and `aria-live="assertive"` with built-in "Try Again" retry buttons.
- **React Error Boundary:** Uncaught component rendering errors are caught by `src/app/error.tsx`.

---

## Accessibility

SmartMail AI is designed to conform to **WCAG 2.1 AA standards**:

- **Color Contrast:** High-contrast color palette audited to ensure all text elements (including badges and buttons) meet or exceed the 4.5:1 contrast ratio against background surfaces (`#FAF7F2`, `#FFFFFF`, `#FDF5E6`).
- **Semantic Structure:** Single `<h1>` tag per page with sequential `<h2>`–`<h4>` heading hierarchy.
- **Keyboard Navigation:** Full keyboard accessibility, including arrow-key roving tabindex navigation on the `ModeSelector` tablist.
- **Form Labels:** All inputs and textareas are explicitly linked to corresponding `<label htmlFor="...">` elements.
- **Screen Reader Announcements:** Dynamic state changes utilize `aria-live` regions:
  - Loading states use `role="status"` and `aria-live="polite"`.
  - Clipboard copy operations trigger screen reader announcements (*"Subject copied"*, *"Email copied"*).
  - Validation errors use `role="alert"` and `aria-live="assertive"`.
- **Touch Target Sizes:** Minimum 44x44px interactive touch targets across mobile viewports.
- **Reduced Motion:** Full respect for `@media (prefers-reduced-motion: reduce)` with `motion-reduce:animate-none` CSS fallbacks.
- **Audit Results:** `[ACCESSIBILITY_AUDIT_RESULT_PLACEHOLDER]`

---

## Testing

The codebase includes unit, schema, component, and end-to-end integration test coverage using Vitest and React Testing Library:

- `validations.test.ts`: Zod schema validation logic for inputs and outputs.
- `gemini.test.ts`: Gemini service factory and client configuration.
- `EmailForm.test.tsx`: Form rendering, mode switching, accessible labels, and validation alerts.
- `EmailResult.test.tsx`: Output card rendering, clipboard copy handlers, and live status feedback.
- `components.test.tsx`: Tablist navigation, header CTA, error banners, and UI elements.
- `integration-flow.test.tsx`: End-to-end integration tests covering full generation flow and error recovery paths.

### Test Execution & Coverage Summary
- **Total Tests:** `[TEST_COUNT_PLACEHOLDER]`
- **Code Coverage:** `[COVERAGE_PLACEHOLDER]`

To run test commands:
```bash
# Execute unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## Performance

The application is optimized for fast load times and minimal layout shifts:
- **First Load JS:** Optimized Next.js production build (~95 kB First Load JS).
- **Font Loading:** Google Fonts (`Newsreader` and `Plus Jakarta Sans`) loaded via `next/font/google` with `display: "swap"` to prevent flash of unstyled text (FOUT).
- **Asset Sizing:** Explicit width and height attributes set on image assets to prevent Cumulative Layout Shift (CLS).

### Lighthouse Audit Metrics
- **Performance:** `[LIGHTHOUSE_PERFORMANCE_PLACEHOLDER]`
- **Accessibility:** `[LIGHTHOUSE_ACCESSIBILITY_PLACEHOLDER]`
- **Best Practices:** `[LIGHTHOUSE_BEST_PRACTICES_PLACEHOLDER]`
- **SEO:** `[LIGHTHOUSE_SEO_PLACEHOLDER]`

---

## Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Gemini API Key:** Obtain an API key from [Google AI Studio](https://aistudio.google.com/).

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [GITHUB_URL_PLACEHOLDER]
   cd smartmail-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## Production Build

To test or build the application for production locally:

```bash
# Generate optimized production build
npm run build

# Start production server
npm start
```

---

## Deployment

SmartMail AI is optimized for zero-configuration deployment on Vercel:

1. Push your code repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into your [Vercel Dashboard](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `your_gemini_api_key_here`
4. Click **Deploy**. Vercel will run `npm run build` and provision serverless API endpoints automatically.

---

## Rollback

If a production release introduces issues, restore a previous stable build using Vercel:

1. **Vercel Dashboard Rollback:**
   - Go to your Vercel Project Dashboard -> **Deployments** tab.
   - Locate the last known working production deployment.
   - Click the `...` menu icon next to the deployment and select **Promote to Production**.
2. **Vercel CLI Rollback:**
   ```bash
   vercel rollback
   ```
3. **Git Revert Strategy:**
   ```bash
   git revert <broken-commit-hash>
   git push origin main
   ```

---

## Known Limitations

- **API Rate Limits:** Free-tier Gemini API keys are limited to 15 Requests Per Minute (RPM). Excess requests trigger rate-limit banners (`HTTP 429`).
- **Non-Deterministic Formatting:** While Zod schemas guarantee required JSON properties, phrasing and word choices vary naturally between LLM generations.
- **Network Dependency:** Email generation and analysis require an active internet connection to communicate with Google GenAI endpoints.

---

## Future Improvements

- **Multi-Language Support:** Email generation and draft polishing in Spanish, French, German, and Mandarin.
- **Custom Template Library:** User-saved templates for recurring academic inquiries, job applications, and meeting follow-ups.
- **Browser Extension:** Chrome and Firefox extension to use SmartMail AI directly inside Gmail and Outlook Web.
- **Draft History Storage:** Optional local storage history for previously generated email dispatches.
