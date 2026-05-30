#!/usr/bin/env python3
import subprocess, json

with open('/home/kodaagentmt/.openclaw/openclaw.json') as f:
    d = json.load(f)
token = d['plugins']['entries']['buffer']['config']['accessToken']

trivia = '🎣 Hook, Line & Thinker\n\nWhat\'s the difference between a Carolina rig and a Texas rig — and when do you use each? 👇\n\nTight lines, KC'
hack = '🔥 Camp Cook Tip:\n\nSave your bacon fat in a small jar — it\'s the best base for next morning\'s cowboy coffee and adds serious flavor to any bean dish.'

for text, channel, label in [
    (trivia, '6a0508eb090476fb991916ce', 'Tight Lines trivia'),
    (hack,   '6a051053090476fb99192c00', 'Camp Cook evening hack'),
]:
    q = f'mutation {{ createPost(input: {{text: "{text.replace(chr(10), chr(92)+"n")}", channelId: "{channel}", mode: shareNow, schedulingType: recommendedTime, metadata: {{ facebook: {{ type: post }} }} }}) {{ ... on PostActionSuccess {{ post {{ id }} }} }} }}'
    r = subprocess.run(['curl', '-s', '-X', 'POST', 'https://api.buffer.com/graphql',
                         '-H', f'Authorization: Bearer {token}',
                         '-H', 'Content-Type: application/json',
                         '-d', json.dumps({'query': q})],
                        capture_output=True, text=True)
    print(label + ':', r.stdout)