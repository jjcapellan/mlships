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
    this.maxScroll = 900; // change on last row
  }

  create() {
    const g = this.add.graphics();
    g.lineStyle(2, 0xffffff, 0.9);

    let marginX = this.marginX;
    let gameWidth = this.game.config.width;
    let marginTop = this.marginY;

    let content = {
      population: 'Number of genomes to evaluate in each generation.',
      radius: 'Maximum distance perceived by each individual.',
      hidden: 'More does not allways means better results.',
      time: '(1x - 5x) High values could affect performance.',
      mutation: '% of the population that will randomly mutate.',
      elitism: '% of best genomes that will be preserved to next generation.',
      obstacles: 'Number of obstacles',
      sensors: 'Areas around the ship where the data is collected.'
    };

    let bmf = this.add.bitmapText(0, 0, 'bmf', 'A', 20);
    this.letterWidth = bmf.width;
    bmf.destroy();

    //// First Row 1
    // Title
    let pop_txt = this.add.bitmapText(marginX, marginTop, 'bmf', 'POPULATION', 20);
    // Observations
    let popObs_txt = this.add.bitmapText(marginX, pop_txt.y + pop_txt.height, 'bmf', content.population, 16);
    // Line
    g.lineBetween(marginX, popObs_txt.y + popObs_txt.height, gameWidth - marginX, popObs_txt.y + popObs_txt.height);
    // Dta label
    let popLabel = this.add
      .bitmapText(
        this.game.config.width - marginX,
        popObs_txt.y + popObs_txt.height - 4,
        'bmf',
        `${GLOBALS.POPULATION_AMOUNT}`,
        20
      )
      .setOrigin(1, 1);
    // Minus button
    this.addMinusButton(
      this.game.config.width - marginX - 8 * this.letterWidth,
      popLabel.y,
      5,
      5,
      'POPULATION_AMOUNT',
      popLabel
    ).setOrigin(1);
    // Plus button
    this.addPlusButton(
      this.game.config.width - marginX - 5 * this.letterWidth,
      popLabel.y,
      5,
      10000,
      'POPULATION_AMOUNT',
      popLabel
    ).setOrigin(1);
    // Height of first row
    this.rowHeight = popObs_txt.y + popObs_txt.height - pop_txt.y + this.paddingY;

    ///// Next rows
    this.addRow(2, 'MUTATION RATE', content.mutation, GLOBALS.MUTATION_RATE, 0.05, 0.05, 1, 'MUTATION_RATE', g);
    this.addRow(3, 'ELITISM', content.elitism, GLOBALS.ELITISM_PERCENT, 0.05, 0, 0.95, 'ELITISM_PERCENT', g);
    this.addRow(
      4,
      'START HIDDEN NEURONS',
      content.hidden,
      GLOBALS.START_HIDDEN_SIZE,
      1,
      0,
      1000,
      'START_HIDDEN_SIZE',
      g
    );
    this.addRow(5, 'TIME SCALE', content.time, GLOBALS.SIMULATION_SPEED, 1, 1, 5, 'SIMULATION_SPEED', g);
    this.addRow(6, 'RADIUS DETECTION', content.radius, GLOBALS.DETECTION_RADIUS, 10, 80, 8000, 'DETECTION_RADIUS', g);
    this.addRow(7, 'OBSTACLES', content.radius, GLOBALS.OBSTACLES_AMOUNT, 1, 1, 500, 'OBSTACLES_AMOUNT', g);
    this.addRow(8, 'SENSORS', content.sensors, GLOBALS.INPUTS_SIZE, 1, 2, 100, 'INPUTS_SIZE', g);

    //// Add footer buttons
    this.setButtons();

    //// Camera to make the vertical scroll
    let optionsScroll = this.cameras.add(
      0,
      0,
      this.game.config.width,
      this.game.config.height - this.marginY - this.paddingY - 60
    );
    optionsScroll.setBackgroundColor(0x000000);
    optionsScroll.transparent = false;
    optionsScroll.scrollY = this.game.config.height;

    this.input.on(
      'pointermove',
      function(pointer) {
        if (pointer.primaryDown) {
          optionsScroll.scrollY -= pointer.position.y - pointer.prevPosition.y;
          optionsScroll.scrollY = Math.max(this.game.config.height, optionsScroll.scrollY);
          optionsScroll.scrollY = Math.min(this.maxScroll, optionsScroll.scrollY);
        }
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

  addRow(rowNumber, title, content, label, step, min, max, property, g) {
    const t = this;
    let x = this.marginX;
    // Header
    let bmf1 = this.add.bitmapText(x, (rowNumber - 1) * this.rowHeight + this.marginY, 'bmf', title, 20);
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
          this.saveData('population_amount', 'POPULATION_AMOUNT');
          this.saveData('mutation_rate', 'MUTATION_RATE');
          this.saveData('elitism_percent', 'ELITISM_PERCENT');
          this.saveData('detection_radius', 'DETECTION_RADIUS');
          this.saveData('start_hidden_size', 'START_HIDDEN_SIZE');
          this.saveData('simulation_speed', 'SIMULATION_SPEED');
          this.saveData('obstacles_amount', 'OBSTACLES_AMOUNT');
          this.saveData('inputs_size', 'INPUTS_SIZE');
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

  saveData(key, property) {
    localStorage.setItem(key, GLOBALS[property]);
  }

  clean() {
    for (let i = 0, j = this.children.length; i < j; i++) {
      if (this.children.list[i] instanceof ButtonGenerator) {
        this.children.list[i].clean();
      }
    }
  }
}
