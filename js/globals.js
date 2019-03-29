var GLOBALS = {
  // NEAT algorithm parameters
  POPULATION_AMOUNT: 40,
  MUTATION_RATE: 0.5,
  ELITISM_PERCENT: 0.2,
  PROVENANCE_PERCENT: 0.1,
  START_HIDDEN_SIZE: 0,
  MUTATION_AMOUNT: 1,
  // Simulation options
  SIMULATION_SPEED: 1, // 1X 2X 3X 4X times faster
  DETECTION_RADIUS: 250,
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
  // Phaser
  ASTEROID_SPEED: 70, // px/sec
  SHIP_SPEED: 120, // px/sec
  SHIP_ANGULAR_SP: 300, // turning speed
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

function loadData(key, property) {
  if (localStorage.hasOwnProperty(key)) {
    GLOBALS[property] = parseInt(localStorage.getItem(key));
  } else {
    localStorage.setItem(key, GLOBALS[property]);
  }
}

// Deletes incompatible neural networks
function cleanObsoleteData(){
  let nnVersion = localStorage.getItem('nn_version');
  if(nnVersion != GLOBALS.NN_VERSION){
    localStorage.setItem('nn_version', GLOBALS.NN_VERSION);
    localStorage.removeItem('bestNN');
    localStorage.removeItem('maxScore');
  }
}

loadData('population_amount', 'POPULATION_AMOUNT');
loadData('detection_radius', 'DETECTION_RADIUS');
loadData('start_hidden_size', 'START_HIDDEN_SIZE');
loadData('simulation_speed', 'SIMULATION_SPEED');

cleanObsoleteData();


