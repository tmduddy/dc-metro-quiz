let mapWithStations;
const MAP_WITH_STATIONS_WIDTH = 1088;
const MAP_WITH_STATIONS_HEIGHT = 1216;

function preload() {
  mapWithStations = loadImage('../data/images/dc-metro-map-with-stations.png')
}

function setup() {
  createCanvas(MAP_WITH_STATIONS_WIDTH, MAP_WITH_STATIONS_HEIGHT)

  image(mapWithStations, 0, 0);

  describe('Image of the DC metro map with station icons present but unlabeled');
}

function draw() {

}