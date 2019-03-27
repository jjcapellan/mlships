function runGame() {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: 0x000000,
    physics: {
      default: 'arcade',
      arcade: {
        fps: 60,
        debug: true
      }
    },
    scene: [ Boot, Menu, Evolve, Test, Configuration ]
  };

  var game = new Phaser.Game(config);
}

// GLOBALS OBJECT
var GLOBALS = {
  DETECTION_RADIUS: 250,
  OBSTACLES_DETECTION: 4,
  OBSTACLES_AMOUNT: 12,
  POPULATION_AMOUNT: 40,
  MUTATION_RATE: 0.5,
  ELITISM_PERCENT: 0.2,
  PROVENANCE_PERCENT: 0.1,
  START_HIDDEN_SIZE: 0,
  MUTATION_AMOUNT: 1,
  HALF_PI: Math.PI / 2,
  QUARTER_PI: Math.PI / 4,
  OCTAVE_PI: Math.PI / 8,
  PI: Math.PI,
  BUTTON_CONFIG: {
    fontKey: 'bmf',
    fontSize: 20,
    textColor: '0xffffee',
    buttonColor: '0xffffff'
  }
};

/*var DETECTION_RADIUS = 250;
const OBSTACLES_DETECTION = 4;
const OBSTACLES_AMOUNT = 12;
var POPULATION_AMOUNT = 40;
const MUTATION_RATE = 0.5;
const ELITISM_PERCENT = 0.2;
const PROVENANCE_PERCENT = 0.1;
var START_HIDDEN_SIZE = 0;
const MUTATION_AMOUNT = 1;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;
const OCTAVE_PI = Math.PI / 8;
const PI = Math.PI;*/

function loadData(key, property) {
  if (localStorage.hasOwnProperty(key)) {
    GLOBALS[property] = parseInt(localStorage.getItem(key));
  } else {
    localStorage.setItem(key, GLOBALS[property]);
  }
}

loadData('population_amount', 'POPULATION_AMOUNT');
loadData('detection_radius', 'DETECTION_RADIUS');
loadData('start_hidden_size', 'START_HIDDEN_SIZE');

window.onload = function() {
  runGame();
  resize();
  window.addEventListener('resize', resize);
};

function resize() {
  let gameRatio = 600 / 800;
  let windowRatio = window.innerHeight / window.innerWidth;
  let canvas = document.getElementsByTagName('canvas')[0];

  if (gameRatio > windowRatio) {
    canvas.style.height = window.innerHeight + 'px';
    canvas.style.width = window.innerHeight / gameRatio + 'px';
  } else {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerWidth * gameRatio + 'px';
  }
}
