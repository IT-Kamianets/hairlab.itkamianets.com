# HairLab

**A foundation for personalized hair inspiration, learning, and transformation tracking.**

HairLab aims to help people explore hairstyles and hair colors, understand hair care and coloring techniques, and make informed choices about their next look. The product vision combines a user-provided hair profile with AI-assisted recommendations, virtual previews, and feedback from friends.

> **Project status: initial static scaffold.** The repository does not yet implement the product features described below. Both HTML pages have empty bodies, and the CSS and JavaScript files are empty.

## Current implementation

The repository currently provides:

- An `index.html` entry point with HTML5 markup, an English language declaration, UTF-8 encoding, and a responsive viewport meta tag.
- A `404.html` scaffold with the same basic markup. It does not yet display a not-found message.
- Placeholder files for styles, theme variables, and JavaScript. These files are not yet linked from either HTML page.
- A `CNAME` file containing `hairlab.itkamianets.com` for custom-domain configuration. Its presence alone does not confirm a live deployment or working DNS configuration.
- Development and product guidelines in [AGENTS.md](AGENTS.md).

There is no visible application interface, navigation, photo handling, AI integration, data persistence, authentication, or backend. Both pages currently use the placeholder title `Document`.

## Planned capabilities

The following capabilities are product goals, **not available features**:

| Capability | Intended experience |
| --- | --- |
| Hair profile | Add a photo and self-reported natural/current color, length, texture, condition, dye history, and goals. |
| Personalized recommendations | Explore cuts and colors informed by the profile, preferences, and practical constraints. |
| Preference learning | Like, dislike, save, or dismiss suggestions to help improve future recommendations. |
| Virtual try-on | Preview selected styles and colors on a photo, with generated simulations clearly labeled. |
| Learning modules | Learn about color theory, haircutting, coloring, hair health, and aftercare through short lessons and exercises. |
| Saved looks | Collect favorite looks and selected variations. |
| Transformation timeline | Keep photos and notes about changes, with control over retention and deletion. |
| Comparison and voting | Compare looks and invite friends to vote through a shared link without registering. |

Recommendations and simulated previews are intended to support exploration, not guarantee results or replace professional advice.

## Technology

The project uses a simple static-site structure:

| Technology | Current role |
| --- | --- |
| HTML5 | Basic document scaffolds for the entry and not-found pages. |
| CSS | Empty files reserved for styling and shared design tokens. |
| Vanilla JavaScript | An empty file reserved for browser interactions. |

No framework, package manifest, external dependency, bundler, API client, database, automated test suite, or lint configuration is included. No installation or build step is required to view the current pages.

## Repository structure

```text
Hairlab/
├── .gitignore          # Empty placeholder for Git ignore rules
├── AGENTS.md           # Repository instructions and product guidelines
├── README.md           # Project overview and local setup
├── CNAME               # Custom domain: hairlab.itkamianets.com
├── index.html          # Main page scaffold; empty body
├── 404.html            # Not-found page scaffold; empty body
├── css/
│   ├── style.css       # Empty stylesheet placeholder
│   └── variable.css    # Empty theme-variable placeholder
└── js/
    └── script.js       # Empty JavaScript placeholder
```

## Run locally

### Open the HTML directly

Open `index.html` in a modern web browser. This requires no additional software or configuration.

**Expected result:** a blank page with the browser tab title `HairLab.itkamianets`. This reflects the current scaffold, not a setup failure.

### Use a local HTTP server

If Python 3 is installed, run this command from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

- [Main page](http://127.0.0.1:8000/)
- [Not-found page scaffold](http://127.0.0.1:8000/404.html)

Stop the server with `Ctrl+C`. Python is only an optional local serving tool; it is not an application dependency.

The Python server does not automatically serve the custom `404.html` for missing URLs. Custom error-page routing depends on the hosting platform.

## Design direction

The required design direction is a soft pastel aesthetic with **near-black and pink as the primary brand colors**, supported by blush and off-white surfaces. This visual system is specified in `AGENTS.md` but has not yet been implemented.

Future interfaces should use centralized CSS custom properties, generous spacing, soft corners, readable typography, and restrained pink accents. Responsive layouts, semantic controls, visible keyboard focus, and WCAG AA contrast are part of the development requirements.

## Development roadmap

The following is a proposed incremental path, without committed release dates:

1. **Build the interface foundation.** Add the shared design tokens, responsive page layout, navigation, accessible controls, and meaningful not-found content.
2. **Introduce a local profile prototype.** Add validated photo selection and essential hair-profile fields, with clear consent and deletion controls. Define versioned data structures before persisting user content.
3. **Prototype exploration and learning.** Add clearly labeled sample recommendations, preference controls, saved looks, and learning modules. Distinguish local-only behavior from connected services.
4. **Integrate AI through a trusted service.** Add a backend or serverless boundary for private credentials, validate model responses, and handle loading, errors, timeouts, and rate limits. Obtain explicit consent before sending photos to external providers.
5. **Add transformation tracking and sharing.** Implement photo retention controls, comparisons, and guest voting with appropriate storage, access rules, link expiry or revocation, and server-side vote validation.

Trustworthy voting across devices requires a backend or hosted storage; static files alone cannot provide shared vote aggregation. No AI provider, storage service, or backend is currently configured.

## Privacy and responsible guidance

Future photo and AI features must follow the requirements in `AGENTS.md`:

- Treat face photos and hair history as sensitive content; obtain explicit consent for uploads, remote processing, retention, and public sharing.
- Prefer client-side processing where practical and provide deletion controls when storage is introduced. Browser `localStorage` is not secure private storage.
- Keep secret API keys out of public HTML, JavaScript, and client-side configuration. Private credentials belong behind a trusted backend boundary.
- Clearly label generated previews and account for self-reported treatments and damage when recommending changes. Do not infer hair history solely from a photograph or claim to diagnose scalp conditions.
- Avoid universal chemical mixing or processing instructions. Refer to manufacturer guidance, appropriate patch/strand testing, and professional help for complex transformations.

These are implementation requirements, not claims that such features or safeguards are already built.

## Working on the project

Read [AGENTS.md](AGENTS.md) before making changes. Prefer targeted, maintainable HTML, CSS, and JavaScript updates, and introduce dependencies only when justified. Preserve `CNAME` unless a deployment change is explicitly requested.

There are currently no automated test, lint, or build commands. For future interface changes, manually verify page loading and navigation, desktop and narrow mobile layouts, keyboard access, form validation, relevant error states, and browser console output. Update this README as functionality and setup requirements change.
