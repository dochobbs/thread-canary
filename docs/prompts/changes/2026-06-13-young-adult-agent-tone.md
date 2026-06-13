# 2026-06-13 Young Adult Agent Tone

## Why

The canary agent was replying like a keyword router. It could answer specific tools, but it was not connecting with the student or asking the missing question when the input was vague or emotionally loaded.

One concrete bug: `overwhelmed` matched the medication branch because the previous routing checked for the substring `med`.

## Change

- Added word-based intent matching so emotional language does not accidentally trigger medication handling.
- Split parent anxiety from explicit parent-update requests.
- Added a young-adult reply pattern: notice, connect, check, act.
- Made symptom worry start with a safety check before class or schedule planning.
- Made planning replies smaller and more executable for a week-7 college student.
- Added tests and smoke coverage for overwhelm, parent-safe updates, symptom safety checks, and concrete tonight planning.

## Tone Target

THREAD should sound like:

"I have already looked across this. You control what leaves THREAD. Here is the next useful move."

Not:

"Let's optimize your week."
