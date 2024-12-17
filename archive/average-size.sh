#!/bin/bash

# Initialize variables
total_size=0
file_count=0
current_dir=$(pwd)

# Print script start
echo "Analyzing JPG files in $current_dir and subdirectories..."
echo "----------------------------------------"

# Find all .jpg and .jpeg files (case insensitive)
while IFS= read -r file; do
    # Get file size in bytes - using only the size output from stat
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        size=$(stat -f%z "$file")
    else
        # Linux
        size=$(stat --format=%s "$file")
    fi
    
    # Skip if we couldn't get the file size
    if [ -z "$size" ] || ! [[ "$size" =~ ^[0-9]+$ ]]; then
        echo "Warning: Couldn't get size for $file"
        continue
    fi
    
    # Add to total
    total_size=$((total_size + size))
    file_count=$((file_count + 1))
    
    # Print individual file sizes (using printf for better floating point handling)
    size_kb=$(printf "%.2f" $(echo "$size/1024" | bc -l))
    echo "$file: ${size_kb}KB"
done < <(find . -type f -iname "*.jpg" -o -iname "*.jpeg")

echo "----------------------------------------"

# Calculate and display results
if [ $file_count -eq 0 ]; then
    echo "No JPG files found!"
    exit 1
fi

# Calculate average (using printf for consistent decimal places)
avg_size=$(echo "scale=2; $total_size/$file_count" | bc -l)
avg_size_kb=$(printf "%.2f" $(echo "$avg_size/1024" | bc -l))
avg_size_mb=$(printf "%.2f" $(echo "$avg_size/1048576" | bc -l))
total_mb=$(printf "%.2f" $(echo "$total_size/1048576" | bc -l))

echo "Total files found: $file_count"
echo "Average file size: ${avg_size_kb}KB (${avg_size_mb}MB)"
echo "Total size: ${total_mb}MB"