magick convert 04.3.H3-P7.jpg \
  \( -size 2000x2000 -background none -gravity center -pointsize 2000 \
     -stroke black -strokewidth 100 -fill none label:"3" \
     -stroke white -strokewidth 50 -fill none -annotate +0+0 '3' \
     -fill red -stroke none -annotate +0+0 '3' \) \
  -gravity center -composite 04.3.H3-P7.jpg