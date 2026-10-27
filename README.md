# HairLab ✳

**Your Hair. Your Possibilities.**

HairLab is a responsive web application for exploring hairstyles and hair colors, learning, and tracking personal hair transformations. It features a pastel pink-and-black interface, Ukrainian and English language support, and light and dark themes. The minimum interface text size is 16 px, including labels, buttons, and forms. The application works without registration, a build process, or external dependencies.

> **Current version: Local MVP.** Hairstyle recommendations are based on transparent rules rather than AI. Real AI-powered photo transformations, cloud synchronization, and voting by friends are not yet integrated.

## What You Can Already Do

| Section | Features |
| --- | --- |
| Home | The initial screen contains only navigation and a hero section, with a bright pink background in light mode and dark pink in dark mode. The catalog and courses appear after scrolling. |
| Catalog | 8 illustrated hairstyles, 6 hair colors, search in Ukrainian and English, and filters for hair length and texture. |
| Assistant | Hair profile questionnaire, local catalog-based recommendations, "Like / Not for me" ratings, and warnings related to previous coloring and hair condition. |
| Look Studio | Temporary preview of your own portrait alongside a separate illustration of the selected hairstyle and color. The portrait itself is not modified. |
| Collection | Favorite hairstyles and colors, three themed collections, item removal, and selection for comparison. |
| Academy | 5 courses, 10 short lessons, visual learning materials, quizzes with explanations, and saved learning progress. |
| My History | Dates, notes, before-and-after photos, local storage after consent, and the ability to delete entries. |
| Comparison | Compare up to 3 looks side by side and share links containing public catalog looks without personal photos or notes. |
| Settings | Ukrainian / English; light, dark, or system theme; preferences saved between visits. |

Switching languages does not clear forms or selected photos. Personal notes are not translated. On the first visit, the language is determined by the browser's language: Ukrainian for `uk`, otherwise English. The system theme follows the device settings.

All catalog hairstyles are original vector illustrations intended for inspiration, not AI-generated try-on results or guarantees of actual hair coloring outcomes.

## Technologies and Project Structure

HTML5, CSS custom properties, ES modules, localStorage, and IndexedDB. No framework, bundler, analytics, or external fonts.

```text
Hairlab/
├── index.html              # Application shell and navigation
├── 404.html                # Error page with language and theme support
├── CNAME                   # Existing GitHub Pages custom domain
├── AGENTS.md               # Repository development guidelines
├── README.md
├── package.json            # Testing commands, no dependencies
├── assets/
│   └── hairLab_logo.svg    # Logo in header, footer, and favicon
├── css/
│   ├── variable.css        # Light and dark theme colors
│   └── style.css           # Components and responsive layouts
├── js/
│   ├── script.js           # Pages, routes, and interactions
│   ├── data.js             # Catalog, courses, and recommendation rules
│   ├── media.js            # Photo validation and SVG illustrations
│   ├── storage.js          # Validation and local data storage
│   ├── api.js              # Disabled interfaces for future services
│   ├── preferences.js      # Language and theme before styles load
│   ├── i18n.js             # UI translation without resetting forms
│   ├── not-found.js        # 404 page localization
│   └── locales/uk.js       # Ukrainian translations
├── tests/
│   ├── core.test.js        # Recommendation rules, data, photos, APIs
│   └── display.test.js     # Translations and appearance settings
└── docs/
    └── integrations.md     # Data schemas and server API plan
```

## Data and Privacy

| Data | Storage Location | How to Delete |
| --- | --- | --- |
| Favorites, collections, ratings, comparisons, progress | `localStorage`: `hairlab.v1` | Individually on their respective pages or through "Privacy & Local Data" |
| Language and theme | `localStorage`: `hairlab.display.v1` | Change in the header or clear site data |
| History entries and photos | IndexedDB: `hairlab-journal`, object store `entries` | Delete an individual entry or the entire journal in the privacy section |
| Hair profile and temporary portrait | Current page only | Remove the photo, navigate to another section, or reload |

- Photos are not uploaded to a server. Opening and saving photos require separate, explicit consent.
- Supported formats are JPEG, PNG, and WebP, up to 5 MB per file. File type, size, and image readability are validated.
- Browser storage is not encrypted and is not a backup. Anyone with access to the same browser profile may be able to view the data. Clearing site data may permanently delete it.
- Comparison links contain only catalog identifiers. They are accessible to anyone with the link, do not expire, and cannot be revoked.
- Resetting favorites and progress does not change language or theme preferences. Cloud synchronization and journal export are not currently available.

## Testing

Node.js 18+ is required for automated tests. No `npm install` is necessary.

```sh
npm test
npm run check
```

The tests verify catalog and lesson integrity, preference-aware recommendations, warnings, stored-data validation, recovery from storage errors, rejection of invalid photos, unavailability of unconnected APIs, translation completeness for educational content, and theme/language selection. The `check` command validates module syntax.

Before deployment, verify the following in a browser:

1. The homepage opens with the hero section on mobile and desktop without horizontal scrolling. The benefits strip and subsequent sections begin below the first screen. On devices with shorter screens, the hero may extend beyond the viewport without clipping content.
2. Language and theme changes work and persist after reloading. The system theme responds to OS settings. Switching languages does not modify entered notes or form selections.
3. Search works in both languages, filters function correctly, favorites and collections can be managed, and no more than three looks can be selected for comparison.
4. Incorrect quiz answers display explanations, while correct answers save lesson completion.
5. Photos cannot be accessed without consent. Invalid and oversized files are rejected. Entries with test photos persist after reloading and can be deleted.
6. Comparison links open without an account and do not contain private data.
7. Keyboard navigation, visible focus indicators, skip-navigation links, and `prefers-reduced-motion` work correctly. The browser console contains no application errors.
8. Test an unknown route and `/404.html`. Do not use real private photos for testing.

## Deployment on GitHub Pages

Static content can be published directly from the repository root. No build process is required. Routes use URL hashes, such as `/#learn/color/0`, so server-side rewrite rules are unnecessary.

The `CNAME` file contains `hairlab.itkamianets.com` and has been preserved without modifications. Its presence does not confirm DNS configuration or whether the published version is up to date.

The 404 page uses root-relative links for this domain. A local Python server does not automatically serve it for unknown routes. Open `/404.html` directly to test it.

## Extending Languages and Themes

English phrases serve as translation keys in `js/locales/uk.js`. Translation updates text and accessible element names while preserving the original text for switching back. It does not modify data identifiers or form field values. User-generated content uses `translate="no"`.

To add a new language, create a dictionary, register it in `i18n.js` and `preferences.js`, add the language option to the selectors in `index.html` and `404.html`, and expand the tests.

System file-picker dialogs and standard browser messages depend on the browser's own language.

Theme colors are centralized in `css/variable.css`. New components should use these variables instead of hardcoded surface or text colors.

## What's Next

- Professional review of educational materials and expansion of the catalog with licensed reference images.
- A secure server-side API for real AI-powered recommendations and image processing. Provider API keys must remain on the server.
- AI-powered virtual try-on with separate consent, clearly labeled simulations, and the ability to download actual generated results.
- Guest voting with server-side validation, vote counting, rate limits, expiration dates, and revocable sharing links.
- Cloud synchronization, data export, and broader automated browser testing.

API contracts and requirements are described in the [Integration Plan](docs/integrations.md).

Before making changes, read [AGENTS.md](AGENTS.md).

Do not mark server-side features as available until they have been implemented and tested.
