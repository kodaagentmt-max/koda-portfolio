# MEMORY.md — Long-Term Memory

## KC & Setup

- **KC** runs me on a **ChromeOS Crostini container** (2.7GB RAM, no swap)
- Primary goal: **stability first**, projects second
- KC is direct; prefers things just work — no babysitting

## Projects

- **Tight Lines Tackle Box** — fishing blog/lifestyle (tightlines-blog repo)
- **Camp Cook Kitchens** — campfire cooking blog (tag-soup-blog repo)
- **koda-portfolio** — personal portfolio site (master + gh-pages)
- Both blogs back up nightly via `backup-projects.sh` cron (00:02 MDT)

## Buffer / Social Publishing

- Buffer plugin **not yet configured** in OpenClaw — cannot push posts directly
- Buffer channel IDs known:
  - `tight-lines`: `6a0508eb090476fb991916ce`
  - `camp-cook`: `6a051053090476fb99192c00`
- Facebook posts via Buffer **require** `metadata: { facebook: { type: "post" } }` or API rejects
- Known error: `"Invalid post: Facebook posts require a type (post, story, or reel)."` → missing type field

## Incidents & Fixes

- `backup-projects.sh` was missing on 2026-05-13 — script didn't exist at expected path; resolved by 2026-05-15 (script is now in place and running cleanly)
- Morning post cron fired **twice** on 2026-05-14 (duplicate trigger) — investigate if this recurs

## Lessons

- Cron duplicate triggers happen — check for pre-existing files before processing (e.g. `2026-05-14-morning.md` already existed on duplicate run)
- Backup script path: `/home/kodaagentmt/.openclaw/workspace/backup-projects.sh`