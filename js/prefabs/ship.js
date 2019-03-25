class Ship extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    this.x = 400;
    this.y = 300;
    this.stoppedTime = 0;

    // actions
    this.actions = {
      left: false,
      right: false
    };
  }

  init() {
    let bodyRadius = this.height * 0.5;
    this.setOrigin(0.5);
    this.body.setMaxVelocity(this.scene.conf.ship_speed);
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
    // Takes data
    let inputs = this.captureData();
    // Process data in the neural network
    let outputs = this.brain.activate(inputs);
    // Sets the actions
    this.actions.left = outputs[0] > 0.3 && outputs[0] > outputs[1];
    this.actions.right = outputs[1] > 0.3 && outputs[1] > outputs[0];

    // Executes the actions
    if (this.actions.left) {
      this.setAngularVelocity(-300);
    } else if (this.actions.right) {
      this.setAngularVelocity(300);
    } else {
      this.setAngularVelocity(0);
    }

    // Constant velocity
    this.scene.physics.velocityFromRotation(
      this.rotation,
      this.scene.conf.ship_speed,
      this.body.velocity
    );

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
  }

  /**
   * Makes the array with the inputs:
   * 8 sensors. If a sensor is active, then returns 1, else 0.
   * @return {numer[]} Inputs for the network. Array of numbers between 0 and 1.
   * @memberof Ship
   */
  captureData() {
    let t = this;
    // Initial value of sensors
    let inputs = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

    // Sorts asteroids group by distance to the ship
    this.scene.meteors.getChildren().sort(t.compare.bind(t));
    let shipAngle = this.rotation; // In radians. Valid because in this case angle of velocity = this.rotation

    // Takes data of nearest asteroids
    for (let i = 0; i < OBSTACLES_DETECTION; i++) {
      let asteroid = this.scene.meteors.getChildren()[i];
      let distance = Phaser.Math.Distance.Between(asteroid.x, asteroid.y, this.x, this.y);
      if (distance > DETECTION_RADIUS) {
        continue;
      }
      let angleShipAsteroid =
        Phaser.Math.Angle.Between(this.x, this.y, asteroid.x, asteroid.y) +
        shipAngle * -1;

      if (angleShipAsteroid < 0) {
        if (angleShipAsteroid < -(HALF_PI + QUARTER_PI)) {
          // Sensor Back/Left
          inputs[0] = 1;
        } else if (angleShipAsteroid < -HALF_PI) {
          // Sensor Back/Side/Left
          inputs[1] = 1;
        } else if (angleShipAsteroid < -QUARTER_PI) {
          // Sensor Front/Side/Left
          inputs[2] = 1;
        } else {
          // Sensor Front/Left
          inputs[3] = 1;
        }
      } else {
        if (angleShipAsteroid > HALF_PI + QUARTER_PI) {
          // Sensor Back/Right
          inputs[4] = 1;
        } else if (angleShipAsteroid > HALF_PI) {
          // Sensor Back/Side/Right
          inputs[5] = 1;
        } else if (angleShipAsteroid > QUARTER_PI) {
          // Sensor Front/Side/Right
          inputs[6] = 1;
        } else {
          // Sensor Front/Right
          inputs[7] = 1;
        }
      }
    } // end for

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

  normalizePixels(pixels, max, min) {
    let p = (pixels - min) / (max - min); // (value - min)/(max - min)
    if (p < 0) {
      p = 0;
    }
    return p;
  }
}
