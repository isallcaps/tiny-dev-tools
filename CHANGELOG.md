# Changelog

---

## [1.1.0] - 2026-02-07

### Added

* **Persistent Settings (Lorem):** Users can now save and remove custom character limits for the Lorem tool. These are
  stored locally in the browser.

* **CSV Parsing:** Integrated PapaParse to handle complex CSV data, specifically resolving issues with quoted fields and
  commas in descriptions.

### Fixed

* **Jira Query Logic:** Resolved a bug where JQL field names (like "Epic Link") or values with hyphens (like "DEV-123")
  were not being quoted correctly.

## [1.0.2] - 2026-02-02

### Added

* **Path Aliases:** Implemented TypeScript path mapping (`@core`, `@shared`, `@constants`) for cleaner imports and
  better maintainability.
* **Barrel Exports:** Added `index.ts` files across all major directories to streamline module access.
* **Dynamic Routing:** Refactored `app.routes.ts` to use a constant-driven, lazy-loading architecture.

### Changed

* **SCSS Architecture:** Migrated to a modular `@use` structure, separating abstracts, vendor overrides, and core theme
  logic.
* **Folder Structure:** Reorganized components into a feature-based hierarchy (`features/`, `core/`, `shared/`).

---

## [1.0.1] - 2026-02-01

### Added

- New SVG-based favicon with dynamic cache-busting.
- Theme-aware purple branding (Electric Purple for Dark Mode, Deep Purple for Light Mode).

### Changed

- Refactored Bootstrap variable overrides to use high-contrast CSS variables.
- Updated `GroupColumnComponent` badges for better readability.
- Standardized button shapes to "Google-style" rounded pills.

---

## [1.0.0] - 2026-02-01

- Initial public release
- Added "Lorem, but exact."
- Added "JQL, but reusable" with CSV-driven configuration and JQL generation
