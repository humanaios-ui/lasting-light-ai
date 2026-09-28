#!/bin/bash

# Contamination Review Workflow Trigger Script
# Triggers the GitHub Actions workflow via repository dispatch
# Usage: ./scripts/trigger-contamination-review.sh [entity_id] [source]

set -e

ENTITY_ID="${1:-}"
SUBMISSION_SOURCE="${2:-api}"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verify prerequisites
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it with: brew install gh"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI not authenticated${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Get repository info
REPO_OWNER=$(git config --get remote.origin.url | sed 's|.*:\([^/]*\)/.*|\1|' | sed 's|.*/\([^/]*\)$|\1|')
REPO_NAME=$(git config --get remote.origin.url | sed 's|.*\/\([^/]*\)\.git$|\1|')

echo -e "${YELLOW}Triggering Contamination Review Workflow${NC}"
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo "Submission Source: $SUBMISSION_SOURCE"
if [ -n "$ENTITY_ID" ]; then
    echo "Entity ID: $ENTITY_ID"
fi

# Build client_payload
PAYLOAD='{'
PAYLOAD+='"submission_source":"'$SUBMISSION_SOURCE'"'
if [ -n "$ENTITY_ID" ]; then
    PAYLOAD+=','
    PAYLOAD+='"entity_id":"'$ENTITY_ID'"'
fi
PAYLOAD+='}'

echo -e "${YELLOW}Payload: $PAYLOAD${NC}"

# Trigger repository dispatch
if gh repo view "$REPO_OWNER/$REPO_NAME" &> /dev/null; then
    gh api repos/"$REPO_OWNER"/"$REPO_NAME"/dispatches \
        -F event_type="data-submission" \
        -F client_payload="$PAYLOAD" \
        --input - << EOF
{}
EOF

    echo -e "${GREEN}✅ Workflow triggered successfully${NC}"
    echo "Track progress at: https://github.com/$REPO_OWNER/$REPO_NAME/actions/workflows/contamination-review.yml"
else
    echo -e "${RED}Error: Repository not found${NC}"
    exit 1
fi
