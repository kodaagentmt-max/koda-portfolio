#!/bin/bash
# Push missing posts to Buffer

TRIVIA_TEXT='🎣 Hook, Line & Thinker

What'\''s the difference between a Carolina rig and a Texas rig — and when do you use each? 👇

Tight lines, KC'

HACK_TEXT='🔥 Camp Cook Tip:

Use a cast iron skillet with a lid — it holds heat better than foil and cooks evenly over coals. Great for breakfast, lunch, or dinner.'

TOKEN="FUdET2dEVOVay5UEDxMmz35bL6snBZ0bmP_-6Sxy9Z5"

echo "=== Posting Tight Lines trivia ==="
curl -s -X POST https://api.buffer.com/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation { createPost(input: {text: \\\"$TRIVIA_TEXT\\\", channelId: \\\"6a0508eb090476fb991916ce\\\", mode: addToQueue, schedulingType: automatic, metadata: {facebook: {type: \\\"post\\\"}}}) { ... { __typename } } }\"}"

echo ""
echo "=== Posting Camp Cook camp hack ==="
curl -s -X POST https://api.buffer.com/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation { createPost(input: {text: \\\"$HACK_TEXT\\\", channelId: \\\"6a051053090476fb99192c00\\\", mode: addToQueue, schedulingType: automatic, metadata: {facebook: {type: \\\"post\\\"}}}) { ... { __typename } } }\"}"

echo ""