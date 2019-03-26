class Test extends Phaser.Scene {
  constructor() {
    super('test');
  }

  init(data) {
    this.conf = this.registry.get('config');
    this.maxScore = 0;
    // Manages neural networks
    //this.iaManager = new IAmanager(this);
    let jsonNN = JSON.parse(localStorage.getItem('bestNN'));
    if(jsonNN){
    this.brain = neataptic.Network.fromJSON(jsonNN);
    }
  }

  create() {
    let t = this;

    this.info_txt = this.add.bitmapText(
      50,
      50,
      'bmf',
      'Actual Score: 0  Max score: 0',
      16
    );

    if(!this.brain){

    }

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

    

    //// Ship
    if(this.brain){    
    this.ship = this.add.existing(new Ship(t, 400, 400,'ship'));
    this.ship.init();
    this.ship.setBrain(this.brain);
    }

    //// Meteors
    this.meteors = this.physics.add.group();
    this.meteors.createMultiple({
      classType: Meteor,
      key: 'asteroid',
      repeat: OBSTACLES_AMOUNT - 1
    });
    this.meteors.children.iterate(function(meteor) {
      meteor.init(t.innerRectangle, t.outerRectangle, t.targetRectangle);
    }, t);

    // Collider
    this.physics.add.collider(this.ship, this.meteors, this.collision, undefined, this);

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
    let shipScore = Math.round(
      (collisionTime - this.startTime - ship.stoppedTime) / 1000
    );
    if (isNaN(shipScore)) {
      shipScore = 0;
    }
    if (shipScore > this.maxScore) {
      this.maxScore = shipScore;
    }
    ship.setScore(shipScore);
    this.info_txt.setText(`Actual Score: ${shipScore}  Max score: ${this.maxScore}`);
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
}
