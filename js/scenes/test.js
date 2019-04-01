class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  init(data) {
    this.maxScore = 0;
    // Manages neural networks
    /*let jsonNN = JSON.parse(localStorage.getItem(GLOBALS.BEST_GEN_STORE_NAME));
    if (jsonNN) {
      this.brain = neataptic.Network.fromJSON(jsonNN);
      console.log(this.brain);
    }*/
    this.brain = neataptic.Network.fromJSON(data.network);
    // Adjust physics FPS to simulation speed (1X, 2x, 3x, 4x)
    this.physics.world.setFPS(60 * GLOBALS.SIMULATION_SPEED);

    this.spawn_margin = GLOBALS.DETECTION_RADIUS + 60;
  }

  create() {
    let t = this;

    this.info_txt = this.add.bitmapText(
      50,
      50,
      'bmf',
      `Actual Score: 0  Max score: 0 Time speed: ${GLOBALS.SIMULATION_SPEED}X`,
      16
    );

    this.info_txt2 = this.add.bitmapText(
      50,
      74,
      'bmf',
      'Inputs-> F: 1  F/L: 1  F/R: 1  B: 1  B/L: 1  B/R: 1\nOutputs-> L: 0  R: 0',
      16
    );

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

    //// Ship
    if (this.brain) {
      this.ship = this.add.existing(new Ship(t, 400, 400, 'ship'));
      this.ship.init();
      this.ship.setBrain(this.brain);
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
    this.physics.add.collider(this.ship, this.meteors, this.collision, undefined, this);

    // Back button
    this.bt_back = this.add.existing(new ButtonGenerator(this, 700, 40, 'BACK', GLOBALS.BUTTON_CONFIG)).setOrigin(0);
    this.bt_back.on(
      'pointerup',
      function() {
        this.scene.start('menu');
      },
      t
    );

    // Start evaluation timestamp
    this.startTime = performance.now();

    // Time event to show inputs/outputs of this neural network
    this.time.addEvent({ delay: 400, callback: t.showNN, callbackScope: t, loop: true });
  }

  update(time, delta) {
    this.ship.update(time, delta);
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
    if (shipScore > this.maxScore) {
      this.maxScore = shipScore;
    }
    ship.setScore(shipScore);
    this.info_txt.setText(
      `Actual Score: ${shipScore}  Max score: ${this.maxScore} Time speed: ${GLOBALS.SIMULATION_SPEED}X`
    );
    console.log(`Test --> Actual Score: ${shipScore}  Max score: ${this.maxScore}`);
    this.reset();
  } // end collision()

  reset() {
    // Resets timer
    this.startTime = performance.now();

    // Resets meteors
    this.meteors.children.iterate(function(meteor) {
      meteor.reset();
    }, this);

    // Reset ship
    this.ship.reset();
  }

  showNN() {
    let i1 = this.ship.inputs[0].toFixed(3);
    let i2 = this.ship.inputs[1].toFixed(3);
    let i3 = this.ship.inputs[2].toFixed(3);
    let i4 = this.ship.inputs[3].toFixed(3);
    let i5 = this.ship.inputs[4].toFixed(3);
    let i6 = this.ship.inputs[5].toFixed(3);
    let o1 = this.ship.outputs[0].toFixed(3);
    let o2 = this.ship.outputs[1].toFixed(3);

    this.info_txt2.setText(
      `Inputs-> F: ${i1}  F/L: ${i3}  F/R: ${i2}  B: ${i4}  B/L: ${i6}  B/R: ${i5}\nOutputs-> L: ${o1}  R: ${o2}`
    );
  }
}
