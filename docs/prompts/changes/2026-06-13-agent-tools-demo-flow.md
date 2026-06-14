# 2026-06-13 Agent Tools Demo Flow

## Why

The agent needed to do visible work, not only answer from memory. The demo now needs to show a student asking for help, the agent changing THREAD state, and the resulting output staying visible.

## Change

- Added deterministic agent tools around the model-backed responder:
  - activate module
  - add memory
  - add/update document
  - create task
  - mark action done
  - draft parent-safe update
  - prepare urgent-care note
  - build student-controlled share packet
- Added five guided demo moments to the primary mobile agent surface:
  - urgent care
  - parent text
  - lab TA
  - add acute depth
  - tonight plan
- Added agent-created artifacts to canary state and a mobile `Agent Outputs` shelf below the chat.
- Added custom actions so the agent can create real tasks that appear in Action Queue.
- Agent messages now include `toolCalls` so the demo can show what changed.
- Canary smoke now verifies demo moments and an urgent-care tool run that creates a visit note and share packet.

## Demo Path

Use this sequence:

1. Ask `Do I need urgent care tonight?`
2. Show the urgent-care note and share packet in Agent Outputs.
3. Ask `What do I tell my mom without giving her everything?`
4. Show the parent-safe artifact.
5. Ask `Add the acute illness module. What changes?`
6. Show the new acute-illness action in the queue.
7. Ask `Make me a plan for tonight.`
8. Show the created tasks in Action Queue.

## Verification

- Unit tests cover tool execution, module activation, artifacts, custom actions, action completion, and demo moments.
- React tests cover the five guided demo buttons and the `Agent Outputs` shelf.
- Live canary smoke passed with `EXPECT_LLM_AGENT=1`.
