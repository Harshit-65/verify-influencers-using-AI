# Define the base directory
$baseDir = "src"

# Define the directory and file structure
$structure = @(
    "app/(dashboard)/layout.js",
    "app/api/analyze/route.js",
    "app/api/influencers/route.js",
    "app/api/leaderboard/route.js",
    "app/influencer/[slug]/page.js",
    "app/leaderboard/page.js",
    "app/research/page.js",
    "app/page.js",
    "components/Header.jsx",
    "components/InfluencerCard.jsx",
    "components/ResearchForm.jsx",
    "components/TimeRangeSelector.jsx",
    "components/ui/button.js",
    "lib/db.js",
    "lib/googleSearch.js",
    "models/Influencer.js",
    "utils/prompts.js",
    "utils/helpers.js"
)

# Create directories and files
foreach ($item in $structure) {
    $path = Join-Path -Path $baseDir -ChildPath $item
    $dir = Split-Path -Path $path -Parent
    if (-not (Test-Path -Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
    if (-not (Test-Path -Path $path)) {
        New-Item -ItemType File -Path $path -Force
    }
}
