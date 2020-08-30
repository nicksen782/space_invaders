#! /bin/sh

# Get the real path to this script.
ORG_PATH="$(dirname "$1")"
BASE_PATH="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"

echo
cd "$BASE_PATH"

./01_build.sh  && \
cd "$ORG_PATH" && ./02_create.sh && \
cd "$ORG_PATH" && ./03_start.sh && \
echo "DONE"
