# Tiny Dev Tools

A small collection of focused, no-nonsense tools for very specific front-end and developer annoyances.

Each tool exists because I personally needed it.

Live site (GitHub Pages):  
👉 https://isallcaps.github.io/tiny-dev-tools/

---

## What is this?

**Tiny Dev Tools** is a lightweight Angular app that hosts small, focused utilities for developers and designers.

Built on the “work smarter, not harder” philosophy - because if a tool can save me time, I don’t want to do it the long
way ever again.


---

## Current tools

### ✏️ Lorem, but exact.

Generate placeholder text at an **exact character count**.

Useful for:

- testing max character limits
- form validation
- UI truncation
- error states
- design mocks

No guessing. No trimming. Just exactly the number of characters you need.

---

### 🧩 JQL, but reusable. *(in progress)*

Build reusable Jira queries from CSV input.

Features:

- Paste or upload a CSV of Jira fields + values
- Group values using a `group` column (purely for UI)
- Select values via checkboxes
- Auto-generate JQL
- Edit the query manually before copying
- Local storage persistence (nothing leaves your browser)

Built for people who use labels, components, epics, etc. heavily and are tired of re-typing or re-checking the same
things.

---

## Tech stack

- Angular (v21)
- Bootstrap + ng-bootstrap
- No backend
- No tracking
- No analytics

Everything runs client-side.

---

## Local development

```bash
npm install
ng serve
```

Then open:
http://localhost:4200

---

## GitHub Pages deployment

This project is deployed using GitHub Pages.

Build command:

```bash
ng build --base-href /tiny-dev-tools/
```