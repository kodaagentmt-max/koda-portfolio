#!/bin/bash
# Backup Projects Script
# Runs midnight daily — backs up tightlines-blog and tag-soup-blog repos

LOGFILE="/home/kodaagentmt/.openclaw/workspace/memory/$(date +%Y-%m-%d).md"
echo "## Cron: backup-projects.sh — $(date '+%Y-%m-%d %H:%M %Z')" >> "$LOGFILE"

# 1. Push workspace git (already has remote configured)
cd /home/kodaagentmt/.openclaw/workspace
git add -A
git commit -m "Auto-backup - $(date '+%Y-%m-%d %H:%M:%S')"
if git push -u origin master 2>&1 | tee -a "$LOGFILE"; then
    echo "**Status:** OK" >> "$LOGFILE"
else
    echo "**Status:** FAILED" >> "$LOGFILE"
fi

# 2. Push tightlines-blog
if [ -d "/home/kodaagentmt/Koda-workspace-repo/projects/tightlines-blog" ]; then
    cd /home/kodaagentmt/Koda-workspace-repo/projects/tightlines-blog
    git add -A
    git commit -m "Auto-backup - $(date '+%Y-%m-%d %H:%M:%S')"
    if git push 2>&1 | tee -a "$LOGFILE"; then
        echo "**tightlines-blog: OK**" >> "$LOGFILE"
    else
        echo "**tightlines-blog: FAILED**" >> "$LOGFILE"
    fi
fi

# 3. Push tag-soup-blog
if [ -d "/home/kodaagentmt/tag-soup-blog-clone" ]; then
    cd /home/kodaagentmt/tag-soup-blog-clone
    git add -A
    git commit -m "Auto-backup - $(date '+%Y-%m-%d %H:%M:%S')"
    if git push 2>&1 | tee -a "$LOGFILE"; then
        echo "**tag-soup-blog: OK**" >> "$LOGFILE"
    else
        echo "**tag-soup-blog: FAILED**" >> "$LOGFILE"
    fi
fi

echo "Backup complete at $(date)" >> "$LOGFILE"
exit 0