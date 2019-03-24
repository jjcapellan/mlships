class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  init() {
    this.conf = this.registry.get('config');
    // Manages neural networks
    this.iaManager = new IAmanager(this);
  }

  create() {
    let t = this;

    this.info_txt = this.add.bitmapText(
      50,
      50,
      'bmf',
      `Prev Generation: ${this.iaManager.neat.generation - 1}  Max Score: ${this.iaManager
        .actualMaxScore}  Top max score: ${this.iaManager.maxScore}`,
      16
    );
    this.info_txt2 = this.add.bitmapText(
      50,
      74,
      'bmf',
      `Generation: ${this.iaManager.neat.generation} Score: 0`,
      16
    );

    //// Rectangles to spawn the meteors
    this.innerRectangle = new Phaser.Geom.Rectangle(
      0,
      0,
      this.game.config.width,
      this.game.config.height
    );
    this.outerRectangle = new Phaser.Geom.Rectangle(
      -100,
      -100,
      this.game.config.width + 200,
      this.game.config.height + 200
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
      repeat: POPULATION_AMOUNT - 1,
      runChildUpdate: true
    });
    console.log(this.ships.getChildren().length);
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
      repeat: 12
    });
    this.meteors.children.iterate(function(meteor) {
      meteor.init(t.innerRectangle, t.outerRectangle, t.targetRectangle);
    }, t);

    // Collider
    this.physics.add.collider(this.ships, this.meteors, this.collision, undefined, this);

    // Back button
    this.bt_back = this.add
      .existing(
        new ButtonGenerator(this, 720, 50, 'bmf', 10, 'BACK', '0xffffee', '0xffffff')
      )
      .setOrigin(0);
    this.bt_back.on(
      'pointerup',
      function() {
        this.scene.start('menu');
      },
      t
    );

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
    let shipScore = Math.round((collisionTime - this.startTime) / 1000);
    if (isNaN(shipScore)) {
      shipScore = 0;
    }
    ship.setScore(shipScore);
    this.info_txt2.setText(
      `Generation: ${this.iaManager.neat.generation} Score: ${shipScore}`
    );

    ship.setActive(false);
    ship.setVisible(false);
    ship.body.reset(-100, -100);
    ship.body.setEnable(false);

    if (this.ships.countActive() == 0) {
      this.iaManager.neat.evolve().then((fittest) => {
        t.iaManager.actualMaxScore = fittest.maxScore;
        if (fittest.score > t.iaManager.maxScore) {
          t.iaManager.maxScore = fittest.score;
        }
        t.info_txt.setText(
          `Prev Generation: ${t.iaManager.neat.generation -
            1} Max Score: ${fittest.score} Top max score: ${t.iaManager.maxScore}`
        );
        t.info_txt2.setText(`Generation: ${this.iaManager.neat.generation} Score: 0`);
        console.log(`Prev Generation: ${t.iaManager.neat.generation - 1} Max Score: ${fittest.score} Top max score: ${t.iaManager.maxScore}`);
        t.iaManager.neat.mutate();
        t.reset();
      });
    }
  } // end collision()

  reset() {
    // Assigns the new envolved "brains" to the ships
    for (let i = 0; i < this.ships.getChildren().length; i++) {
      let ship = this.ships.getChildren()[i];
      ship.setBrain(this.iaManager.neat.population[i]);
    }

    this.saveData();

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

  saveData() {
    let populationJSON = this.iaManager.neat.export();
    localStorage.setItem('population', JSON.stringify(populationJSON));
    localStorage.setItem('topScore', this.iaManager.maxScore);
    localStorage.setItem('generation', this.iaManager.neat.generation);
  }
}
