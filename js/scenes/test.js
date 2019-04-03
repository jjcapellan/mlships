class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  init(data) {
    this.maxScore = 0;
    // Imports the neural network    
    this.brain = neataptic.Network.fromJSON(data.network);
    // Adjust physics FPS to simulation speed (1X, 2x, 3x, 4x)
    this.physics.world.setFPS(60 * GLOBALS.SIMULATION_SPEED);
    // Sets score
    this.score = 0;

    this.spawn_margin = GLOBALS.DETECTION_RADIUS + 60;

    // Format
    this.marginX = 50;
    this.marginY = 40;
    this.padding = 26;
    this.paddingY = 6;
    this.dataMargins;
  }

  create() {
    let t = this;

    // Labels
    this.dataMargins = this.setLabels();
    this.score_txt = this.add.bitmapText(t.dataMargins.scoreX, t.dataMargins.dataLabelsY, 'bmf', `0`, 16).setOrigin(0.5,0);
    this.timeScale_txt = this.add.bitmapText(t.dataMargins.timeX, t.dataMargins.dataLabelsY, 'bmf', `${GLOBALS.SIMULATION_SPEED}X`, 16).setOrigin(0.5,0);
    this.maxScore_txt = this.add.bitmapText(t.dataMargins.maxX, t.dataMargins.dataLabelsY, 'bmf', `${this.maxScore}`, 16).setOrigin(0.5,0);

    this.info_txt = this.add.bitmapText(
      50,
      t.game.config.height - 50,
      'bmf',
      'Inputs-> F: 1  F/L: 1  F/R: 1  B: 1  B/L: 1  B/R: 1\nOutputs-> L: 0  R: 0',
      16
    );

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

    //// Ship
    if (this.brain) {
      this.ship = this.add.existing(new Ship(t, 400, 400, 'ship'));
      this.ship.init();
      this.ship.setBrain(this.brain);
    }

    //// Asteroids
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
    this.physics.add.collider(this.ship, this.asteroids, this.collision, undefined, this);

    // Back button
    this.bt_back = this.add.existing(new ButtonGenerator(this, 700, 40, 'BACK', GLOBALS.BUTTON_CONFIG)).setOrigin(0);
    this.bt_back.on(
      'pointerup',
      function() {
        this.scene.start('menu');
      },
      t
    ); 

    
    // Time event to show inputs/outputs of this neural network
    this.time.addEvent({ delay: 1000, callback: t.showNN, callbackScope: t, loop: true });

    // Time event to update score
    this.time.addEvent({ delay: 1000, callback: t.updateScore, callbackScope: t, loop: true, timeScale: GLOBALS.SIMULATION_SPEED });
  }

  update(time, delta) {
    this.ship.update(time, delta);
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
    let bmt1 = this.add.bitmapText(this.marginX, this.marginY,'bmf',`SCORE`,16).setOrigin(0.5,0);
    bmt1.x = bmt1.x + bmt1.width / 2;
    let bmt2 = this.add.bitmapText( (bmt1.x + bmt1.width/2) + this.padding, this.marginY,'bmf',`TIME SCALE`,16).setOrigin(0.5,0);
    bmt2.x = bmt2.x + bmt2.width / 2;
    let bmt3 = this.add.bitmapText( (bmt2.x + bmt2.width/2) + this.padding, this.marginY,'bmf',`MAX SCORE`,16).setOrigin(0.5,0);
    bmt3.x = bmt3.x + bmt3.width / 2;
    let dataLabelsY = bmt1.y + bmt1.height + this.paddingY;

    return {scoreX: bmt1.x, timeX: bmt2.x, maxX: bmt3.x, dataLabelsY: dataLabelsY};
  }

  collision(ship, asteroid) {
    let t = this;
    let shipScore = this.score;
    if (isNaN(shipScore)) {
      shipScore = 0;
    }
    if (shipScore > this.maxScore) {
      this.maxScore = shipScore;
      this.maxScore_txt.setText(`${this.maxScore}`);
    }
    ship.setScore(shipScore);
    console.log(`Test --> Actual Score: ${shipScore}  Max score: ${this.maxScore}`);
    this.reset();
  } // end collision()

  updateScore(){
    this.score++;
    this.score_txt.setText(`${this.score}`);
  }

  reset() {
    this.score = 0;
    this.score_txt.setText(`${this.score}`);

    // Resets asteroids
    this.asteroids.children.iterate(function(asteroid) {
      asteroid.reset();
    }, this);

    // Reset ship
    this.ship.reset();
  }

  showNN() {
    let o1 = this.ship.outputs[0].toFixed(3);
    let o2 = this.ship.outputs[1].toFixed(3);

    this.info_txt.setText(
      `Inputs-> ${this.arrayToString(this.ship.inputs)}\nOutputs-> L: ${o1}  R: ${o2}`
    );
  }

  arrayToString(array){
    let str = '';
    let length = array.length;
    for(let i=0; i < length; i++){
      str += ` i${i+1}->${array[i].toFixed(1)} `;
    }
    return str;
  }
}
