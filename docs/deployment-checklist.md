# SmartMail AI — Production Deployment Checklist

This document details the production deployment checklist for SmartMail AI, covering pre-deployment verifications, security, accessibility, and post-deployment rollback procedures.

---

## 1. Code Quality

- [x] **production build passes:** Verified zero compilation or bundle errors via `npm run build` (`next build`).
- [x] **lint passes:** Verified clean static analysis with zero ESLint warnings or errors via `npm run lint`.
- [x] **TypeScript Strict Mode:** Verified zero `any` escapes or implicit type coercion across all components and API handlers.
- [x] **Server Component Isolation:** Verified `import "server-only";` guard in `src/lib/gemini.ts` to prevent client-side leaks.

---

## 2. Security

- [x] **API key secured:** `GEMINI_API_KEY` read strictly from server environment (`process.env.GEMINI_API_KEY`). Never exposed via `NEXT_PUBLIC_`.
- [x] **.env.local not committed:** Verified `.gitignore` contains `.env*` rules; `.env.local` is excluded from git tracking.
- [x] **Input & Output Schema Validation:** Server-side request and response payloads validated using Zod schemas (`smartMailRequestSchema`, `smartMailResponseSchema`).
- [x] **XSS Prevention:** Zero usage of `dangerouslySetInnerHTML`; all text rendered safely via React JSX expressions.

---

## 3. Testing

- [x] **tests pass:** All 22 unit and integration tests passing across 6 test files (`npx vitest run`).
- [x] **coverage reviewed:** Verified statement coverage across schema, validation, component, and flow layers (`npm run test -- --coverage`).
- [x] **AI generation tested:** End-to-end generation flow tested in `integration-flow.test.tsx`.
- [x] **improve mode tested:** Draft polishing mode and state transitions verified in `EmailForm.test.tsx` and `components.test.tsx`.
- [x] **error states tested:** API failure, invalid payload, rate limiting, and retry mechanisms verified in `integration-flow.test.tsx` and `ErrorMessage.test.tsx`.

---

## 4. Accessibility

- [x] **accessibility audit completed:** Automated & manual WCAG 2.1 AA audit completed. Color contrast ratio across all badge and body text meets/exceeds 4.5:1 against light background surfaces.
- [x] **ARIA Navigation & Semantics:** Roving tab index for `ModeSelector`, explicit form `<label>` associations, and dynamic `aria-live` announcements (`role="status"`, `role="alert"`).
- [x] **Reduced Motion Support:** CSS media queries respect `prefers-reduced-motion: reduce` with `motion-reduce:animate-none` fallbacks.
- [ ] **mobile testing completed:** Responsive layout verified in browser developer tools; live touch-target and viewport testing on physical mobile hardware pending production URL release.

---

## 5. Performance

- [x] **Bundle Size Optimization:** First Load JS bundle optimized to ~95 kB.
- [x] **Font & Asset Optimization:** Google Fonts (`Newsreader`, `Plus_Jakarta_Sans`) loaded via `next/font/google` with `display: "swap"`. Local SVG graphics configured with fixed layout dimensions.
- [ ] **Lighthouse audit completed:** Local synthetic metrics verified; formal Lighthouse audit on live deployed production URL pending Vercel deployment.

---

## 6. Production Deployment

- [x] **Vercel Build Command Configured:** Set to `npm run build` (`next build`).
- [x] **Environment Variables Injected:** `GEMINI_API_KEY` configured in Vercel Project Settings.
- [ ] **production URL tested:** Live domain deployment and production URL verification pending final release trigger.

---

## 7. Error Handling

- [x] **HTTP Error Status Mapping:**
  - `400 Bad Request`: Validation failure or empty input payload.
  - `429 Too Many Requests`: API rate limiting or quota exhaustion.
  - `500 Internal Server Error`: Schema parsing failure or server configuration error.
  - `503 Service Unavailable`: Unreachable Gemini API service.
  - `504 Gateway Timeout`: Execution exceeding timeout threshold.
- [x] **Application Error Boundary:** Global React fallback boundary implemented at `src/app/error.tsx`.
- [x] **Form Input Preservation:** Form state retained during submission failures to prevent user data loss.

---

## 8. Rollback

- [x] **Rollback Strategy Documented:** Standard operating procedure established for instant production deployment reversion.

### Vercel Deployment History Rollback Procedure

If a production release introduces critical errors or unexpected runtime behavior, execute the following rollback procedure:

1. **Access Vercel Dashboard:**
   - Log in to [Vercel](https://vercel.com) and navigate to the **SmartMail AI** project dashboard.

2. **Open Deployment History:**
   - Click the **Deployments** tab to view the reverse-chronological list of all production and preview deployments.

3. **Identify Target Stable Build:**
   - Locate the most recent deployment prior to the broken release that successfully passed all checklist items.

4. **Promote Build to Production:**
   - Click the **`...`** (more options) button adjacent to the selected stable deployment.
   - Select **Promote to Production**.
   - Confirm the promotion in the modal dialog. Vercel will instantly route live traffic to the target build with zero downtime.

5. **CLI Alternative (Fast Rollback):**
   ```bash
   # Rollback to the previous production deployment via Vercel CLI
   vercel rollback
   ```

6. **Post-Rollback Recovery:**
   - Revert the faulty commit in Git:
     ```bash
     git revert <failing-commit-hash>
     git push origin main
     ```
   - Investigate root cause, fix locally, re-verify `npm run build` and `npm test`, and create a new deployment.
