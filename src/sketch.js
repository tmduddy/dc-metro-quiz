/* eslint-disable no-undef -- the P5.js builtins here will otherwise all be flagged*/
// define a font variable that will store the current font and allow us to do text boxing.
let font;

// Define the map dimensions. These values should match the actual pixel size of your map.
let mapWithStations;
const MAP_WITH_STATIONS_WIDTH = 1088;
const MAP_WITH_STATIONS_HEIGHT = 1216;

// Valid click radii for small and large stations
const SMALL_STATION_RADIUS = 9;
const LARGE_STATION_RADIUS = 15;

// Screen positions to place the title (stations + failure message) and scores at.
const TITLE_COORDS = [MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 10];
const SCORE_COORDS = [MAP_WITH_STATIONS_WIDTH / 2, 9.5 * (MAP_WITH_STATIONS_HEIGHT / 10)];

// Store global station data as loaded from the json, and the associated shuffled data.
let stationData;
let stationArray;
let shuffledStationArray;

/**
 * This is the current index of the shuffled array. It gets modded with array length to allow for looping back
 */
let position = 0;

const successfulStations = [];

let isGameOver = false;

/**
 * In order to make the map size dynamic, all station locations are stored as fractions.
 * Y == 0   - the top edge of the map
 * Y == 0.5 - the center edge of the map
 * Y == 1   - the bottom edge of the map
 * @param {float} fraction
 * @returns the pixel value on the map for the given fraction
 */
function heightFractionToPixel(fraction) {
  return Math.floor(fraction * MAP_WITH_STATIONS_HEIGHT);
}

/**
 * In order to make the map size dynamic, all station locations are stored as fractions.
 * X == 0   - the left edge of the map
 * X == 0.5 - the center of the map
 * X == 1   - the right edge of the map
 * @param {float} fraction
 * @returns the pixel value on the map for the given fraction
 */
function widthFractionToPixel(fraction) {
  return Math.floor(fraction * MAP_WITH_STATIONS_WIDTH);
}

/**
 * converts a cardinal direction into a p5.js rotation
 * @param {"N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"} direction
 * @returns a rotation angle in radians
 */
function getLabelAngleFromDirection(direction) {
  switch (direction) {
    case 'N':
      return (-1 * Math.PI) / 2;
    case 'NE':
      return (-1 * Math.PI) / 4;
    case 'E':
      return 0;
    case 'SE':
      return Math.PI / 4;
    case 'S':
      return Math.PI / 2;
    case 'SW':
      return (3 * Math.PI) / 4;
    case 'W':
      return Math.PI;
    case 'NW':
      return (-3 * Math.PI) / 4;
    default:
      return 0;
  }
}

/**
 * Takes a single station object and draws a circle over it and applies the label
 * @param {Record<String, String>} station
 * @param {Boolean} success
 */
function drawLabeledStation(station, success = true, id = 0) {
  const [labelX, labelY] = getLabelCoordinatesFromStation(station);
  const labelText = id ? `${id} - ${station.stationName}` : station.stationName;

  push();
  // draw cirlce over station. Green for success and red for failures
  if (success) {
    fill(0, 255, 0);
  } else {
    fill(255, 0, 0);
  }
  circle(widthFractionToPixel(station.x), heightFractionToPixel(station.y), station.size === 'large' ? 30 : 15);

  // translate *then* rotate to spin the label text around a central point
  translate(labelX, labelY);
  rotate(getLabelAngleFromDirection(station.labelTheta));

  // write labels
  textAlign(LEFT);
  textSize(15);
  fill(0);
  text(labelText, 0, 0);
  pop();
}

/**
 * Takes a text string and draws a plain white rectangle around it.
 * @param {String} content
 * @param {Number} x
 * @param {Number} y
 */
function boxedText(content, x, y) {
  const padding = 15;
  const textBoxBounds = font.textBounds(content, x, y);
  rect(textBoxBounds.x, textBoxBounds.y - padding, textBoxBounds.w, textBoxBounds.h + padding * 2);
  text(content, x, y);
}

