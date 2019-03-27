class Configuration extends Phaser.Scene {
  constructor() {
    super('configuration');
  }

  create() {
    let t = this;
    let centerX = this.game.config.width / 2;
    let marginTop = 135;
    let padding = 35;

    // Labels
    this.add.bitmapText(centerX, marginTop, 'bmf', 'POPULATION', 20).setOrigin(0.5);
    this.add.bitmapText(centerX, marginTop + 2 * padding, 'bmf', 'DETECTION RADIUS', 20).setOrigin(0.5);
    this.add.bitmapText(centerX, marginTop + 4 * padding, 'bmf', 'START HIDDEN NEURONS', 20).setOrigin(0.5);

    // Data labels
    this.lbl_population = this.add
      .bitmapText(centerX, marginTop + padding, 'bmf', `${GLOBALS.POPULATION_AMOUNT}`, 20)
      .setOrigin(0.5);
    this.lbl_detection = this.add
      .bitmapText(centerX, marginTop + 3 * padding, 'bmf', `${GLOBALS.DETECTION_RADIUS}`, 20)
      .setOrigin(0.5);
    this.lbl_hiddenNeurons = this.add
      .bitmapText(centerX, marginTop + 5 * padding, 'bmf', `${GLOBALS.START_HIDDEN_SIZE}`, 20)
      .setOrigin(0.5);

    // Minus buttons
    this.addMinusButton(centerX - 200, marginTop + padding, 5, 5, 'POPULATION_AMOUNT', this.lbl_population);
    this.addMinusButton(centerX - 200, marginTop + 3 * padding, 10, 80, 'DETECTION_RADIUS', this.lbl_detection);
    this.addMinusButton(centerX - 200, marginTop + 5 * padding, 1, 0, 'START_HIDDEN_SIZE', this.lbl_hiddenNeurons);

    // Plus buttons
    this.addPlusButton(centerX + 200, marginTop + padding, 5, 10000, 'POPULATION_AMOUNT', this.lbl_population);
    this.addPlusButton(centerX + 200, marginTop + 3 * padding, 10, 8000, 'DETECTION_RADIUS', this.lbl_detection);
    this.addPlusButton(centerX + 200, marginTop + 5 * padding, 1, 10000, 'START_HIDDEN_SIZE', this.lbl_hiddenNeurons);

    // Restore button
    this.bt_restore = this.add
      .existing(new ButtonGenerator(this, centerX, marginTop + 8 * padding, 'RESTORE DEFAULTS', GLOBALS.BUTTON_CONFIG))
      .setOrigin(0.5);
    this.bt_restore.on(
      'pointerup',
      function() {
        this.restore();
      },
      t
    );

    // Back button
    this.bt_back = this.add
      .existing(new ButtonGenerator(this, centerX, marginTop + 10 * padding, 'BACK', GLOBALS.BUTTON_CONFIG))
      .setOrigin(0.5);
    this.bt_back.on(
      'pointerup',
      function() {
        this.saveData('population_amount', 'POPULATION_AMOUNT');
        this.saveData('detection_radius', 'DETECTION_RADIUS');
        this.saveData('start_hidden_size', 'START_HIDDEN_SIZE');
        this.clean(); // Clean all custom buttons
        this.scene.start('menu');
      },
      t
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

    let bt_hidden_plus = this.add.existing(new ButtonGenerator(this, x, y, '+', plusButtonConfig)).setOrigin(0, 0.5);
    bt_hidden_plus.step = step;
    bt_hidden_plus.limit = limit;
    bt_hidden_plus.property = property;
    bt_hidden_plus.callback = function(value) {
      label.setText(value);
    }.bind(this);
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

    let bt_hidden_plus = this.add.existing(new ButtonGenerator(this, x, y, '-', minusButtonConfig)).setOrigin(0, 0.5);
    bt_hidden_plus.step = step;
    bt_hidden_plus.limit = limit;
    bt_hidden_plus.property = property;
    bt_hidden_plus.callback = function(value) {
      label.setText(value);
    }.bind(this);
  }

  restore() {
    let DEFAULTS = {
      DETECTION_RADIUS: 250,
      OBSTACLES_DETECTION: 4,
      OBSTACLES_AMOUNT: 12,
      POPULATION_AMOUNT: 40,
      MUTATION_RATE: 0.5,
      ELITISM_PERCENT: 0.2,
      PROVENANCE_PERCENT: 0.1,
      START_HIDDEN_SIZE: 0,
      MUTATION_AMOUNT: 1,
      HALF_PI: Math.PI / 2,
      QUARTER_PI: Math.PI / 4,
      OCTAVE_PI: Math.PI / 8,
      PI: Math.PI,
      BUTTON_CONFIG: {
        fontKey: 'bmf',
        fontSize: 20,
        textColor: '0xffffee',
        buttonColor: '0xffffff'
      }
    };

    GLOBALS = DEFAULTS;

    this.lbl_population.setText(GLOBALS.POPULATION_AMOUNT);
    this.lbl_detection.setText(GLOBALS.DETECTION_RADIUS);
    this.lbl_hiddenNeurons.setText(GLOBALS.START_HIDDEN_SIZE);
  } // end restore()

  saveData(key, property) {
    localStorage.setItem(key, GLOBALS[property]);
  }

  clean(){
      for(let i=0,j=this.children.length;i<j;i++){
          if(this.children.list[i] instanceof ButtonGenerator){
              this.children.list[i].clean();
          }
      }
  }

}
