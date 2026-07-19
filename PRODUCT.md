# Product

## Register

brand

## Users

Technical recruiters, potential collaborators, and peers discovering Jane online. They arrive with a question: "who is this person, technically and humanly?" They want depth, not a résumé dump.

## Product Purpose

Personal portfolio for Jane Seah, AI Engineer based in Singapore. The site's job is to communicate technical credibility and human personality simultaneously — in a way that generic developer portfolios cannot. Success means a visitor remembers the site itself, not just the credentials.

## Brand Personality

Deliberate · Serene · Precise

Voice is calm and unhurried. The work speaks; the interface doesn't perform. Warmth comes from specificity (a shared pot of oolong, a rogue-lite obsession, the exact awards and research papers) — not from decoration.

## The Concept: Paper Terminal

The site is a terminal session transcript printed on white paper. Sections are shell commands (`whoami`, `tree projects/`, `history`, `env`), and the transcript ends with a real working prompt. The metaphor is the design and the joke in one move: an engineer introduced in her native medium — but daylight-calm, not hacker-dark.

- Palette: pure white paper, cobalt ink (oklch 44% 0.14 258) for prompts and links, one amber block cursor (oklch 72% 0.15 70) as the only warm note. `theme dark` exists as a discoverable easter egg, not a default.
- Type: Sometype Mono, single family, weight contrast only.
- Interaction is the first impression: the `whoami` command types itself on load; the bottom prompt actually executes commands (`help`, `ls`, `open resume.pdf`, `tea`).

## Anti-references

- Standard developer portfolio grids (card-per-project, skill badge rows)
- Green-on-black hacker terminal, fake macOS window chrome with traffic lights
- AI-generated warm-cream + dusty-brown palettes
- Editorial-magazine reflex: italic display serif + mono labels + ruled columns

## Design Principles

1. **Interaction is the first impression.** The typed command and the live prompt are the site. If that moment is forgettable, the content doesn't matter.
2. **Restraint is the voice.** White paper, one ink, one cursor. Nothing competes with the transcript.
3. **Warmth from specificity, not decoration.** The easter eggs (`tea`, `sudo`, `hades`) and the Heikala portrait carry personality; the surfaces stay quiet.
4. **The command is the container.** Every section is revealed by the command that would reveal it in a real shell; the pun must stay technically accurate.

## Accessibility & Inclusion

WCAG AA minimum (4.5:1 body text, 3:1 large text). Reduced-motion alternative for typing and cursor blink. Command headings carry plain-language `aria-label`s; the interactive prompt is a real labelled input with an `aria-live` log.
