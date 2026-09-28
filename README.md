# Texas Resilience Commons OS — Water Sovereignty Nexus

Version 2.1.0 (2026-09-27)

This bundle fuses the supplied Texas Water Sovereignty OS editions into one offline-first, cross-domain, gamified application. Water remains the systems core, but the OS explicitly connects water with food, soil, energy, public health, housing, ecosystems, economy, education/workforce, mobility/logistics, digital infrastructure, emergency management and circular resource flows.

## Fast use
- **Standalone:** open `index.html`. Navigation, calculators, issue guides, quests, IndexedDB projects, import/export and same-origin BroadcastChannel rooms work without a server. `file://` has browser-specific limitations and service workers do not run there.
- **Static PWA:** host the folder over HTTPS/localhost. `sw.js` caches same-origin core assets after a successful visit.
- **Cross-device multiplayer:** run `node server.js`, then open `http://localhost:8080`. The relay uses only Node built-ins and a small local JSON state file. It has room validation, body/rate limits and defensive text handling, but **no user authentication**; use it as a LAN/demo relay or place it behind production-grade authentication/HTTPS/reverse-proxy controls before internet exposure.

## Multiplayer boundary
1. **Solo/local-first:** all core tools work locally.
2. **Local room:** BroadcastChannel synchronizes events among same-origin tabs/windows in the same browser profile.
3. **Server room:** the included HTTP relay adds cross-device polling/event sync. It is intentionally simple and transparent, not a claim of enterprise security.

## Data sovereignty
Structured projects/profiles/plans/notes are stored in IndexedDB. Lightweight preferences, gamification state and a short room-event cache use localStorage. Export produces portable JSON with a schema marker. Imports merge compatible records and do not silently wipe stores. SHA-256 checks integrity, not authorship or provenance.

## Safety
The system supports resilience, stewardship and evidence-based planning. It does not replace licensed engineering, hydrogeology, laboratory testing, public-health instructions, lawful water rights, permitting, utility operations or emergency orders. Gamification never gates information or rewards unsafe actions.

## Attribution
Systems concept: Foster + Navi / Planetary Restoration Archive. Supplied source editions are retained under `sources/` with SHA-256 hashes for traceability. Government links/evidence inside the application remain attributed to their originating agencies. No proprietary third-party runtime library is required.


## Civic & Legislative Intelligence (v2.2)
The app now contains a static, official-source civic registry checked **2026-09-27**. It distinguishes pending bills, enacted laws/constitutional measures, adopted/planning documents, agency reports/programs, hearings and participation processes. Federal, Texas, regional and local entries include plain-language scope, the proposed/governing idea, and official participation routes.

Because this is an offline-capable bundle, civic status is a **snapshot rather than a live legislative tracker**. Always open the official link to confirm the latest bill version, docket deadline, hearing date, funding window or local agenda. The module is informational and neutral; it does not recommend supporting or opposing legislation.


## v2.2 Fluid dual-navigation shell

- **Menu 1 — Domains:** the header selects a systems domain such as Water Sources, Working Lands, Decision Tools, Cross-Domain Nexus, Gamified Commons or Civic & Legislative.
- **Menu 2 — Modules:** the contextual side menu automatically follows the selected domain and exposes only its relevant modules; using module search temporarily searches across every domain.
- Selecting a module automatically activates its parent domain. Selecting a domain moves to that domain's first module when needed.
- Desktop shows both menus concurrently. Tablet/phone layouts progressively convert the menus into independent accessible drawers.
- Route swaps use the browser View Transitions API when available, with a zero-dependency fallback and `prefers-reduced-motion` / Reduce Effects support.
- The animated entry splash is decorative, skippable, and shortened/disabled for reduced-motion users.
- The navigation registry remains the single source of truth; adding a route to `GROUPS` automatically places it in both menu systems.
