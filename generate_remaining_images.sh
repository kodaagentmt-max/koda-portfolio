#!/bin/bash
set -e

IMGDIR="/home/kodaagentmt/tag-soup-blog-clone/docs/images"
MEDIADIR="/home/kodaagentmt/.openclaw/media/tool-image-generation"
RESET_TIME="2026-05-06T00:00:00Z"

echo "[$(date -u)] Waiting for MiniMax limit reset at $RESET_TIME..."

# Wait until reset
while [[ "$(date -u +%Y-%m-%dT%H:%M:%SZ)" < "$RESET_TIME" ]]; do
    sleep 60
done
echo "[$(date -u)] Reset time reached! Starting image generation..."

# Function to generate and save an image
generate() {
    local filename="$1"
    local prompt="$2"
    local counter=0
    local max_attempts=10
    
    while [ $counter -lt $max_attempts ]; do
        echo "[$(date -u)] Attempting: $filename (attempt $((counter+1)))"
        
        # Generate image via curl to MiniMax API directly
        response=$(curl -s -X POST "https://api.minimax.io/v1/image_generation" \
            -H "Authorization: Bearer ${MINIMAX_API_KEY}" \
            -H "Content-Type: application/json" \
            -d "{\"model\":\"image-01\",\"prompt\":\"$prompt\"}" \
            --max-time 110)
        
        # Check if we got a valid response with an image URL
        image_url=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',[{}])[0].get('url',''))" 2>/dev/null || echo "")
        
        if [ -n "$image_url" ]; then
            # Download the image
            curl -s -L "$image_url" -o "$IMGDIR/$filename"
            if [ -f "$IMGDIR/$filename" ] && [ -s "$IMGDIR/$filename" ]; then
                echo "[$(date -u)] Saved: $filename"
                return 0
            fi
        fi
        
        # Check for rate limit
        if echo "$response" | grep -q "usage limit"; then
            echo "[$(date -u)] Rate limited, waiting 60s..."
            sleep 60
        else
            echo "[$(date -u)] Failed attempt: ${response:0:200}"
            sleep 10
        fi
        
        counter=$((counter+1))
    done
    
    echo "[$(date -u)] FAILED after $max_attempts attempts: $filename"
    return 1
}

# Remaining images
generate "goose-gumbo.jpg" "Food photography of dark roux goose gumbo in a cast iron pot over white rice, okra visible, file powder garnish, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "duck-breast-cherry.jpg" "Food photography of pan-seared duck breast with cherry reduction sauce on a plate, roasted vegetables, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "smoked-duck-benedict.jpg" "Food photography of smoked duck eggs benedict on English muffin halves with hollandaise, pickled onions, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "duck-prosciutto.jpg" "Food photography of paper-thin duck prosciutto slices fanned on a board with honeydew melon and arugula, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "goose-confit.jpg" "Food photography of Canadian goose confit legs on a plate with roasted carrots and potatoes, crispy skin, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "rabbit-fried.jpg" "Food photography of Southern fried rabbit with cream gravy on a cast iron plate, biscuits, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "rabbit-cacciatore.jpg" "Food photography of rabbit cacciatore in a cast iron pot with peppers, tomatoes, fresh rosemary, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "smoked-rabbit.jpg" "Food photography of smoked rabbit with apricot mustard glaze on a board, whole rabbit sliced, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "rabbit-dumplings.jpg" "Food photography of rabbit and dumplings in a Dutch oven, fluffy buttermilk dumplings, rich gravy, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "rabbit-tikka.jpg" "Food photography of rabbit tikka masala in a bowl over basmati rice, naan bread, fresh cilantro, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

generate "pheasant-pot-pie.jpg" "Food photography of creamy pheasant pot pie in a cast iron skillet with flaky golden top crust, overhead or 45-degree angle, natural campfire lighting, rustic wooden surface, cast iron Dutch oven, 4K, professional food styling, appetizing, warm amber tones"

echo "[$(date -u)] All remaining images complete!"
echo "Final count:"
ls "$IMGDIR"/*.jpg 2>/dev/null | wc -l
