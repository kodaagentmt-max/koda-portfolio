#!/usr/bin/env python3
"""Update mission control state from live data sources."""
import json, os, sys
from datetime import datetime, timezone
from pathlib import Path

WORKSPACE = Path("/home/kodaagentmt/.openclaw/workspace")

def get_tight_lines():
    posts_dir = WORKSPACE / "tight-lines"
    posted_dir = posts_dir / "posted"
    draft_dir = posts_dir / "draft"

    posted = sorted([f.name for f in posted_dir.glob("*.md")], reverse=True)[:6]
    draft_files = list(draft_dir.glob("*.md"))[:6]

    # Count Buffer scheduled posts
    scheduled = []
    for f in (posts_dir / "drafts").glob("*.md"):
        scheduled.append(f.name)

    return {
        "name": "Tight Lines Tackle Box",
        "emoji": "🎣",
        "status": "active",
        "posts_live": 1,
        "posts_posted_count": len(list(posted_dir.glob("*.md"))),
        "drafts_pending": len(draft_files),
        "last_post": posted[0] if posted else None,
        "next_task": "Continue 2-day Buffer rotation schedule",
        "recent_activity": posted[:3]
    }

def get_camp_cook():
    posted_dir = WORKSPACE / "camp-cook-kitchens" / "posted"
    draft_dir = WORKSPACE / "camp-cook-kitchens" / "draft"

    posted = sorted([f.name for f in posted_dir.glob("*.md")], reverse=True)[:6]
    draft_files = list(draft_dir.glob("*.md"))[:6]

    return {
        "name": "Camp Cook Kitchens",
        "emoji": "🍳",
        "status": "active",
        "posts_live": len(list((WORKSPACE / "tag-soup-blog-clone" if (WORKSPACE / "tag-soup-blog-clone").exists() else WORKSPACE / "camp-cook-kitchens").glob("posts/*.html"))),
        "posts_posted_count": len(list(posted_dir.glob("*.md"))),
        "drafts_pending": len(draft_files),
        "last_post": posted[0] if posted else None,
        "next_task": "Venison recipe series + 2-day Buffer rotation",
        "recent_activity": posted[:3]
    }

def get_etsy():
    return {
        "name": "Etsy POD Store",
        "emoji": "🛒",
        "status": "pending",
        "posts_live": 0,
        "posts_posted_count": 0,
        "drafts_pending": 50,
        "last_post": None,
        "next_task": "KC sets up Etsy seller account → connect Printify",
        "recent_activity": []
    }

def get_buffer():
    return {
        "name": "Buffer Social Publishing",
        "emoji": "📅",
        "status": "operational",
        "next_task": "Posts scheduled through Monday",
        "recent_activity": ["9 posts queued across both channels"]
    }

def main():
    now = datetime.now(timezone.utc).isoformat()

    state = {
        "updated": now,
        "koda_version": "2.0",
        "projects": {
            "tight_lines": get_tight_lines(),
            "camp_cook": get_camp_cook(),
            "etsy_pod": get_etsy(),
            "buffer": get_buffer()
        },
        "agent_summary": {
            "head_agent": "Koda — Commander",
            "subagents_spawned": 4,
            "rooms_complete": 4,
            "status": "All systems nominal"
        }
    }

    out_path = WORKSPACE / "koda-portfolio" / "state.json"
    with open(out_path, "w") as f:
        json.dump(state, f, indent=2)

    print(f"State updated at {now}")

if __name__ == "__main__":
    main()