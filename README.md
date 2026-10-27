# HairLab

A responsive, local-first hair inspiration and learning app built with vanilla HTML, CSS, and JavaScript. Compatible with GitHub Pages; no build step, runtime dependencies, accounts, or API keys are required. The existing custom-domain `CNAME` is unchanged.

## What works

- **Languages and themes:** Ukrainian and English across navigation, catalog, forms, lessons, quizzes, privacy notices, and status messages. Switch languages without clearing inputs or selected photos. Light, dark, and system themes persist independently in `hairlab.display.v1`; first visit follows browser language and OS theme.
- **Homepage:** pastel pink-and-black design, original vector hairstyle illustrations, course previews, and navigation. Initial entry and return to Home start at the hero rather than restoring a mid-page scroll position.
- **Lookbook:** eight illustrated styles, search, length/texture filters, six color swatches, favorites, and comparison selection.
- **Hair assistant:** natural/current color, texture, desired length, condition, dye history, goals, preferred styles, and optional local portrait. Transparent rule-based catalog matching uses local likes/dislikes and offers condition/history cautions. This is **not AI** and does not analyze photos.
- **Look studio:** consented, temporary original-photo preview and a separate style/color illustration. Style and color can be saved separately. **No image transformation or transformed-image download is implemented.**
- **Collection:** saved looks, three boards, favorite colors, removal, and comparison shortcuts.
- **Academy:** five courses, ten short lessons, visual learning materials, answer feedback, and persistent completion progress. Only correct answers complete lessons.
- **My journey:** dates, notes, and optional before/after photos stored in IndexedDB after explicit consent. Individual entries or the entire journal can be deleted.
- **Comparison:** up to three catalog looks side by side; consented share links include only catalog IDs. Anyone can open these without signing in. **No shared voting, vote counts, expiry, or revocation is implemented.**
- **Privacy controls:** separate resets for preferences/progress and journal photos. Upload validation restricts images to JPEG/PNG/WebP, at most 5 MB each, and verifies browser decoding.

All displayed looks are illustrations, not generated transformations or guaranteed real-world results.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [HairLab](http://127.0.0.1:8000/). Stop with Ctrl+C. Use HTTP rather than opening `index.html` as a file: browsers restrict ES modules under `file://`.

GitHub Pages can serve the repository root directly. Hash routes such as `/#learn/color/0` work without rewrite rules. `404.html` uses root-relative links for the existing custom-domain deployment. The Python server does not automatically use this custom error page; open `/404.html` directly to inspect it. No deployment has been performed as part of this implementation.

## Verification

Node 18+ is sufficient for dependency-free checks (no `npm install` needed):

```sh
npm test
npm run check
```

Automated tests cover catalog consistency, profile ranking and treatment cautions, stored-state validation, corrupted/blocked storage recovery, journal schema validation, upload input rejection, and unavailable backend behavior. Syntax checks cover all app modules.

Manual browser checklist:

1. Check homepage and navigation at desktop, tablet, and 390px mobile widths. Tab through links/forms and verify the skip link and visible focus. Enable reduced motion in your OS to check animation preferences.
2. Search/filter looks, save/remove a favorite and color, assign a board, reload, and check persistence. A fourth comparison choice must be rejected.
3. Submit different assistant profiles, including previous bleaching or damaged hair. Like/dislike a result and rerun the guide. Photos must never affect recommendations.
4. Without consent, photo inputs must be disabled. Test valid photos, corrupt images, unsupported types, oversized files, removal, and consent withdrawal. The studio must keep the portrait unchanged.
5. Answer a quiz incorrectly, then correctly; reload to verify completion. Open another lesson and course.
6. Save a journal entry with/without photos after consenting; reload, inspect before/after images, and delete it. Notes containing HTML must display as text. Try saving without a title or consent.
7. Choose two or three looks, consent to sharing, open the generated link in another tab, and verify only catalog IDs are in the URL. Invalid IDs must be ignored. Voting must be clearly unavailable.
8. Test an invalid route and `/404.html`. Check developer console errors. Block storage to verify useful recovery messages; never use real personal photos for testing.

## Architecture and files

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic app shell, navigation, module entry point |
| `404.html` | Styled not-found page |
| `css/variable.css` | Central brand, contrast, and surface tokens |
| `css/style.css` | Responsive layout, components, focus, reduced motion |
| `assets/mark.svg` | Local brand icon |
| `js/preferences.js` | Early theme/language preferences without a light-theme flash |
| `js/i18n.js`, `js/locales/uk.js` | Local phrase catalog, dynamic labels, and in-place translation |
| `js/not-found.js` | Language/theme support on the 404 page |
| `js/script.js` | Hash routing, page views, event handlers, consent flows |
| `js/data.js` | Catalog, colors, course content, deterministic matching |
| `js/media.js` | Image validation and original vector style illustrations |
| `js/storage.js` | Versioned local state validation and IndexedDB journal |
| `js/api.js` | Explicit unavailable service boundaries, no network requests |
| `tests/core.test.js` | Dependency-free logic/validation tests |
| `docs/integrations.md` | Data contracts and proposed backend plan |
| `package.json` | Optional test/check commands; no dependencies |

## Privacy and storage limits

- `localStorage['hairlab.v1']` retains catalog IDs, board assignments, feedback, and lesson completion. Unknown IDs/versions are discarded when read.
- IndexedDB `hairlab-journal`, version 1, stores consented entries and image blobs in `entries`. Records are validated on write and read.
- Profiles and temporary portrait previews are not persisted. Object URLs are revoked when removed or when navigating away.
- Neither storage mechanism is encrypted or cloud-synchronized. Shared browser profiles can expose saved data; clearing site data can remove it permanently. There is no backup/export feature yet.
- No analytics, external imagery/fonts, remote AI calls, or photo uploads occur. Only local app assets load. Browser quota/access failures produce errors or a session-only preference fallback.
- Catalog comparison URLs are public choices, not private or revocable links. They never include photos, notes, or profiles.

## Next development steps

1. Obtain editorial review from a qualified hair professional and expand the catalog with licensed reference imagery.
2. Add a trusted backend for authenticated private storage and a secure API proxy; implement the consent, validation, error, and deletion contracts in [the integration plan](docs/integrations.md).
3. Connect a supported image-transformation service, label generated simulations, and enable compare/download only after valid returned images exist.
4. Implement shared comparisons and anonymous guest voting with server-side validation, rate limits, expiry/revocation, and abuse monitoring.
5. Add automated browser coverage, more assistive-technology testing, encrypted storage/backup options, and cross-device sync before representing the app as production-ready.

## Localization and display checks

Switch English ↔ Українська on the homepage, assistant, lesson, and journal pages; verify that inputs, selected photos, and user-written notes do not change. Search the catalog in either language. Reload with each theme and verify saved settings, then select System to follow OS theme changes. At 390px and desktop widths, enter the homepage after scrolling down and verify the hero starts at the top.

English source phrases are stable translation keys in `js/locales/uk.js`. `js/i18n.js` translates text/accessible attributes in place and retains original text for language switching; it does not re-render forms or change data IDs. User-generated journal content is explicitly marked `translate="no"`; input values and filenames are never translated. New catalog/course phrases need dictionary entries (covered by tests). New languages need a catalog, registration in the translator/bootstrap, and a language option. Browser-native file pickers and validation messages follow the browser/OS language. Display preferences are separate from collection/progress reset.
