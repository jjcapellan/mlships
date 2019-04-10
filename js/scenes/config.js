class Configuration extends Phaser.Scene {
  constructor() {
    super('configuration');
  }

  init() {
    this.marginX = 50;
    this.buttonsMarginY = 30;
    this.marginY = this.game.config.height + this.buttonsMarginY;
    this.paddingY = 16;
    this.centerX = this.game.config.width / 2;
    this.actualBottomRow = this.marginY;
    this.configProperties = [];
  }

  create() {
    const g = this.add.graphics();
    g.lineStyle(2, 0xffffff, 0.9);

    let content = {
      population: 'Number of genomes to evaluate in each generation.',
      radius: 'Maximum distance perceived by each individual.',
      hidden:
        'They increase the abstraction capacity of the neural network.\n' +
        'More does not allways means better results. During evolution\n' +
        'this number will change in some genomes.',
      time: '(1x - 5x) High values could affect to simulation accuracy.',
      mutation: '% of the population that will randomly mutate.',
      mutationAmount:
        'If mutation occurs , sets the amount of times the mutation\n' + 'will be applied to the network.',
      elitism: '% of best genomes that will be preserved to next generation.',
      obstacles: 'Number of obstacles',
      sensors:
        'Number of sensors. A sensor is a controled area. Each sensor\n' +
        'provides data to an input. The angle of vision of each sensor\n' +
        'will be 360 / number of sensors.',
      topPercentage:
        '% of the population that is selected to be parents after\n' + 'ordering them by score from best to worst.',
      randomGenomes:
        '% of the future population which will be the result of the\n' +
        'crossing of existing genomes with new random genomes.',
      equal:
        'If set to 1, all genomes will be viewed equal during crossover.\n' +
        'This stimulates more diverse network architectures.',
      agentSpeed:
        'Speed in pixels/second. High speeds require increasing fps of\n' + 'the physics engine to avoid tunneling.',
      angularSpeed: 'Speed in degrees/second, with which the ship will rotate.\n' + 'E.g. 360 = 1 turn per second',
      obstacleSpeed: 'Speed in pixels/second of the obstacles'
    };

    let bmf = this.add.bitmapText(0, 0, 'bmf', 'A', 20);
    this.letterWidth = bmf.width;
    bmf.destroy();

    ///// Rows
    this.addTitle('POPULATION SETTINGS', g);
    this.addRow('POPULATION', content.population, GLOBALS.POPULATION_AMOUNT, 5, 5, 10000, 'POPULATION_AMOUNT', g);
    this.addRow('MUTATION RATE', content.mutation, GLOBALS.MUTATION_RATE, 0.05, 0.05, 1, 'MUTATION_RATE', g);
    this.addRow('MUTATION AMOUNT', content.mutationAmount, GLOBALS.MUTATION_AMOUNT, 1, 1, 100, 'MUTATION_AMOUNT', g);
    this.addRow('HIDDEN NEURONS', content.hidden, GLOBALS.START_HIDDEN_SIZE, 1, 0, 1000, 'START_HIDDEN_SIZE', g);
    this.addTitle('SELECTION SETTINGS', g);
    this.addRow('ELITISM', content.elitism, GLOBALS.ELITISM_PERCENT, 0.05, 0, 0.95, 'ELITISM_PERCENT', g);
    this.addRow('TOP PERCENTAGE', content.topPercentage, GLOBALS.TOP_PERCENTAGE, 0.05, 0.05, 0.9, 'TOP_PERCENTAGE', g);
    this.addRow('RANDOM PARENTS', content.randomGenomes, GLOBALS.RANDOM_PERCENT, 0.05, 0, 1, 'RANDOM_PERCENT', g);
    this.addRow('EQUAL', content.equal, GLOBALS.EQUAL, 1, 0, 1, 'EQUAL', g);
    this.addTitle('SHIP SETTINGS', g);
    this.addRow('SENSORS', content.sensors, GLOBALS.INPUTS_SIZE, 1, 2, 100, 'INPUTS_SIZE', g);
    this.addRow('RADIUS DETECTION', content.radius, GLOBALS.DETECTION_RADIUS, 10, 80, 8000, 'DETECTION_RADIUS', g);
    this.addRow('SHIP SPEED', content.agentSpeed, GLOBALS.SHIP_SPEED, 10, 10, 1000, 'SHIP_SPEED', g);
    this.addRow('SHIP ANGULAR SPEED', content.angularSpeed, GLOBALS.SHIP_ANGULAR_SP, 5, 5, 8000, 'SHIP_ANGULAR_SP', g);
    this.addTitle('OBSTACLES SETTINGS', g);
    this.addRow('OBSTACLES AMOUNT', content.obstacles, GLOBALS.OBSTACLES_AMOUNT, 1, 1, 500, 'OBSTACLES_AMOUNT', g);
    this.addRow('OBSTACLES SPEED', content.obstacleSpeed, GLOBALS.ASTEROID_SPEED, 10, 10, 1000, 'ASTEROID_SPEED', g);

    //// Add footer buttons
    this.setButtons();

    //// Vertical scroll
    // Camera to make the vertical scroll
    this.camera = this.cameras.add(
      0,
      0,
      this.game.config.width,
      this.game.config.height - 90 // - this.buttonMarginY - this.paddingY - 60
    );
    let camera = this.camera;
    camera.setBackgroundColor(0x000000);
    camera.transparent = false;
    camera.scrollY = this.game.config.height;

    // Limits of scroll
    let bottom = this.actualBottomRow;
    let top = this.game.config.height;

    let scroll = new Scroll(this, camera, top, bottom, { wheel: true, wheelFactor: 0.2 });

    // Free resources of Scroll object
    this.events.on(
      'shutdown',
      function() {
        scroll.destroy();
      },
      this
    );
  }

  addPlusButton(x, y, step, limit, property, label) {
    let plusButtonConfig = {
      fontKey: 'bmf',
      fontSize: 20,
      textColor: '0xffffee',
      buttonColor: '0xffffff',
      control: 'increase',
      object: GLOBALS
    };

    let button = this.add.existing(new ButtonGenerator(this, x, y, '>', plusButtonConfig)).setOrigin(0, 0.5);
    button.step = step;
    button.limit = limit;
    button.property = property;
    button.callback = function(value) {
      label.setText(value);
    }.bind(this);
    return button;
  }

  addMinusButton(x, y, step, limit, property, label) {
    let minusButtonConfig = {
      fontKey: 'bmf',
      fontSize: 20,
      textColor: '0xffffee',
      buttonColor: '0xffffff',
      control: 'decrease',
      object: GLOBALS
    };

    let button = this.add.existing(new ButtonGenerator(this, x, y, '<', minusButtonConfig)).setOrigin(0, 0.5);
    button.step = step;
    button.limit = limit;
    button.property = property;
    button.callback = function(value) {
      label.setText(value);
    }.bind(this);
    return button;
  }

  addRow(title, content, label, step, min, max, property, g) {
    const t = this;
    let x = this.marginX;
    // Header
    let bmf1 = this.add.bitmapText(x, this.actualBottomRow, 'bmf', title, 20);
    // Observations
    let bmf2 = this.add.bitmapText(x, bmf1.height + bmf1.y, 'bmf', content, 16);
    // Line
    g.lineBetween(x, bmf2.height + bmf2.y, this.game.config.width - x, bmf2.height + bmf2.y);
    // Data label
    let dataLabel = this.add
      .bitmapText(this.game.config.width - x, bmf2.height + bmf2.y - 6, 'bmf', label, 20)
      .setOrigin(1, 1);
    // Minus button
    this.addMinusButton(
      this.game.config.width - x - 8 * this.letterWidth,
      dataLabel.y,
      step,
      min,
      property,
      dataLabel
    ).setOrigin(1, 1);
    // Plus button
    this.addPlusButton(
      this.game.config.width - x - 5 * this.letterWidth,
      dataLabel.y,
      step,
      max,
      property,
      dataLabel
    ).setOrigin(1, 1);

    let bottom = bmf2.height + bmf2.y + this.paddingY;

    this.actualBottomRow = bottom;
    this.configProperties.push(property);
  }

  addTitle(title, g) {
    const t = this;
    let x = this.marginX;
    // Title
    let bmf1 = this.add.bitmapText(x, this.actualBottomRow, 'bmf', title, 24);
    bmf1.setTint(0xee0000);
    g.lineBetween(x, bmf1.y + bmf1.height, this.game.config.width - x, bmf1.y + bmf1.height);
    let bottom = bmf1.y + bmf1.height + this.paddingY;

    this.actualBottomRow = bottom;
  }

  setButtons() {
    const t = this;

    // Restore button
    this.bt_restore = this.add.existing(
      new ButtonGenerator(
        this,
        this.marginX,
        this.game.config.height - this.buttonsMarginY,
        'DEFAULTS',
        GLOBALS.BUTTON_CONFIG
      )
    );
    this.bt_restore
      .on(
        'pointerup',
        function() {
          this.restore();
        },
        t
      )
      .setOrigin(0, 1);

    // Back button
    this.bt_back = this.add
      .existing(
        new ButtonGenerator(
          this,
          this.game.config.width - this.marginX,
          this.game.config.height - this.buttonsMarginY,
          'BACK',
          GLOBALS.BUTTON_CONFIG
        )
      )
      .setOrigin(0.5);
    this.bt_back
      .on(
        'pointerup',
        function() {
          window.removeEventListener('wheel', this.wheelHandler);
          this.scene.start('menu');
        },
        t
      )
      .setOrigin(1, 1);

    // Save button
    this.bt_save = this.add
      .existing(
        new ButtonGenerator(
          this,
          this.centerX,
          this.game.config.height - this.buttonsMarginY,
          'SAVE',
          GLOBALS.BUTTON_CONFIG
        )
      )
      .setOrigin(0.5);
    this.bt_save
      .on(
        'pointerup',
        function() {
          this.saveJSONtoStorage(this.makeConfigObj(), 'configObj');
          window.removeEventListener('wheel', this.wheelHandler);
          this.clean(); // Clean all custom buttons
          this.scene.start('menu');
        },
        t
      )
      .setOrigin(0.5, 1);
  }

  restore() {
    GLOBALS = JSON.parse(JSON.stringify(GLOBALS_BACKUP));
    this.scene.restart();
  }

  makeConfigObj() {
    let obj = {};
    for (let i = 0, j = this.configProperties.length; i < j; i++) {
      let propertyName = this.configProperties[i];
      obj[propertyName] = GLOBALS[propertyName];
    }
    return obj;
  }

  saveJSONtoStorage(element, key) {
    localStorage.setItem(key, JSON.stringify(element));
  }

  clean() {
    for (let i = 0, j = this.children.length; i < j; i++) {
      if (this.children.list[i] instanceof ButtonGenerator) {
        this.children.list[i].clean();
      }
    }
  }
}
