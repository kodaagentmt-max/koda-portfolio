#!/usr/bin/env python3
"""
buffer-post.py — Push a post to Buffer via GraphQL API

Usage (direct push):
  buffer-post.py <channelId> <text> [mode] [schedulingType]

Usage (question pool mode — picks random question, no repeats until pool exhausted):
  buffer-post.py --tight-lines-engagement
  buffer-post.py --camp-cook-engagement
  buffer-post.py --tight-lines-trivia
  buffer-post.py --camp-cook-hack
"""

import sys
import json
import random
import urllib.request
import os
import datetime
import copy

QUESTION_POOLS = {
    "--tight-lines-engagement": {
        "channel": "6a0508eb090476fb991916ce",
        "file": "/home/kodaagentmt/.openclaw/workspace/buffer-questions/tight-lines.json",
        "schedulingType": "automatic"
    },
    "--camp-cook-engagement": {
        "channel": "6a051053090476fb99192c00",
        "file": "/home/kodaagentmt/.openclaw/workspace/buffer-questions/camp-cook.json",
        "schedulingType": "automatic"
    },
    "--tight-lines-trivia": {
        "channel": "6a0508eb090476fb991916ce",
        "file": "/home/kodaagentmt/.openclaw/workspace/buffer-questions/tight-lines-trivia.json",
        "schedulingType": "automatic"
    },
    "--camp-cook-hack": {
        "channel": "6a051053090476fb99192c00",
        "file": "/home/kodaagentmt/.openclaw/workspace/buffer-questions/camp-cook-hacks.json",
        "schedulingType": "automatic"
    }
}

TRACKER_FILE = "/home/kodaagentmt/.openclaw/workspace/buffer-questions/used_today.json"

def load_token():
    with open("/home/kodaagentmt/.openclaw/openclaw.json") as f:
        config = json.load(f)
    return config["plugins"]["entries"]["buffer"]["config"]["accessToken"]

def push_to_buffer(channel_id, text, mode="addToQueue", scheduling_type="automatic"):
    token = load_token()

    query = """mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess { post { id text } }
        ... on UnexpectedError { message }
      }
    }"""

    variables = {
        "input": {
            "text": text,
            "channelId": channel_id,
            "mode": mode,
            "schedulingType": scheduling_type,
            "metadata": {"facebook": {"type": "post"}}
        }
    }

    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")

    req = urllib.request.Request(
        "https://api.buffer.com/graphql",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "X-Organization-Id": "6a05089fa97795a834ca66d9"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return f"HTTP {e.code}: {body[:200]}"

    data = result.get("data", {}).get("createPost", {})
    typename = data.get("__typename")

    if typename == "PostActionSuccess":
        post = data["post"]
        return f"OK — post {post['id']} queued to Buffer"
    elif typename == "UnexpectedError":
        return f"ERROR: {data.get('message', 'unknown error')}"
    elif typename == "InvalidInputError":
        return f"ERROR: {data.get('message', 'invalid input — possibly dedupe block')}"
    else:
        return f"ERROR: unexpected result: {typename} — {data}"

def get_tracker():
    """Load tracker. Resets if it's a new day."""
    today = datetime.date.today().isoformat()
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE) as f:
                data = json.load(f)
            if data.get("date") != today:
                data = {"date": today, "used": {}}
            return data
        except Exception:
            pass
    return {"date": today, "used": {}}

def save_tracker(tracker):
    """Save tracker to disk."""
    with open(TRACKER_FILE, "w") as f:
        json.dump(tracker, f)

def pick_fresh_question(pool_key):
    """Pick a random question that has not been used today. Resets pool when exhausted."""
    pool_info = QUESTION_POOLS[pool_key]
    with open(pool_info["file"]) as f:
        data = json.load(f)
    all_questions = data["questions"]

    tracker = get_tracker()
    used = tracker["used"].get(pool_key, [])

    # Filter out used questions
    available = [q for q in all_questions if q not in used]

    if not available:
        # Pool exhausted — reset for today and pick fresh
        tracker["used"][pool_key] = []
        available = all_questions

    question = random.choice(available)

    # Mark as used
    tracker["used"].setdefault(pool_key, []).append(question)
    save_tracker(tracker)

    return question, pool_info

def main():
    if len(sys.argv) < 2:
        print("Usage: buffer-post.py <channelId> <text> [mode] [schedulingType]")
        print("   Or: buffer-post.py --tight-lines-engagement")
        print("   Or: buffer-post.py --camp-cook-engagement")
        sys.exit(1)

    if sys.argv[1] in QUESTION_POOLS:
        question, pool_info = pick_fresh_question(sys.argv[1])
        result = push_to_buffer(pool_info["channel"], question, "addToQueue", pool_info["schedulingType"])
        print(result)
        return

    # Direct push mode
    channel_id = sys.argv[1]
    text = sys.argv[2]
    mode = sys.argv[3] if len(sys.argv) > 3 else "addToQueue"
    scheduling_type = sys.argv[4] if len(sys.argv) > 4 else "automatic"
    result = push_to_buffer(channel_id, text, mode, scheduling_type)
    print(result)

if __name__ == "__main__":
    main()
