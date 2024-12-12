# Create the new directory
mkdir -p waypoints-compressed

# Copy and compress each image
for img in waypoints/*.jpg; do
    # Get the filename
    filename=$(basename "$img")
    
    # Compress and save to new directory
    convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality 85 "waypoints-compressed/$filename"
    
    # Optional: Print progress
    echo "Compressed: $filename"
done

# Optional: Compare total size of both folders
echo "Original folder size:"
du -sh waypoints/
echo "Compressed folder size:"
du -sh waypoints-compressed/