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
  const threshold = currentStation.size == 'large' ? LARGE_STATION_RADIUS : SMALL_STATION_RADIUS;
  console.log((event.x - threshold/1.3) / MAP_WITH_STATIONS_WIDTH, (event.y - threshold/1.3) / MAP_WITH_STATIONS_HEIGHT)
  
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
  const labelY = widthFractionToPixel(station.y) + heightFractionToPixel(station.labelY);

  return [labelX, labelY]
}

function setup() {
  createCanvas(MAP_WITH_STATIONS_WIDTH, MAP_WITH_STATIONS_HEIGHT)

  describe('Image of the DC metro map with station icons present but unlabeled');
  
  // shuffledStationData = shuffle(stationData.data);
  shuffledStationData = stationData.data;
  console.log(shuffledStationData);
}

function draw() {
  const currentStation = shuffledStationData[position];
  image(mapWithStations, 0, 0);

  textAlign(CENTER);
  textSize(36);
  text(currentStation.stationName, MAP_WITH_STATIONS_WIDTH / 2, MAP_WITH_STATIONS_HEIGHT / 10)

  circle(widthFractionToPixel(currentStation.x), heightFractionToPixel(currentStation.y), 15)

  successfulStations.forEach(station => {
    const [labelX, labelY] = getLabelCoordinatesFromStation(station)
    push();
    textAlign(LEFT);
    textSize(12);
    translate(labelX, labelY) 
    rotate(station.labelTheta);
    text(station.stationName, 0, 0);
    pop();
  })

}