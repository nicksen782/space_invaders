#! /bin/sh

# Get the real path to this script.
BASE_PATH="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"

echo
cd "$BASE_PATH"

echo "REMOVING CONTAINER..."

docker rm space_invaders_container
