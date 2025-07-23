let mapWithStations;
const MAP_WITH_STATIONS_WIDTH = 1088;
const MAP_WITH_STATIONS_HEIGHT = 1216;

const SMALL_STATION_RADIUS = 9;
const LARGE_STATION_RADIUS = 15;

let stationData;
let shuffledStationData;

let position = 0;

const successfulStations = [];

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
  const debugX = (event.x - threshold/1.3) / MAP_WITH_STATIONS_WIDTH;
  const debugY = (event.y - threshold/1.3) / MAP_WITH_STATIONS_HEIGHT;
  console.log('\n"x": ' + debugX.toFixed(3) + ',\n"y": ' + debugY.toFixed(3) + ',')
  
  const clickDistance = dist(mouseX, mouseY, widthFractionToPixel(currentStation.x), heightFractionToPixel(currentStation.y))
  if (clickDistance <= threshold) {
    successfulStations.push(currentStation);
    position += 1;
  } else {
    console.log('WRONG')
    position += 1;
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

function setup() {
  createCanvas(MAP_WITH_STATIONS_WIDTH, MAP_WITH_STATIONS_HEIGHT)

  describe('Image of the DC metro map with station icons present but unlabeled');
  
  // shuffledStationData = shuffle(stationData.data);
  shuffledStationData = stationData.data;
}

function draw() {
  const currentStation = shuffledStationData[position];
  // Draw background map
  image(mapWithStations, 0, 0);

  // Draw current station name
  textAlign(CENTER);
  textSize(36);
  text(currentStation.stationName, MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 10)

  // DEV: highlight active station
  circle(widthFractionToPixel(currentStation.x), heightFractionToPixel(currentStation.y), 15)

  // print labels and mark off found stations
  // successfulStations.forEach(station => {
  shuffledStationData.forEach(station => { 
    const [labelX, labelY] = getLabelCoordinatesFromStation(station)
    push();
    // mark stations
    circle(widthFractionToPixel(station.x), heightFractionToPixel(station.y), station.size === 'large' ? 30 : 15)
    
    // translate *then* rotate to spin text around a central point
    translate(labelX, labelY) 
    rotate(getLabelAngleFromDirection(station.labelTheta));

    // write labels
    textAlign(LEFT);
    textSize(15);
    text(station.stationName, 0, 0);
    pop();
  })

}