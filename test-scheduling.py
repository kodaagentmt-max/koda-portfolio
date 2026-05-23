#!/usr/bin/env python3
import subprocess, json

with open('/home/kodaagentmt/.openclaw/openclaw.json') as f:
    d = json.load(f)
token = d['plugins']['entries']['buffer']['config']['accessToken']

# Test different scheduling approaches
tests = [
    ('addToQueue + automatic', 'addToQueue', 'automatic'),
    ('addToQueue + notification', 'addToQueue', 'notification'),
    ('shareNow only', 'shareNow', None),
    ('shareNow + notification', 'shareNow', 'notification'),
]

text = '🎣 Test post - please ignore'
channel = '6a0508eb090476fb991916ce'

for label, mode, stype in tests:
    if stype:
        q = f'mutation {{ createPost(input: {{text: "{text}", channelId: "{channel}", mode: {mode}, schedulingType: {stype}, metadata: {{ facebook: {{ type: post }} }} }}) {{ ... on PostActionSuccess {{ post {{ id scheduledAt }} }} }} }}'
    else:
        q = f'mutation {{ createPost(input: {{text: "{text}", channelId: "{channel}", mode: {mode}, metadata: {{ facebook: {{ type: post }} }} }}) {{ ... on PostActionSuccess {{ post {{ id scheduledAt }} }} }} }}'
    r = subprocess.run(['curl', '-s', '-X', 'POST', 'https://api.buffer.com/graphql',
                         '-H', f'Authorization: Bearer {token}',
                         '-H', 'Content-Type: application/json',
                         '-d', json.dumps({'query': q})],
                        capture_output=True, text=True)
    print(f'{label}: {r.stdout[:200]}')