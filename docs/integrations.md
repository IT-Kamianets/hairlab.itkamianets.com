# HairLab integration boundaries

**Status:** proposed contracts, not implemented endpoints. The static app makes no network API requests. `js/api.js` exposes disabled capabilities and rejects unavailable operations explicitly. Do not enable a capability flag until its consent-aware UI and backend are implemented and tested.

## Existing local schemas

```text
Preferences v1 = {
  version: 1,
  favorites: LookId[], colors: ColorId[], compare: LookId[0..3],
  completed: "CourseId:LessonIndex"[],
  feedback: { [LookId]: "like" | "dislike" },
  groups: { [LookId]: "inspiration" | "next" | "stylist" }
}

Profile (session only) = {
  natural: ColorId, current: ColorId,
  texture: "straight" | "wavy" | "curly" | "coily",
  length: "short" | "medium" | "long", // desired length
  condition: "good" | "dry" | "damaged" | "unsure",
  history: "none" | "dyed" | "bleached" | "unknown",
  goal: "easy" | "shape" | "color", styles: LookId[]
}

JournalEntry v1 = {
  version: 1, id: UUID, date: "YYYY-MM-DD",
  title: string[1..80], notes: string[0..1000],
  before: Blob | null, after: Blob | null
}
```

Photos are limited to decodable JPEG/PNG/WebP, 5 MB each. Sensitive profile/portrait data is not included in preference storage or comparison URLs. Journal records require explicit retention consent. A browser journal is not secure private storage.

## Smallest viable hosted addition

Keep this static frontend on GitHub Pages. Add an HTTPS serverless API and managed database/object storage. Keep provider credentials in server-side secrets. Use explicit allowed origins, schema/size validation, per-request authorization, timeouts, rate limits, and sanitized errors. Avoid sensitive content in logs. Do not place backend secrets in this repository or a public client environment variable.

Suggested API contracts:

| Operation | Input | Validated output / behavior |
| --- | --- | --- |
| `POST /v1/recommendations` | Versioned minimal profile and preference IDs; no photo by default | Known style/color IDs, bounded explanations, safety caveats, source/model metadata |
| `POST /v1/transformations` | Multipart portrait, style/color IDs, explicit provider-processing consent | Async job ID and status; reject unsupported formats/oversize inputs |
| `GET /v1/transformations/:id` | Authorized job ID | Pending/failed/complete; on completion, owned signed image URL and expiry |
| `DELETE /v1/transformations/:id` | Owner authorization | Remove job and retained originals/results; report deletion failure |
| `POST /v1/comparisons` | Catalog IDs or explicitly shared owned images; expiry and visibility | Opaque comparison ID, guest view URL, separate owner management token |
| `GET /v1/comparisons/:id` | Guest opaque ID | Allowed looks, expiry state, aggregate votes; never private profile fields |
| `POST /v1/comparisons/:id/votes` | Allowed look ID, guest anti-abuse token, idempotency key | Recorded/duplicate/expired state and validated totals |
| `DELETE /v1/comparisons/:id` | Owner authorization | Revoke sharing and remove shared image access |

Use bounded structured model responses and validate every field before rendering. Render explanations as text. Never trust provider-supplied HTML or arbitrary image URLs. Restrict image results to approved HTTPS storage origins and verify ownership. Provide cancellation, timeouts, retry limits, and distinct 400/401/403/410/413/429/5xx states. Do not silently fall back to fake AI results.

## Photo and consent lifecycle

Before remote processing, disclose the provider, purpose, retention period, and deletion behavior and require a new explicit opt-in. Existing local-preview consent does not authorize remote processing. Strip unnecessary metadata on the server, use short-lived URLs and private object storage, and minimize retention. Clarify that processing consent does not permit model training or public sharing. Sharing personal images requires separate consent.

Generated previews must be labeled simulations. Compare/download controls should be enabled only after a real validated output is ready. Download the returned image, never a static catalog illustration represented as a transformation. Hair history and achievable color results cannot be reliably inferred from a photo.

## Guest voting and cloud data

Guests must be able to view and vote without registration. Use server-side comparison membership validation, atomic vote counts, expiry/revocation, duplicate/idempotency handling, and rate limits. Anonymous deduplication is an abuse deterrent, not proof of one person per vote. Keep owner edit/delete access separate from public guest tokens.

Cloud journal/collection sync requires ownership/authentication, explicit upload consent, retention rules, deletion/export, and conflict handling. Never automatically migrate browser journal photos into cloud storage.

## Release gates

Test with actual backend staging credentials kept outside source control: failed/slow/rate-limited providers, invalid model output, consent withdrawal, deletion, revoked/expired links, duplicate votes, concurrent votes, unauthorized object access, and guest use in a separate browser. Document the provider and retention policy before enabling production features.
