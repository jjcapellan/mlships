class Ship extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    this.x = 400;
    this.y = 300;
    this.stoppedTime = 0;

    // actions
    this.actions = {
      accelerate: false,
      left: false,
      right: false
    };
  }

  init() {
    let bodyRadius = this.height * 0.5;
    this.setOrigin(0.5);
    this.body.setMaxVelocity(this.scene.conf.ship_maxVelocity);
    this.body.setCircle(
      bodyRadius,
      -bodyRadius + 0.5 * this.width,
      -bodyRadius + 0.5 * this.height
    );
    this.reset();
  }

  setBrain(brain) {
    this.brain = brain;
    this.brain.score = 0;
  }

  setScore(score) {
    this.brain.score = score;
  }

  update(time, delta) {
    if(this.body.speed < 5){
      this.stoppedTime += delta;
    }
    // Takes data
    let inputs = this.captureData();
    // Process data in the neural network
    let outputs = this.brain.activate(inputs);
    // Sets the actions
    this.actions.accelerate = outputs[0] > 0.5;
    this.actions.left = outputs[1] > 0.5 && outputs[1] > outputs[2];
    this.actions.right = outputs[2] > 0.5 && outputs[2] > outputs[1];
    // Executes the actions
    if (this.actions.accelerate) {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.scene.conf.ship_acceleration,
        this.body.acceleration
      );
    } else {
      this.setAcceleration(0);
    }

    if (this.actions.left) {
      this.setAngularVelocity(-300);
    } else if (this.actions.right) {
      this.setAngularVelocity(300);
    } else {
      this.setAngularVelocity(0);
    }

    this.scene.physics.world.wrap(this);
  }

  reset() {
    let newX = Math.random() * 100 + 350;
    let newY = Math.random() * 100 + 250;
    if (this.brain) {
      this.setScore(0);
    }
    this.stoppedTime = 0;
    this.body.setEnable(true);
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(newX, newY);
    this.setDamping(true);
    this.setDrag(0.99);
  }

  captureData() {
    let t = this;
    let inputs = [];
    let shipVelocityAngle = this.body.angle;

    // Sorts asteroids group by distance to the ship
    this.scene.meteors.getChildren().sort(t.compare.bind(t));

    // Takes data of nearest asteroids
    for (let i = 0; i < OBSTACLES_DETECTION; i++) {
      let asteroid = this.scene.meteors.getChildren()[i];
      let distance = Phaser.Math.Distance.Between(asteroid.x, asteroid.y, this.x, this.y);
      if (distance > DETECCTION_RADIUS) {
        inputs.concat([ 0, 0, 0, 0 ]);
        continue;
      }

      // Angle asteroid/ship
      let angleA = Phaser.Math.Angle.Between(asteroid.x, asteroid.y, this.x, this.y); // (-PI to +PI)
      let adjust = shipVelocityAngle * -1;
      angleA += adjust;
      angleA = this.normalizeAngle(angleA); // (0 to 1)
      inputs.push(angleA);

      // Angle of asteroid velocity
      let angleB = asteroid.body.angle; // (-PI to PI)
      angleB = this.normalizeAngle(angleB); // (0 to 1)
      inputs.push(angleB);

      // Distance
      distance = this.normalizePixels(distance, 300); // (0 to 1)
      inputs.push(distance);

      // Magnitude of asteroid velocity
      let asteroidSpeed = this.normalizePixels(asteroid.body.speed, 250); // (0 to 1)
      //console.log(asteroid.body.speed);
      inputs.push(asteroidSpeed);
    }

    // Data of the ship
    // Velocity angle
    shipVelocityAngle = this.normalizeAngle(shipVelocityAngle); // (0 to 1)
    inputs.push(shipVelocityAngle);
    // Rotation
    let shipRotation = this.normalizeAngle(this.rotation); // (0 to 1)
    inputs.push(shipRotation);
    // Speed
    let shipSpeed = this.normalizePixels(this.body.speed, 250); // (0 to 1)
    inputs.push(shipSpeed);

    return inputs;
  }

  compare(a, b) {
    let distanceA = Phaser.Math.Distance.Between(a.x, a.y, this.x, this.y);
    let distanceB = Phaser.Math.Distance.Between(b.x, b.y, this.x, this.y);
    return distanceA - distanceB;
  }

  normalizeAngle(angle) {
    let a = 0;
    if (angle < 0) {
      a = (angle + Phaser.Math.PI2) / Phaser.Math.PI2;
    } else if (angle > 0) {
      a = angle / Phaser.Math.PI2;
    }

    return a;
  }

  normalizePixels(pixels, max) {
    let p = pixels / max; // (value - min)/(max - min)
    if (p < 0) {
      p = 0;
    }
    return p;
  }
}
