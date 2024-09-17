#!/bin/bash

for file in ./src/styles/themes/*.scss; do
	base_name=$(basename "$file" .scss)
	echo "Concatenating $base_name.scss"
	cat "$file" ./src/styles/main.scss >"./src/styles/prebuild/$base_name.scss"
done

echo "Building SASS files"
sass src/styles/prebuild/ --no-source-map

echo "Moving build files"
mv src/styles/prebuild/*.css public/styles
