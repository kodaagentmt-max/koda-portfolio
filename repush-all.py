# -*- coding: utf-8 -*-
import subprocess, json

with open('/home/kodaagentmt/.openclaw/openclaw.json') as f:
    d = json.load(f)
token = d['plugins']['entries']['buffer']['config']['accessToken']

posts = [
    ('🎣 Tight Lines Daily\n\nMoon: Waning Crescent (18%)\nSunrise: 5:48 AM / Sunset: 9:07 PM MT\nMajor Feed: 10:15 AM-12:15 PM\nMinor Feed: 4:22 AM-5:22 AM\n\nPost-spawn fish moving to depth. Topwater starting on calm evenings. Points and rocky banks.',
     '6a0508eb090476fb991916ce', 'Tight Lines Solunar'),
    ('🆕 What\'s Working This Week:\n\n• Squarebill crankbaits — relating to rock and hard bottom\n• Ned rigs in 10-15ft water — post-spawn bite steady\n• Topwater frogs in evenings — bass pushing shad to surface\n• Fluorocarbon mainline — water clearing across Flathead tributaries\n\nTight lines, KC',
     '6a0508eb090476fb991916ce', 'Tight Lines Weekly Gear'),
    ('🏕️ Outdoor Update\n\n• MTFWP: Flathead Lake kokanee limit increases to 6/day June 1\n• Campfire bans lifting across lower elevations as snowpack melts\n• Stanley Adventure dropped titanium kettle — 90 sec boil\n• Black bear activity up near Polbridge and Tally Lake',
     '6a051053090476fb99192c00', 'Camp Cook Outdoor Update'),
    ('🔥 Weekly Recipe:\nDutch Oven Campfire Chili\n\n1 lb ground elk/meat\n1 can kidney beans\n1 can diced tomatoes\n1 packet chili seasoning\n1 onion, diced\n\nBrown meat, add everything, simmer in Dutch oven 30-45 min. Serves 4.',
     '6a051053090476fb99192c00', 'Camp Cook Weekly Recipe'),
    ('🎣 Hook, Line & Thinker\n\nWhat\'s the difference between a Carolina rig and a Texas rig — and when do you use each? 👇\n\nTight lines, KC',
     '6a0508eb090476fb991916ce', 'Tight Lines Hook Line'),
    ('🔥 Camp Cook Tip:\n\nSave bacon fat in a small jar — best base for cowboy coffee and adds serious flavor to any bean dish.',
     '6a051053090476fb99192c00', 'Camp Cook Evening Hack'),
    ('What\'s the one piece of fishing gear you swear by but most anglers overlook? 👇\n\nTight lines, KC',
     '6a0508eb090476fb991916ce', 'Tight Lines Engagement'),
    ('What\'s the one camp cooking tool you\'d never leave home without? 👇\n\nCamp Cook',
     '6a051053090476fb99192c00', 'Camp Cook Engagement'),
    ('🔥 Camp Cook Tip:\n\nUse a cast iron skillet with a lid — holds heat better than foil, cooks evenly over coals.',
     '6a051053090476fb99192c00', 'Camp Cook Midday Hack'),
]

for text, channel, label in posts:
    escaped = text.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    q = f'mutation {{ createPost(input: {{text: "{escaped}", channelId: "{channel}", mode: shareNow, schedulingType: notification, metadata: {{ facebook: {{ type: post }} }} }}) {{ ... on PostActionSuccess {{ post {{ id }} }} }} }}'
    r = subprocess.run(['curl', '-s', '-X', 'POST', 'https://api.buffer.com/graphql',
                         '-H', f'Authorization: Bearer {token}',
                         '-H', 'Content-Type: application/json',
                         '-d', json.dumps({'query': q})],
                        capture_output=True, text=True)
    result = json.loads(r.stdout)
    pid = result.get('data',{}).get('createPost',{}).get('post',{}).get('id','ERROR')
    err = result.get('errors',[{}])[0].get('message','OK')
    print(f'  {label}: {pid} {err}')
