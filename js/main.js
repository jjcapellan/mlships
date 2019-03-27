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
    scene: [ Boot, Menu, Evolve, Test ]
  };

  var game = new Phaser.Game(config);
}

//GA GLOBALS
const DETECTION_RADIUS = 250;
const OBSTACLES_DETECTION = 4;
const OBSTACLES_AMOUNT = 12;
const POPULATION_AMOUNT = 40;
const MUTATION_RATE = 0.5;
const ELITISM_PERCENT = 0.2;
const PROVENANCE_PERCENT = 0.1;
const START_HIDDEN_SIZE = 3;
const MUTATION_AMOUNT = 1;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;
const OCTAVE_PI = Math.PI / 8;
const PI = Math.PI;

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
