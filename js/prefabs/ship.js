class Ship extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    scene.physics.world.enable(this);
    this.x = this.scene.game.config.width / 2;
    this.y = this.scene.game.config.height / 2;
    // physics properties adjusted to the time scale
    this.realSpeed = GLOBALS.SHIP_SPEED * GLOBALS.SIMULATION_SPEED;
    this.realAngularSpeed = GLOBALS.SHIP_ANGULAR_SP * GLOBALS.SIMULATION_SPEED;
    // inputs and outputs of the neural network
    this.inputs = [];
    this.outputs = [];
    // sensors angles
    this.sensorAngles = [];
    // possible actions
    this.actions = {
      left: false,
      right: false
    };
  }

  init() {
    let bodyRadius = this.height * 0.5;
    this.setOrigin(0.5);
    this.body.setMaxVelocity(this.realSpeed);
    this.body.setCircle(bodyRadius, -bodyRadius + 0.5 * this.width, -bodyRadius + 0.5 * this.height);
    this.setInteractive();
    this.initAngles(GLOBALS.INPUTS_SIZE - 1);
    this.reset();
  }

  setBrain(brain) {
    // neural network
    this.brain = brain;
    this.brain.score = 0;
  }

  setScore(score) {
    this.brain.score = score;
  }

  initArray(length) {
    let array = [];
    //[1,1,...,1]
    for (let i = 0; i < length; i++) {
      array.push(1);
    }
    return array;
  }

  initAngles(length) {
    let angle = 0;
    let sensorStep = Phaser.Math.PI2 / GLOBALS.INPUTS_SIZE;
    for (let i = 0; i < length; i++) {
      angle += sensorStep;
      this.sensorAngles.push(angle);
    }
    this.sensorAngles.push(Phaser.Math.PI2);
  }

  update() {
    // Takes data
    this.inputs = this.captureData();
    // Process data in the neural network
    this.outputs = this.brain.activate(this.inputs);
    // Sets the actions
    this.actions.left = this.outputs[0] > 0.5 && this.outputs[0] >= this.outputs[1];
    this.actions.right = this.outputs[1] > 0.5 && this.outputs[1] > this.outputs[0];
    // Executes the actions
    if (this.actions.left) {
      this.body.setAngularVelocity(-this.realAngularSpeed);
    } else if (this.actions.right) {
      this.body.setAngularVelocity(this.realAngularSpeed);
    } else {
      this.body.setAngularVelocity(0);
    }
    // Constant velocity
    this.scene.physics.velocityFromRotation(this.rotation, this.realSpeed, this.body.velocity);
    this.scene.physics.world.wrap(this);
  }

  reset() {
    let newX = Math.random() * 100 + 350;
    let newY = Math.random() * 100 + 250;
    if (this.brain) {
      this.setScore(0);
    }
    this.body.setEnable(true);
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(newX, newY);
  }

  /**
   * Makes the array with the inputs. The arround space to the ship is divided in zones. Each zone represents a sensor.
   * The sensors sets the value of its inputs.
   * If a sensor is active, then returns the normalized distance to the obstacle, else 1 (DETECTION_RADIUS normalized).
   * @return {numer[]} Inputs for the network. Array of numbers between 0 and 1.
   * @memberof Ship
   */
  captureData() {
    let t = this;
    // Initial value of sensors [1,1,1, ...,1]
    let inputs = this.initArray(GLOBALS.INPUTS_SIZE);

    let shipAngle = this.rotation; // In radians. Valid because in this case angle of velocity = this.rotation

    // Takes data of asteroids
    for (let i = 0; i < GLOBALS.OBSTACLES_AMOUNT; i++) {
      let asteroid = this.scene.asteroids.getChildren()[i];
      // The ship is wrapped to the screen so for each obstacle there is a "gosth obstacle"
      // What X and Y are closest?
      let ast_x = asteroid.x;
      let ast_y = asteroid.y;
      let ast_xr = this.x > ast_x ? this.scene.game.config.width + ast_x : ast_x - this.scene.game.config.width;
      let ast_yr = this.x > ast_x ? this.scene.game.config.height + ast_y : ast_y - this.scene.game.config.height;

      if (Math.abs(this.x - ast_x) > Math.abs(this.x - ast_xr)) {
        ast_x = ast_xr;
      }
      if (Math.abs(this.y - ast_y) > Math.abs(this.y - ast_yr)) {
        ast_y = ast_yr;
      }

      // Is the point near to activate some sensor?
      let distance = Phaser.Math.Distance.Between(ast_x, ast_y, this.x, this.y) - asteroid.body.halfWidth;
      if (distance > GLOBALS.DETECTION_RADIUS) {
        continue;
      }

      // The angle determines which sensor is activated.
      let angleShipAsteroid = Phaser.Math.Angle.Between(this.x, this.y, ast_x, ast_y) + shipAngle * -1;

      if (angleShipAsteroid < 0) {
        angleShipAsteroid += Phaser.Math.PI2;
      }

      distance = this.normalizePixels(distance, GLOBALS.DETECTION_RADIUS, 0);

      let angles = this.sensorAngles.length;
      for (let i = 0; i < angles; i++) {
        if (angleShipAsteroid < this.sensorAngles[i]) {
          if (distance < inputs[i]) {
            inputs[i] = distance;
            break;
          }
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

  saveNNtoStorage() {
    let jsonNN = this.brain.toJSON();
    localStorage.setItem('selectedNN', JSON.stringify(jsonNN));
  }
}
