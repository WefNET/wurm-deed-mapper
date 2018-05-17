# Wurm Angular DeedMapper

Designed to translate token dumped *.MAP files into 2D renderings

## Current How-To

1. The *.MAP files are in XML. These have been translated to JSON via an online tool:  http://www.utilities-online.info/xmltojson/#.WvwesEiUsmI

2. JSON files are then cleaned up to eliminate the "-" at the beginnings of variable names.

3. The JSON data is then pulled in by an Open Layers map to show the following layers dynamically:
    - Tiles
    - Trees
    - Fences and Walls




