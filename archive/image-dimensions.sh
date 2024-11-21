#!/bin/bash

# Function to get image dimensions using identify (from ImageMagick)
get_dimensions() {
    identify -format "%w x %h\t%f\n" "$1"
}

# Script to list all images with dimensions
echo "Image Dimensions:"
echo "----------------"
echo "Width x Height	Filename"
echo "----------------"

# Find all image files and get their dimensions
find . -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.webp" \) -type f -exec identify -format "%w x %h\t%f\n" {} \;

# Sort by width (optional)
# find . -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.webp" \) -type f -exec identify -format "%w x %h\t%f\n" {} \; | sort -n