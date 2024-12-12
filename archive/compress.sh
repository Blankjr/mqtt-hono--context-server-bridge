# Create the new base directory
mkdir -p waypoints-compressed

# Process all jpg files in waypoints directory and its subdirectories
find waypoints -type f -name "*.jpg" | while read img; do
    # Get the relative path of the file (removes 'waypoints/' prefix)
    relative_path=${img#waypoints/}
    
    # Get the directory path of the file
    dir_path=$(dirname "$relative_path")
    
    # Create the corresponding directory structure in waypoints-compressed
    mkdir -p "waypoints-compressed/$dir_path"
    
    # Compress and save to new directory, maintaining folder structure
    convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality 85 "waypoints-compressed/$relative_path"
    
    # Optional: Print progress
    echo "Compressed: $relative_path"
done

# Optional: Compare total size of both folders
echo "Original folder size:"
du -sh waypoints/
echo "Compressed folder size:"
du -sh waypoints-compressed/