/**
 * performs the required fraction conversions and offsets for a single stations position and label offset parameters.
 * @param {Record<String, String | Number>} station
 * @returns an array of X, Y coordinates in pixels
 */
function getLabelCoordinatesFromStation(station) {
  const labelX = widthFractionToPixel(station.x) + widthFractionToPixel(station.labelX);
  const labelY = heightFractionToPixel(station.y) + heightFractionToPixel(station.labelY);

  return [labelX, labelY];
}

function drawGameOver(currentStation) {
  drawLabeledStation(currentStation, false);
  push();
  textAlign(CENTER);
  textSize(48);
  boxedText("That wasn't right :( Refresh to try again.", ...TITLE_COORDS);
  textSize(700);
  fill(255, 0, 0, 100);
  stroke(0);
  strokeWeight(7);
  text('X', MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 2 + 300);
  pop();
  noLoop();
}

/**
 * P5.js builtin override for handling clicks. This one calculates if a given click was close enough
 * to the current station's coordinates based on that statements thresholds.
 * This also sets the fail state via isGameOver=true for misclicks.
 */
// eslint-disable-next-line no-unused-vars -- P5.js builtin
function mouseClicked() {
  const currentStation = shuffledStationArray[position];
  // Determine the acceptable click radius from the center point of the station
  const threshold = currentStation.size == 'large' ? LARGE_STATION_RADIUS : SMALL_STATION_RADIUS;
  // DEV: print that out
  // const debugX = (event.x - threshold/1.3) / MAP_WITH_STATIONS_WIDTH;
  // const debugY = (event.y - threshold/1.3) / MAP_WITH_STATIONS_HEIGHT;
  // console.log('\n"x": ' + debugX.toFixed(3) + ',\n"y": ' + debugY.toFixed(3) + ',')

  const clickDistance = dist(
    mouseX,
    mouseY,
    widthFractionToPixel(currentStation.x),
    heightFractionToPixel(currentStation.y),
  );
  if (clickDistance <= threshold) {
    successfulStations.push(currentStation);
    position += 1;
  } else {
    isGameOver = true;
  }
}

// eslint-disable-next-line no-unused-vars -- P5.js builtin
function preload() {
  mapWithStations = loadImage('../data/images/dc-metro-map-with-stations.png');
  stationData = loadJSON('../data/text/stations.json');
  font = loadFont('../data/fonts/HelveticaNeueBlack.otf');
}

// eslint-disable-next-line no-unused-vars -- P5.js builtin
function setup() {
  createCanvas(MAP_WITH_STATIONS_WIDTH, MAP_WITH_STATIONS_HEIGHT);
  
  describe('Image of the DC metro map with station icons present but unlabeled');
  
  stationArray = Object.values(stationData.data);
  shuffledStationArray = shuffle(stationArray);
}

// eslint-disable-next-line no-unused-vars -- P5.js builtin
function draw() {
  const currentStation = shuffledStationArray[position % shuffledStationArray.length];
  if (isGameOver) {
    drawGameOver(currentStation);
    return;
  }

  // Draw background map
  image(mapWithStations, 0, 0);

  // DEV: Draw all stations with labels
  for (const [id, station] of Object.entries(stationData.data)) {
    drawLabeledStation(station, true, id);
  }
  noLoop();

  // Draw current station name in a box
  textAlign(CENTER);
  textSize(40);
  // Replace linebreaks with hyphens for improved formatting and valid text boxing.
  boxedText(currentStation.stationName.replaceAll('\n', '-'), ...TITLE_COORDS);

  // Draw the current score
  boxedText(`Score: ${successfulStations.length}/${shuffledStationArray.length}`, ...SCORE_COORDS);

  // DEV: highlight active station
  // circle(widthFractionToPixel(currentStation.x), heightFractionToPixel(currentStation.y), 15)

  // Print labels and mark off found stations
  successfulStations.forEach((station) => {
    drawLabeledStation(station, true);
  });
}
