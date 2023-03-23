#!/bin/bash
TIMECLICKER_VERSION=$(cat "$1" |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[",]//g' |
  sed 's/^ *//g')

echo $TIMECLICKER_VERSION

echo "TIMECLICKER_VERSION=$TIMECLICKER_VERSION" >>"$GITHUB_ENV"
