# AGENTS.md — HairLab

## Project overview
HairLab is a personalized AI-assisted web application for exploring hairstyles and hair colors, learning haircutting and coloring techniques, and tracking hair transformations. Users can upload a photo, describe their current hair color and condition, receive personalized suggestions, try looks on their photo, save favorites, compare options, and invite friends to vote without registering.

This document provides instructions for coding agents working in this repository. Follow existing code and user requirements over assumptions. Do not represent planned features as already implemented.

## Repository layout
The currently reported structure is:

```text
Hairlab/
├── index.html       # Main entry page
├── 404.html         # Not-found page
├── CNAME            # Custom domain configuration
├── README.md        # Project documentation
├── AGENTS.md        # Agent instructions (this file)
├── css/             # Stylesheets
└── js/              # JavaScript
```

The project appears to use a static site layout. Inspect actual files before modifying them. Do not assume a framework, bundler, backend, database, authentication system, API client, or test runner exists. Introduce new dependencies or infrastructure only when required and justified.

## Product capabilities and goals
The intended product includes:

1. **Hair profile:** photo upload plus self-reported natural/current color, hair length, texture, condition, dye history, and user goals.
2. **Personalized recommendations:** practical hair colors and cuts based on the profile, preferences, and potentially achievable results.
3. **AI preference learning:** allow users to like, dislike, save, or dismiss suggestions; use feedback to improve future recommendations.
4. **Virtual try-on:** preview selected hairstyles/colors on a user's photo; clearly identify AI-generated simulations.
5. **Learning modules:** brief, interactive lessons on color theory, haircutting, dye mixing, hair health, and aftercare, with quizzes or exercises where helpful.
6. **Saved looks:** maintain a collection of favorites and user-selected variations.
7. **Transformation timeline:** photos and notes about before-and-after changes, with user control over retention and removal.
8. **Comparison and voting:** compare multiple looks, share a link, and let invited friends vote without requiring an account.

Implement features incrementally. If a task requires infrastructure not present in the repository, explain the dependency and propose the smallest viable implementation.

## Working principles
- Read `README.md`, relevant HTML/CSS/JS files, and any applicable nested `AGENTS.md` before editing.
- Make targeted changes; preserve existing behavior, design language, URLs, and conventions.
- Prefer simple, maintainable vanilla HTML, CSS, and JavaScript unless the repository already establishes another stack.
- Keep presentation, state management, API access, and data validation reasonably separated.
- Avoid unnecessary libraries, broad rewrites, speculative abstractions, and unrelated formatting changes.
- Use descriptive names, small functions, and comments explaining non-obvious decisions rather than obvious syntax.
- Keep the site functional on mobile and desktop, and support keyboard navigation and accessible interactions.
- Do not modify or remove `CNAME` without an explicit deployment-related request.

## Visual design system (required)
HairLab must use a **soft pastel aesthetic with black and pink as its primary brand colors**. Treat these rules as the default for every new page, component, and redesign, while keeping readability and usability first.

### Color palette
Use CSS custom properties for reusable design tokens. Suggested starting values (adjust only to maintain consistent contrast and the existing brand):

```css
:root {
  --color-black: #19171B;
  --color-pink: #ee4d86;
  --color-pink-soft: #F8DCE8;
  --color-pink-pale: #FFF0F6;
  --color-background: #FFF9FC;
  --color-surface: #FFFFFF;
  --color-text: #19171B;
  --color-text-muted: #625B61;
  --color-border: #EBD8E2;
  --color-focus: #A92F68;
}
```

- **Black / near-black:** headings, primary text, icons, and strong visual accents.
- **Pink:** brand highlights, active states, selected looks, and carefully used calls to action.
- **Pastel blush and off-white:** backgrounds, surfaces, cards, and subtle section differentiation.
- Avoid neon pink, harsh gradients, oversaturated accents, and large solid black backgrounds unless specifically requested.
- Keep pink accents restrained so the interface feels elegant, modern, welcoming, and beauty-focused—not visually noisy.

### Components and interaction
- Favor generous whitespace, soft corners, subtle borders or shadows, and consistent spacing.
- Use dark text on light pastel surfaces for reading. Check WCAG AA contrast: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries.
- Do **not** rely on pale pink alone for small text, button labels, or critical status indicators; use an accessible dark foreground or a darker pink where necessary.
- Give primary buttons clear contrast, comfortable touch targets, and visible hover, focus, active, and disabled states.
- Apply the same palette to course cards, recommendation cards, photo previews, saved looks, comparison screens, voting results, dialogs, and empty/error states.
- Keep typography legible and contemporary; prefer a cohesive, restrained type scale over decorative fonts for body text.
- Ensure pastel styling works on narrow screens and does not compromise forms, photos, or interactive controls.
- Store theme values centrally rather than scattering unrelated hex colors across stylesheets.

