# THREAD Demo Student: Week 7

## Student

Alex Rivera is a first-year biology student halfway through the first semester at Northview State.

Alex is in week 7, with biology lecture on Monday/Wednesday/Friday, chemistry lab on Tuesday/Thursday, club soccer, work-study, and a midterm cluster starting in 5 days.

## What THREAD Knows

- Alex usually takes stimulant medication at 8:00 AM on class days and needs the refill started before Friday.
- Sleep has been below 6.5 hours for 3 nights.
- Tuesday/Thursday chemistry lab runs through lunch, and Alex has skipped lunch 3 lab days.
- Chest tightness plus a fever note changed after a weekend cough and is worse since yesterday.
- Alex prefers urgent care over campus clinic after 6 PM and wants a short symptom history ready before going.
- Roommate Jordan can help with meals or rides. Aunt Lena is the trusted adult only after Alex says yes.
- Parents can pay for THREAD, but student memory and records stay private unless Alex shares them.

## Default Agent Work

- Decide care level for symptoms.
- Start medication refill.
- Repair week 7 before midterms hit.
- Run a consent-based safety check-in.

## Agent Tools To Demo

- `Plan tonight`: creates a concrete evening plan across care decision, refill, meals, studying, and sleep.
- `Prep visit`: creates symptom and question prep for a campus clinic, urgent care, or emergency care decision.
- `Start refill`: drafts the message Alex can send to avoid a medication gap during midterms.
- `Parent update`: drafts a parent-safe reassurance note without sharing symptoms, medication details, or records.

The agent tone should follow [THREAD Agent Tone](../prompts/thread-agent-tone.md): notice the situation, connect it to remembered context, ask one focused check when needed, and offer a concrete next action.

## Modules

Always on:

- Executive Function / ADHD
- Sleep / Burnout / Academic Load
- Medication Management
- Care Navigation
- Mental Health Safety

Available on demand:

- Nutrition / Eating Patterns
- Sexual Health / Privacy
- Substance / Party Safety
- Acute Illness / Injury
- Admin / Insurance
- Documents / Records
- Chronic Conditions
- Identity-Sensitive Care
- Sports / Fitness Recovery
- Financial Stress

Activation behavior:

On-demand modules are visible but inactive until Alex chooses them. When added, they create concrete extra work, such as lab-day meal fallback, insurance cleanup, scattered-record consolidation, financial-stress sorting, or sports recovery checks.
