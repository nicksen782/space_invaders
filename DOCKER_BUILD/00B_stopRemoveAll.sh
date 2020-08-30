#! /bin/sh

# Get the real path to this script.
ORG_PATH="$(dirname "$1")"
BASE_PATH="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"

echo
cd "$BASE_PATH"

./04_stop.sh  && \
cd "$ORG_PATH" && ./05_removeContainer.sh && \
cd "$ORG_PATH" && ./06_removeImage.sh && \
echo "DONE"