class Evolve extends Phaser.Scene {
  constructor() {
    super('evolve');
  }

  init(data) {
    // Checks existing network template
    if (data.network) {
      console.log('Using loaded network');
      this.iaManager = new IAmanager(this, data.network);
    } else if(data.population){
      console.log('Using loaded population');
      this.iaManager = new IAmanager(this, null, data.population);
    } else {
      console.log('Using new random population');
      this.iaManager = new IAmanager(this);
    }
    // Checks max score
    if(LOADED_POPULATION){
      this.iaManager.maxScore = parseInt(LOADED_POPULATION[2]);
    }
    // Sets score
    this.score = 0;
    // Adjust physics FPS to simulation speed (1X, 2x, 3x, 4x)
    this.physics.world.setFPS(60 * GLOBALS.SIMULATION_SPEED);

    // DOM element to save population
    this.el_inputFile = document.getElementById('inputFile');

    this.spawn_margin = GLOBALS.DETECTION_RADIUS + 60;

    this.popSize = this.iaManager.neat.population.length;

    // Format
    this.marginX = 50;
    this.marginY = 40;
    this.padding = 26;
    this.paddingY = 6;
    this.dataMargins;
  }

  create() {
    let t = this;

    //// Rectangles to spawn the asteroids
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
      repeat: this.iaManager.neat.population.length - 1,
      runChildUpdate: true
    });
    for (let i = 0; i < this.ships.getChildren().length; i++) {
      let ship = this.ships.getChildren()[i];
      ship.init();
      ship.setBrain(this.iaManager.neat.population[i]);
    }

    //// Asteorids
    this.asteroids = this.physics.add.group();
    this.asteroids.createMultiple({
      classType: Asteroid,
      key: 'asteroid',
      repeat: GLOBALS.OBSTACLES_AMOUNT - 1
    });
    this.asteroids.children.iterate(function(asteroid) {
      asteroid.init(t.innerRectangle, t.outerRectangle, t.targetRectangle);
    }, t);

    // Collider
    this.physics.add.collider(this.ships, this.asteroids, this.collision, undefined, this);

    // Back button
    this.bt_back = this.add.existing(new ButtonGenerator(this, 700, 40, 'BACK', GLOBALS.BUTTON_CONFIG)).setOrigin(0);
    this.bt_back.on(
      'pointerup',
      function() {
        this.scene.start('menu');
      },
      t
    );

    // Labels
    this.dataMargins = this.setLabels();
    this.gen_txt = this.add.bitmapText(t.dataMargins.genX, t.dataMargins.dataLabelsY, 'bmf', `${this.iaManager.neat.generation}`, 16).setOrigin(0.5,0);
    this.score_txt = this.add.bitmapText(t.dataMargins.scoreX, t.dataMargins.dataLabelsY, 'bmf', `0`, 16).setOrigin(0.5,0);
    this.timeScale_txt = this.add.bitmapText(t.dataMargins.timeX, t.dataMargins.dataLabelsY, 'bmf', `${GLOBALS.SIMULATION_SPEED}X`, 16).setOrigin(0.5,0);
    this.maxScore_txt = this.add.bitmapText(t.dataMargins.maxX, t.dataMargins.dataLabelsY, 'bmf', `${this.iaManager.maxScore}`, 16).setOrigin(0.5,0);

    // Time event to update score
    this.time.addEvent({ delay: 1000, callback: t.updateScore, callbackScope: t, loop: true, timeScale: GLOBALS.SIMULATION_SPEED });
  }

  update(time, delta) {
    let t = this;
    this.ships.children.iterate(function(ship) {
      if (ship.active) {
        ship.update(time, delta);
      }
    }, t);
    this.checkAsteroids();
  }

  checkAsteroids() {
    let t = this;
    this.asteroids.children.iterate(function(asteroid) {
      if (!Phaser.Geom.Rectangle.ContainsPoint(t.outerRectangle, asteroid.body.position)) {
        asteroid.reset();
      }
    });
  }

  setLabels(){
    const t = this;
    let bmt1 = this.add.bitmapText(this.marginX, this.marginY,'bmf',`GENERATION`,16).setOrigin(0.5,0);
    bmt1.x = bmt1.x + bmt1.width / 2;
    let bmt2 = this.add.bitmapText( (bmt1.x + bmt1.width/2) + this.padding, this.marginY,'bmf',`SCORE`,16).setOrigin(0.5,0);
    bmt2.x = bmt2.x + bmt2.width / 2;
    let bmt4 = this.add.bitmapText( (bmt2.x + bmt2.width/2) + this.padding, this.marginY,'bmf',`TIME SCALE`,16).setOrigin(0.5,0);
    bmt4.x = bmt4.x + bmt4.width / 2;
    let bmt3 = this.add.bitmapText((bmt4.x + bmt4.width/2) + this.padding, this.marginY,'bmf',`MAX SCORE`,16).setOrigin(0.5,0);
    bmt3.x = bmt3.x + bmt3.width / 2;
    let dataLabelsY = bmt1.y + bmt1.height + this.paddingY;

    return {genX: bmt1.x, scoreX: bmt2.x, timeX: bmt4.x, maxX: bmt3.x, dataLabelsY: dataLabelsY};
  }

  collision(ship, asteroid) {
    let t = this;
    let shipScore = this.score;
    if (isNaN(shipScore)) {
      shipScore = 0;
    }
    ship.setScore(shipScore);
    

    ship.setActive(false);
    ship.setVisible(false);
    ship.body.reset(-200, -200);
    ship.body.setEnable(false);

    if (this.ships.countActive() == 0) {
      // Checks for new Top Max Score
      if(shipScore > t.iaManager.maxScore){ // latest is the best (score == seconds active)
        t.iaManager.maxScore = shipScore;
        localStorage.setItem('maxScore', shipScore);
        t.saveNN(ship.brain);
        t.maxScore_txt.setText(`${t.iaManager.maxScore}`); 
      }
      // Gets average score
      let averageScore = this.getAverage();
      // Evolve population
      this.iaManager.neat.evolve().then((fittest) => {
        t.iaManager.actualMaxScore = shipScore;    

        console.log(
          `Prev Generation: ${t.iaManager.neat.generation - 1} Average: ${averageScore} Max: ${shipScore} Top max: ${t.iaManager
            .maxScore}`
        );
        t.updatePopulation();
        t.iaManager.neat.mutate();
        t.reset();
      });
    }
  } // end collision()

  updateScore(){
    this.score++; 
    this.score_txt.setText(`${this.score}`);
  }

  getAverage(){
    let scoreSum = 0;

    this.ships.children.iterate(function(ship){
      scoreSum += ship.brain.score;
    },this);

    return Math.round(scoreSum / this.popSize);
  }

  reset() {
    // Assigns the new evolved "brains" to the ships
    for (let i = 0; i < this.ships.getChildren().length; i++) {
      let ship = this.ships.getChildren()[i];
      ship.setBrain(this.iaManager.neat.population[i]);
    }

    // Resets score
    this.score = 0;
    this.score_txt.setText('0');

    // Resets asteroids
    this.asteroids.children.iterate(function(asteroid) {
      asteroid.reset();
    }, this);

    // Resets ships
    this.ships.children.iterate(function(ship) {
      ship.reset();
    }, this);

    // Displays new generation
    this.gen_txt.setText(`${this.iaManager.neat.generation}`);
  }

  updatePopulation(){
    LOADED_POPULATION = [];
    // Best Genome
    let BestGenomeJSON = JSON.parse(localStorage.getItem(GLOBALS.BEST_GEN_STORE_NAME));

    // Networks array 
    let populationJSON = this.iaManager.neat.export();

    // Generation
    let generation = this.iaManager.neat.generation;

    // Max Score
    let maxScore = this.iaManager.maxScore;

    LOADED_POPULATION.push(generation);
    LOADED_POPULATION.push(populationJSON);
    LOADED_POPULATION.push(maxScore);
    LOADED_POPULATION.push(BestGenomeJSON);

  }  

  saveNN(network) {
    let jsonNN = network.toJSON();
    localStorage.setItem(GLOBALS.BEST_GEN_STORE_NAME, JSON.stringify(jsonNN));
  }
}
