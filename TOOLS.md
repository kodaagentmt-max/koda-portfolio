# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Buffer API

Buffer's GraphQL API at `https://api.buffer.com/graphql` requires Facebook posts to specify a type:
```json
mutation {
  createPost(input: {
    text: "...",
    channelId: "<channel-id>",
    mode: "shareNow",           // shareNow | addToQueue | customScheduled | recommendedTime
    schedulingType: "automatic", // automatic | notification
    metadata: { facebook: { type: "post" } }  // REQUIRED for Facebook posts
  }) { ... }
}
```

**Channels:**
- `tight-lines`: `6a0508eb090476fb991916ce` (Tight Lines Tackle Box, Facebook)
- `camp-cook`: `6a051053090476fb99192c00` (TAG SOUP, Facebook)
- Org ID: `6a05089fa97795a834ca66d9`
- Token: stored in `openclaw.json` under `plugins.entries.buffer.config.accessToken`

**Common errors:**
- `"Invalid post: Facebook posts require a type (post, story, or reel)."` → missing `metadata.facebook.type`
- `"You've posted that one recently"` → Buffer deduplicates content; vary the text or wait