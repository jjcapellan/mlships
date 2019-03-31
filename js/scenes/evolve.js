class Evolve extends Phaser.Scene {
  constructor() {
    super('evolve');
  }

  init(data) {
    // Checks existing network template
    if (data.network) {
      console.log('data');
      this.iaManager = new IAmanager(this, data.network);
    } else {
      this.iaManager = new IAmanager(this);
    }
    // Checks max score
    if (localStorage.hasOwnProperty('maxScore')) {
      this.iaManager.maxScore = parseInt(localStorage.getItem('maxScore'));
    }
    // Adjust physics FPS to simulation speed (1X, 2x, 3x, 4x)
    this.physics.world.setFPS(60 * GLOBALS.SIMULATION_SPEED);

    // DOM element to save population
    this.el_inputFile = document.getElementById('inputFile');

    this.spawn_margin = GLOBALS.DETECTION_RADIUS + 60;
  }

  create() {
    let t = this;

    this.info_txt = this.add.bitmapText(
      50,
      50,
      'bmf',
      `Prev Generation: ${this.iaManager.neat.generation - 1}  Max Score: ${this.iaManager
        .actualMaxScore}  Top max score: ${this.iaManager.maxScore}  Time speed: ${GLOBALS.SIMULATION_SPEED}X`,
      16
    );
    this.info_txt2 = this.add.bitmapText(50, 74, 'bmf', `Generation: ${this.iaManager.neat.generation} Score: 0`, 16);

    //// Rectangles to spawn the meteors
    this.innerRectangle = new Phaser.Geom.Rectangle(0, 0, this.game.config.width, this.game.config.height);
    this.outerRectangle = new Phaser.Geom.Rectangle(
      -this.spawn_margin,
      -this.spawn_margin,
      this.game.config.width + this.spawn_margin * 2,
      this.game.config.height + this.spawn_margin * 2
    );
    this.targetRectangle = new Phaser.Geom.Rectangle(
      50,
      50,
      this.game.config.width - 100,
      this.game.config.height - 100
    );

    //// Ships
    this.ships = this.physics.add.group();
    this.ships.createMultiple({
      classType: Ship,
      key: 'ship',
      repeat: GLOBALS.POPULATION_AMOUNT - 1,
      runChildUpdate: true
    });
    for (let i = 0; i < this.ships.getChildren().length; i++) {
      let ship = this.ships.getChildren()[i];
      ship.init();
      ship.setBrain(this.iaManager.neat.population[i]);
    }

    //// Meteors
    this.meteors = this.physics.add.group();
    this.meteors.createMultiple({
      classType: Meteor,
      key: 'asteroid',
      repeat: GLOBALS.OBSTACLES_AMOUNT - 1
    });
    this.meteors.children.iterate(function(meteor) {
      meteor.init(t.innerRectangle, t.outerRectangle, t.targetRectangle);
    }, t);

    // Collider
    this.physics.add.collider(this.ships, this.meteors, this.collision, undefined, this);

    // Back button
    this.bt_back = this.add.existing(new ButtonGenerator(this, 700, 40, 'BACK', GLOBALS.BUTTON_CONFIG)).setOrigin(0);
    this.bt_back.on(
      'pointerup',
      function() {
        this.scene.start('menu');
      },
      t
    );

    // Save button
    this.bt_back = this.add.existing(new ButtonGenerator(this, 700, 560, 'SAVE', GLOBALS.BUTTON_CONFIG)).setOrigin(0,1);
    this.bt_back.on(
      'pointerup',
      function() {
        this.savePopulation();
      },
      t
    );

    // Start evaluation timestamp
    this.startTime = performance.now();
  }

  update(time, delta) {
    let t = this;
    this.ships.children.iterate(function(ship) {
      if (ship.active) {
        ship.update(time, delta);
      }
    }, t);
    this.checkMeteors();
  }

  checkMeteors() {
    let t = this;
    this.meteors.children.iterate(function(meteor) {
      if (!Phaser.Geom.Rectangle.ContainsPoint(t.outerRectangle, meteor.body.position)) {
        meteor.reset();
      }
    });
  }

  collision(ship, meteor) {
    let t = this;
    let collisionTime = performance.now();
    let shipScore = Math.round((collisionTime - this.startTime - ship.stoppedTime) / 1000) * GLOBALS.SIMULATION_SPEED;
    if (isNaN(shipScore)) {
      shipScore = 0;
    }
    ship.setScore(shipScore);
    this.info_txt2.setText(`Generation: ${this.iaManager.neat.generation} Score: ${shipScore}`);

    ship.setActive(false);
    ship.setVisible(false);
    ship.body.reset(-200, -200);
    ship.body.setEnable(false);

    if (this.ships.countActive() == 0) {
      this.iaManager.neat.evolve().then((fittest) => {
        t.iaManager.actualMaxScore = fittest.maxScore;
        if (fittest.score > t.iaManager.maxScore) {
          t.iaManager.maxScore = fittest.score;
          localStorage.setItem('maxScore', JSON.stringify(fittest.score));
          t.saveNN(fittest);
        }
        t.info_txt.setText(
          `Prev Generation: ${t.iaManager.neat.generation - 1} Max Score: ${fittest.score} Top max score: ${t.iaManager
            .maxScore} Time speed: ${GLOBALS.SIMULATION_SPEED}X`
        );
        t.info_txt2.setText(`Generation: ${this.iaManager.neat.generation} Score: 0`);
        console.log(
          `Prev Generation: ${t.iaManager.neat.generation - 1} Max Score: ${fittest.score} Top max score: ${t.iaManager
            .maxScore}`
        );
        t.iaManager.neat.mutate();
        t.reset();
      });
    }
  } // end collision()

  reset() {
    // Assigns the new evolved "brains" to the ships
    for (let i = 0; i < this.ships.getChildren().length; i++) {
      let ship = this.ships.getChildren()[i];
      ship.setBrain(this.iaManager.neat.population[i]);
    }

    // there is quota problem
    /*this.saveData();*/

    // Resets timer
    this.startTime = performance.now();

    // Resets meteors
    this.meteors.children.iterate(function(meteor) {
      meteor.reset();
    }, this);

    // Resets ships
    this.ships.children.iterate(function(ship) {
      ship.reset();
    }, this);
  }

  savePopulation(){

    let savedPopulation = [];
    // Networks array 
    let populationJSON = this.iaManager.neat.export();
    // Generation
    let generation = this.iaManager.neat.generation;


    savedPopulation.push(generation);
    savedPopulation.push(populationJSON);


    const blob = new Blob([ JSON.stringify(savedPopulation) ], {
      type: 'text/plain'
    });

    let anchor = document.createElement('a');
    anchor.download = 'population.JSON';
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [ 'text/plain', anchor.download, anchor.href ].join(':');
    anchor.click();
  }

  saveNN(network) {
    let jsonNN = network.toJSON();
    localStorage.setItem(GLOBALS.BEST_GEN_STORE_NAME, JSON.stringify(jsonNN));
  }
}
