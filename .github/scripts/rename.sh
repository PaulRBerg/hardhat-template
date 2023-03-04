#!/usr/bin/env bash

# https://gist.github.com/vncsna/64825d5609c146e80de8b1fd623011ca
set -euo pipefail

# Define the input vars
GITHUB_REPOSITORY=${1?Error: Please pass username/repo, e.g. prb/foundry-template}
GITHUB_REPOSITORY_OWNER=${2?Error: Please pass username, e.g. prb}
GITHUB_REPOSITORY_DESCRIPTION=${3:-""} # If null then replace with empty string

echo "GITHUB_REPOSITORY: $GITHUB_REPOSITORY"
echo "GITHUB_REPOSITORY_OWNER: $GITHUB_REPOSITORY_OWNER"
echo "GITHUB_REPOSITORY_DESCRIPTION: $GITHUB_REPOSITORY_DESCRIPTION"

# jq is like sed for JSON data
JQ_OUTPUT=`jq \
  --arg NAME "@$GITHUB_REPOSITORY" \
  --arg AUTHOR_NAME "$GITHUB_REPOSITORY_OWNER" \
  --arg URL "https://github.com/$GITHUB_REPOSITORY_OWNER" \
  --arg DESCRIPTION "$GITHUB_REPOSITORY_DESCRIPTION" \
  '.name = $NAME | .description = $DESCRIPTION | .author |= ( .name = $AUTHOR_NAME | .url = $URL )' \
  package.json
`

# Overwrite package.json
echo "$JQ_OUTPUT" > package.json

# Make sed command compatible in both Mac and Linux environments
# Reference: https://stackoverflow.com/a/38595160/8696958
sedi () {
  sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

# Rename instances of "PaulRBerg/foundry-template" to the new repo name in README.md for badges only
sedi "/gitpod/ s|PaulRBerg/foundry-template|"${GITHUB_REPOSITORY}"|;" "README.md"
sedi "/gitpod-badge/ s|PaulRBerg/foundry-template|"${GITHUB_REPOSITORY}"|;" "README.md"
sedi "/gha/ s|PaulRBerg/foundry-template|"${GITHUB_REPOSITORY}"|;" "README.md"
sedi "/gha-badge/ s|PaulRBerg/foundry-template|"${GITHUB_REPOSITORY}"|;" "README.md"
