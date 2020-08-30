#! /bin/sh

# Get the real path to this script.
BASE_PATH="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"

# echo
cd "$BASE_PATH"

echo "BUILDING IMAGE..."

docker build --tag space_invaders:latest .


