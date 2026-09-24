#!/bin/sh

set -eu

deploy_directory="firebase-public"

if [ ! -f "legal-notice.html" ]; then
  echo "legal-notice.html is missing. Add the private local file before preparing a deployment."
  exit 1
fi

rm -rf -- "$deploy_directory"
mkdir -p "$deploy_directory"
mkdir -p "$deploy_directory/scripts"

cp index.html privacy-policy.html legal-notice.html script.js style.css "$deploy_directory/"
cp scripts/*.js "$deploy_directory/scripts/"
cp -R assets styles "$deploy_directory/"

echo "Firebase deployment files prepared in $deploy_directory."
