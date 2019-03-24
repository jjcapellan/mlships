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
    scene: [ Boot, Menu, Test ]
  };

  var game = new Phaser.Game(config);
}

//GA GLOBALS
const DETECCTION_RADIUS = 600;
const OBSTACLES_DETECTION = 3;
const POPULATION_AMOUNT = 50;
const MUTATION_RATE = 0.4;
const ELITISM_PERCENT = 0.2;
const START_HIDDEN_SIZE = 30;

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
