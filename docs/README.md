# THREAD Demo Documentation

This directory contains the synthetic data files that power the THREAD college-life agent demo.

## Dossier Files

The two main dossier files are the canonical source documents:

- **`alex-rivera-dossier.md`** — Alex Rivera's complete longitudinal profile: birth to Week 7, medical records, medication history, behavioral patterns, family system, support map, document vault, and agent memory hooks.

- **`northview-state-dossier.md`** — Northview State University's complete campus data: buildings, health services, dining, pharmacy, shuttles, safety, counseling, disability services, policies, contacts, and academic calendar.

These dossiers are too large to live in the agent's system prompt directly. The agent files (`agent/prompt.mjs` and `agent/services.mjs`) contain compressed versions optimized for LLM context windows. The full dossiers here are the reference documents used to build those compressed versions.

## Data Assets

The `assets/` directory contains structured CSV views of the same synthetic dataset:

### Alex Rivera
- `alex-rivera-class-schedule.csv` — Class, work, care-access, and activity schedule
- `alex-rivera-campus-walking-times.csv` — Campus walking times and after-hours route notes
- `alex-rivera-document-index.csv` — Document vault index with dates, sources, and sensitivity

### Northview State University
- `northview-state-building-directory.csv` — Full building directory with zones and access
- `northview-state-contact-directory.csv` — Contact directory with synthetic extensions
- `northview-state-health-access.csv` — Health access matrix (clinic, urgent care, emergency)
- `northview-state-shuttle-schedule.csv` — Shuttle and route schedule
- `northview-state-dining-allergy-matrix.csv` — Dining venues and allergy/celiac matrix
- `northview-state-academic-calendar.csv` — Academic calendar 2026-2027
- `northview-state-policy-index.csv` — Policy index (privacy, parent access, accommodations)

## Important Notes

- All data is **fictional demo data**. It is not medical advice, not real medical records, and not real university policies.
- The medical details are deliberately written as record summaries and care-context memory, not diagnosis or treatment instructions.
- Cedar Falls, Iowa is a real town used as the geographic anchor. Northview State University is fictional.
- Student names, staff names, phone extensions, and portal names are synthetic.
