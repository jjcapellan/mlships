var GLOBALS = {
  // NEAT algorithm default parameters
  INPUTS_SIZE: 6,
  OUTPUTS_SIZE: 2,
  POPULATION_AMOUNT: 50,
  MUTATION_RATE: 0.3,
  ELITISM_PERCENT: 0.2,
  PROVENANCE_PERCENT: 0,
  START_HIDDEN_SIZE: 2,
  MUTATION_AMOUNT: 1,
  // Simulation options
  SIMULATION_SPEED: 1, // 1X 2X 3X 4X 5X times faster
  DETECTION_RADIUS: 300,
  OBSTACLES_AMOUNT: 12,
  BEST_GEN_STORE_NAME: 'bestNN',
  // Mathematical constants
  HALF_PI: Math.PI / 2,
  HALF_PI3: (Math.PI/2) * 3,
  SIXTH_PI: Math.PI / 6,
  SIXTH_PI5: 5 * (Math.PI / 6),
  SIXTH_PI7: 7 * (Math.PI / 6),
  SIXTH_PI11: 11 * (Math.PI / 6),
  QUARTER_PI: Math.PI / 4,
  OCTAVE_PI: Math.PI / 8,
  // Phaser physics
  ASTEROID_SPEED: 70*2, // px/sec
  SHIP_SPEED: 120*2, // px/sec
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

function loadData(key, property) {
  if (localStorage.hasOwnProperty(key)) {
    GLOBALS[property] = parseInt(localStorage.getItem(key));
  } else {
    localStorage.setItem(key, GLOBALS[property]);
  }
}

function loadFloatData(key,property){
  if (localStorage.hasOwnProperty(key)) {
    GLOBALS[property] = parseFloat(localStorage.getItem(key));
  } else {
    localStorage.setItem(key, GLOBALS[property]);
  }
}

loadData('population_amount', 'POPULATION_AMOUNT');
loadFloatData('mutation_rate','MUTATION_RATE');
loadFloatData('elitism_percent','ELITISM_PERCENT');
loadData('detection_radius', 'DETECTION_RADIUS');
loadData('start_hidden_size', 'START_HIDDEN_SIZE');
loadData('simulation_speed', 'SIMULATION_SPEED');
loadData('obstacles_amount', 'OBSTACLES_AMOUNT');


