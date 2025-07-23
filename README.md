# dc-metro-quiz
vaguely based on the idea of the Sporcle US Map quiz but for the DC metro

## how to run
```sh
cd /src
python3 -m http.server 8089
```
The site will then be available on localhost:8089

## TODO
- [x] create P5.js canvas and add map background
- [x] make stations clickable
- [x] load list of station names and map them to coordinates on the canvas
- [x] display a random station name at the top
- [x] if the correct station is clicked, add the name to the map and show a new station name
- [x] otherwise, show a failure message
- [ ] add ability to restart the game