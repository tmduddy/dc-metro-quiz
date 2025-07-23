# dc-metro-quiz
vaguely based on the idea of the Sporcle US Map quiz but for the DC metro

## Where 2 Find
A basic version of this sketch is now running on the P5.js web editor [here](https://editor.p5js.org/tmduddy/sketches/t8Ldjs6IE)

## how to run
- Manually:
```sh
python3 -m http.server 8089
```

- via npm:
```sh
npm run boot
```
The site will then be available on localhost:8089

## Configs
This uses eslint and prettier for linting and formatting.

## TODO
- [x] create P5.js canvas and add map background
- [x] make stations clickable
- [x] load list of station names and map them to coordinates on the canvas
- [x] display a random station name at the top
- [x] if the correct station is clicked, add the name to the map and show a new station name
- [x] otherwise, show a failure message
- [ ] add ability to restart the game