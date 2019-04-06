var GLOBALS = {
  // NEAT algorithm default parameters
  INPUTS_SIZE: 8,
  OUTPUTS_SIZE: 2,
  POPULATION_AMOUNT: 50,
  MUTATION_RATE: 0.3,
  ELITISM_PERCENT: 0.1,
  TOP_PERCENTAGE: 0.3,
  RANDOM_PERCENT: 0.2,
  PROVENANCE_PERCENT: 0,
  START_HIDDEN_SIZE: 2,
  MUTATION_AMOUNT: 1,
  EQUAL: 1, // boolean 0 or 1
  // Simulation options
  DETECTION_RADIUS: 250,
  OBSTACLES_AMOUNT: 12,
  BEST_GEN_STORE_NAME: 'bestNN',
  // Mathematical constants
  HALF_PI: Math.PI / 2,
  HALF_PI3: Math.PI / 2 * 3,
  SIXTH_PI: Math.PI / 6,
  SIXTH_PI5: 5 * (Math.PI / 6),
  SIXTH_PI7: 7 * (Math.PI / 6),
  SIXTH_PI11: 11 * (Math.PI / 6),
  QUARTER_PI: Math.PI / 4,
  OCTAVE_PI: Math.PI / 8,
  // Phaser physics
  ASTEROID_SPEED: 70 * 2, // px/sec
  SHIP_SPEED: 120 * 2, // px/sec
  SHIP_ANGULAR_SP: 720, // turning speed (grades/sec)
  // Configuration object used in custom class ButtonGenerator
  BUTTON_CONFIG: {
    fontKey: 'bmf',
    fontSize: 20,
    textColor: '0xffffee',
    buttonColor: '0xffffff'
  },
  // INFO
  NN_VERSION: '1' // Must change if network number of inputs or outputs changes.
};

var GLOBALS_BACKUP = JSON.parse(JSON.stringify(GLOBALS));

var LOADED_POPULATION = null;

function loadJSONfromStorage(key) {
  if (localStorage.hasOwnProperty(key)) {
    let obj = JSON.parse(localStorage.getItem(key));
    return obj;
  }
  return null;
}

function objToObj(sourceObj, targetObj) {
  Object.keys(sourceObj).forEach(function(key) {
    targetObj[key] = sourceObj[key];
  });
}

function initData() {
  let obj = loadJSONfromStorage('configObj');
  if (obj) {
    objToObj(obj, GLOBALS);
  }
}

initData();
