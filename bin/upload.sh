#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: $0 <commit_message>"
	exit 1
fi

./bin/build-sass.sh
(
	cd frontend
	npm run build
)
git add .
git commit -m "$1"
git push
