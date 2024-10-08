#!/bin/bash

for file in ./frontend/src/styles/themes/*.scss; do
	base_name=$(basename "$file" .scss)
	echo "Concatenating $base_name.scss"
	cat "$file" ./frontend/src/styles/main.scss >"./frontend/src/styles/prebuild/$base_name.scss"
done

echo "Copying mod files"
cp frontend/src/styles/mods/*.scss frontend/src/styles/prebuild/mods

echo "Building SASS files"
sass frontend/src/styles/prebuild/ --no-source-map

echo "Moving build files"
mv frontend/src/styles/prebuild/*.css frontend/public/styles
echo "Moving mod files"
mv frontend/src/styles/prebuild/mods/*.css frontend/public/styles/mods
