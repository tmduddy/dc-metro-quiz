let mapWithStations;
const MAP_WITH_STATIONS_WIDTH = 1088;
const MAP_WITH_STATIONS_HEIGHT = 1216;

const SMALL_STATION_RADIUS = 9;
const LARGE_STATION_RADIUS = 15;

let stationData;
let shuffledStationData;

let position = 0;

const successfulStations = [];

let isGameOver = false;

function heightFractionToPixel(fraction) {
  return Math.floor(fraction * MAP_WITH_STATIONS_HEIGHT)
}

function widthFractionToPixel(fraction) {
  return Math.floor(fraction * MAP_WITH_STATIONS_WIDTH);
}

function preload() {
  mapWithStations = loadImage('../data/images/dc-metro-map-with-stations.png')
  stationData = loadJSON('../data/text/stations.json');
}

function mouseClicked(event) {
  const currentStation = shuffledStationData[position];
  // Determine the acceptable click radius from the center point of the station
  const threshold = currentStation.size == 'large' ? LARGE_STATION_RADIUS : SMALL_STATION_RADIUS;
  // DEV: print that out
  // const debugX = (event.x - threshold/1.3) / MAP_WITH_STATIONS_WIDTH;
  // const debugY = (event.y - threshold/1.3) / MAP_WITH_STATIONS_HEIGHT;
  // console.log('\n"x": ' + debugX.toFixed(3) + ',\n"y": ' + debugY.toFixed(3) + ',')
  
  const clickDistance = dist(mouseX, mouseY, widthFractionToPixel(currentStation.x), heightFractionToPixel(currentStation.y))
  if (clickDistance <= threshold) {  
    successfulStations.push(currentStation);
    position += 1;
  } else {
    isGameOver = true;
  }
}

function getLabelCoordinatesFromStation(station) {
  const labelX = widthFractionToPixel(station.x) + widthFractionToPixel(station.labelX);
  const labelY = heightFractionToPixel(station.y) + heightFractionToPixel(station.labelY);

  
  return [labelX, labelY]
}

/**
 * converts a cardinal direction into a p5.js rotation 
 * @param {string} direction 
 * @returns 
 */
function getLabelAngleFromDirection(direction) {
  switch (direction) {
    case "N":
      return -1 * PI/2;
    case "NE":
      return -1 * PI/4;
    case "E":
      return 0;
    case "SE":
      return PI/4;
    case "S":
      return PI/2;
    case "SW":
      return 3 * PI/4;
    case "W":
      return PI;
    case "NW":
      return -3 * PI/4;
    default:
      return 0;
  }
}

function drawLabeledStation(station, success=true) {
  const [labelX, labelY] = getLabelCoordinatesFromStation(station)
  push();
  // draw cirlce over station. Green for success and red for failures
  if (success) {
    fill(0, 255, 0);
  } else {
    fill(255, 0, 0);
  }
  circle(widthFractionToPixel(station.x), heightFractionToPixel(station.y), station.size === 'large' ? 30 : 15)
  
  // translate *then* rotate to spin the label text around a central point
  translate(labelX, labelY) 
  rotate(getLabelAngleFromDirection(station.labelTheta));

  // write labels
  textAlign(LEFT);
  textSize(15);
  fill(0);
  text(station.stationName, 0, 0);
  pop();
}

function setup() {
  createCanvas(MAP_WITH_STATIONS_WIDTH, MAP_WITH_STATIONS_HEIGHT)

  describe('Image of the DC metro map with station icons present but unlabeled');
  
  shuffledStationData = shuffle(stationData.data);
}

function draw() {
  if (isGameOver) {
    textAlign(CENTER);
    textSize(48);
    text('That wasn\'t right.\nRefresh the page to try again.', MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 3)
    textSize(600);
    text('X', MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 2 + 300)
    noLoop();
    return;
  }
  const currentStation = shuffledStationData[position % shuffledStationData.length];

  // Draw background map
  image(mapWithStations, 0, 0);


  // Draw current station name in a box
  textAlign(CENTER);
  textSize(40);

  text(currentStation.stationName, MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 10)
  
  // Draw the current score
  text(`Score: ${successfulStations.length}/${shuffledStationData.length}`, MAP_WITH_STATIONS_WIDTH / 2, 9.5 * (MAP_WITH_STATIONS_HEIGHT / 10))

  // DEV: highlight active station
  // circle(widthFractionToPixel(currentStation.x), heightFractionToPixel(currentStation.y), 15)

  // print labels and mark off found stations
  successfulStations.forEach(station => {
    drawLabeledStation(station);
  })

}