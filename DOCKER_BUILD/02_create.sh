#! /bin/sh

# Get the real path to this script.
BASE_PATH="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
HOSTEDPATH="$(cd ../../"$(dirname "$1")"; pwd)/$(basename "$1")"
GAMEDIR="space_invaders"
HOSTEDPATH=${HOSTEDPATH}$GAMEDIR

echo
cd "$BASE_PATH"

echo "CREATING CONTAINER..."

CMD="docker create --mount type=bind,source=\"$HOSTEDPATH\",target=/var/www/site/MOUNT/$GAMEDIR -p 8080:80 --name space_invaders_container space_invaders"
# echo "BASE_PATH  : " $BASE_PATH
# echo "HOSTEDPATH : " $HOSTEDPATH
# echo "GAMEDIR    : " $GAMEDIR
# echo "CMD        : " $CMD
eval $CMD