## Frontend requirements
- Use semantic HTML with appropriate headings, labels, buttons, and form controls.
- Make photo uploads clear and accessible; validate file types and enforce reasonable size limits.
- Use responsive CSS, visible focus indicators, readable contrast, and appropriate alt text.
- Avoid inline JavaScript handlers where event listeners are practical.
- Treat user-provided strings as untrusted; render them with safe DOM APIs such as `textContent`, not unsanitized `innerHTML`.
- Provide understandable loading, empty, success, and error states for asynchronous actions.
- Keep UI language consistent with the existing interface; do not translate the UI merely because this document is written in English.

## AI integration
- GPT, Claude, or another model may provide explanations, recommendations, and conversational guidance, but model output is not guaranteed to be correct.
- **Never put secret API keys in public HTML, JavaScript, commits, or client-side environment variables.** Calls requiring private credentials must go through a trusted backend or serverless endpoint.
- For a static-only prototype, use clearly marked mock data or an explicit integration placeholder rather than exposing keys.
- Request only the profile fields needed for a recommendation. Send photos to external providers only after clear user consent.
- Validate and constrain structured model responses before using them in the UI; handle failures, timeouts, and rate limits.
- Do not claim the model can accurately diagnose hair or scalp health, guarantee color results, or infer hair history solely from a photograph.
- Distinguish recommendations and generated previews from professional advice or guaranteed outcomes.

## Hair coloring and education safety
- Account for prior bleaching, permanent dye, hair damage, and other user-reported constraints when proposing changes.
- Explain that achievable results vary with the starting color, previous treatments, hair condition, products, and technique.
- Do not present exact chemical mixing ratios, processing times, or developer strengths as universally safe. When relevant, refer users to product manufacturer instructions and trained professionals.
- Encourage patch/strand testing according to product instructions and professional help for complex or high-risk transformations.
- Avoid medical diagnoses. For significant scalp irritation, injury, or unusual hair loss, recommend qualified medical advice.

## Photos, privacy, and data handling
- Treat face photographs, hair history, and transformation timelines as sensitive user content.
- Obtain explicit consent before uploads, remote AI processing, public sharing, or retaining images.
- Prefer client-side handling when practical; minimize data transmission and storage.
- Do not log photos, personal details, access tokens, or raw API responses containing sensitive content.
- Provide clear deletion controls for saved photos, looks, and timeline entries when storage is implemented.
- Never assume a generated share link is private: design access rules and expiry/revocation controls when adding a backend.
- Do not use user images for training or unrelated processing without informed permission.

## Shared comparisons and voting
- Visitors must be able to view a shared comparison and vote without signing up, as required by the product vision.
- Avoid putting private images or sensitive profile fields into openly accessible links by default.
- If voting is implemented with a backend, validate votes server-side and consider rate limits and basic abuse prevention without requiring accounts.
- Clearly show whether a vote was recorded and handle duplicate or expired links gracefully.
- A static page alone cannot provide trustworthy cross-device vote aggregation; document any server-side or hosted-storage requirement instead of simulating persistent global results.

## Data and implementation architecture
- Define explicit data structures for profiles, styles, recommendations, favorites, lessons, timeline entries, comparisons, and votes before persisting them.
- Prefer stable IDs and versionable schema fields; validate imported or stored data.
- Keep browser storage limited to suitable non-sensitive prototype data. Do not treat `localStorage` as secure private storage.
- Make API boundaries replaceable so a backend or model provider can be changed later without rewriting the entire UI.
- Clearly label prototype, local-only, and production-ready functionality in documentation.

## Verification checklist
Before completing a change:
1. Confirm the intended page loads and that navigation still works.
2. Check desktop and narrow mobile layouts.
3. Test the affected flow, including invalid inputs, missing files, and error states.
4. Verify keyboard use, labels, and visible focus for modified controls.
5. Inspect browser console errors if browser tools are available.
6. Run existing tests, linters, or build commands if the repository defines them; do not invent passing test results.
7. Review for exposed secrets, unsafe DOM insertion, unwanted external image uploads, and unintended data sharing.
8. Update `README.md` when behavior, setup, external services, or deployment steps change.

## Agent handoff format
When reporting completed work, briefly state:
- What changed and which files were edited.
- How to run or manually verify the change.
- Which checks were actually performed and their results.
- Any limitations, missing credentials, backend requirements, or follow-up work.

Do not claim a feature is complete unless it is implemented and verified to the extent available.
