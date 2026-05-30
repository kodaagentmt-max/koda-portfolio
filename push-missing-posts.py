#!/usr/bin/env python3
import subprocess
import json

TOKEN = "FUdET2dEVOVay5UEDxMmz35bL6snBZ0bmP_-6Sxy9Z5"

# Test the simplest possible query first
test_query = 'mutation { createPost(input: {text: "Test post", channelId: "6a0508eb090476fb991916ce", mode: addToQueue, schedulingType: automatic, metadata: { facebook: { type: post } }) { ... on PostActionSuccess { post { id } } } } }'
result = subprocess.run(
    ["curl", "-s", "-X", "POST", "https://api.buffer.com/graphql",
     "-H", f"Authorization: Bearer {TOKEN}",
     "-H", "Content-Type: application/json",
     "-d", json.dumps({"query": test_query})],
    capture_output=True, text=True
)
print("Test post:", result.stdout)

# Now the real posts
trivia_text = "🎣 Hook, Line & Thinker\n\nWhat's the difference between a Carolina rig and a Texas rig — and when do you use each? 👇\n\nTight lines, KC"
hack_text = "🔥 Camp Cook Tip:\n\nUse a cast iron skillet with a lid — it holds heat better than foil and cooks evenly over coals. Great for breakfast, lunch, or dinner."

posts = [
    (trivia_text, "6a0508eb090476fb991916ce", "Tight Lines trivia"),
    (hack_text, "6a051053090476fb99192c00", "Camp Cook camp hack"),
]

for text, channel, label in posts:
    query = f'mutation createPost {{ createPost(input: {{text: "{text.replace(chr(10), "\\n")}", channelId: "{channel}", mode: addToQueue, schedulingType: automatic, metadata: {{ facebook: {{ type: post }} }} }}) {{ ... on PostActionSuccess {{ post {{ id }} }} }} }}'
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", "https://api.buffer.com/graphql",
         "-H", f"Authorization: Bearer {TOKEN}",
         "-H", "Content-Type: application/json",
         "-d", json.dumps({"query": query})],
        capture_output=True, text=True
    )
    print(f"{label}:", result.stdout)