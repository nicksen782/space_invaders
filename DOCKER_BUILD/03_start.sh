#! /bin/sh

# Get the real path to this script.
BASE_PATH="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"

echo
cd "$BASE_PATH"

echo "STARTING CONTAINER..."

docker start space_invaders_container
