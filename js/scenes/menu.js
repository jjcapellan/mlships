class Menu extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  init() {
    this.el_inputFile = document.getElementById('inputFile');
    this.el_inputFile.addEventListener('change', this.loadPopulation.bind(this), false);
    this.physics.world.setFPS(60);
    // Format
    this.marginX = 50;
    this.marginY = 60;
    this.paddingY = 16;
  }

  create() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;

    // Buttons
    this.bt_config = this.add
      .existing(new ButtonGenerator(this, t.marginX, t.marginY, 'CONFIG', buttonConfig))
      .setOrigin(0);
    let lineHeight = this.bt_config.height + this.paddingY;
    /*this.bt_test = this.add.existing(new ButtonGenerator(this, t.marginX, 290, 'TEST BEST GENOME', buttonConfig)).setOrigin(0);*/
    /*this.bt_evolveFromBest = this.add
      .existing(new ButtonGenerator(this, 50, 350, 'EVOLVE FROM BEST GENOME', buttonConfig))
      .setOrigin(0);*/
    this.bt_evolve = this.add
      .existing(new ButtonGenerator(this, t.marginX, t.marginY + lineHeight, 'EVOLVE NEW POPULATION', buttonConfig))
      .setOrigin(0);
    this.bt_load = this.add
      .existing(new ButtonGenerator(this, this.marginX, t.marginY + 2 * lineHeight, 'LOAD POPULATION', buttonConfig))
      .setOrigin(0);

    // Lines
    const g = this.add.graphics();
    g.lineStyle(2, 0xffffff, 0.9);
    g.lineBetween(t.marginX, t.marginY + 3 * lineHeight, t.game.config.width - t.marginX, t.marginY + 3 * lineHeight);

    // Labels
    const text1 = 'POPULATION\n' + 'Number of genomes \n' + 'Current generation \n' + 'Max Score ';
    const text2 = 'BEST GENOME\n' + 'Hidden neurons \n' + 'Score ';
    this.setLabels(t.marginX, t.marginY + 3 * lineHeight + t.paddingY, text1, text2, g);

    // Buttons events
    this.bt_config.on(
      'pointerup',
      function() {
        this.clean();
        this.scene.start('configuration');
      },
      t
    );

    /*this.bt_test.on(
      'pointerup',
      function() {
        if (localStorage.hasOwnProperty(GLOBALS.BEST_GEN_STORE_NAME)) {
          this.clean();
          this.scene.start('test');
        }
      },
      t
    );*/

    /*this.bt_evolveFromBest.on(
      'pointerup',
      function() {
        let NN;
        let jsonNN = JSON.parse(localStorage.getItem(GLOBALS.BEST_GEN_STORE_NAME));
        if (jsonNN) {
          NN = neataptic.Network.fromJSON(jsonNN);
        } else {
          return;
        }
        this.clean();
        this.scene.start('evolve', { network: NN });
      },
      t
    );*/

    this.bt_evolve.on(
      'pointerup',
      function() {
        this.clean();
        this.scene.start('evolve');
      },
      t
    );

    this.bt_load.on(
      'pointerup',
      function() {
        this.clean();
        this.el_inputFile.click();
      },
      t
    );
  }

  setLabels(originX, originY, text1, text2, graphics) {
    let bmt1 = this.add.bitmapText(originX, originY, 'bmf', text1, 20);
    this.add.bitmapText(originX, originY + bmt1.height + 2 * this.paddingY, 'bmf', text2, 20);
    let lineY = originY + this.paddingY + bmt1.height;
    graphics.lineBetween(this.marginX, lineY, this.game.config.width - this.marginX, lineY);
  }

  loadPopulation(event) {
    const t = this;
    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
      const txtPopulation = this.result;
      const JSONpopulation = JSON.parse(txtPopulation); //array --> [Ngeneration, neuralNetwork[]]
      t.scene.start('evolve', { population: JSONpopulation });
    };
    reader.readAsText(files[0]);
  }

  clean() {
    for (let i = 0, j = this.children.length; i < j; i++) {
      if (this.children.list[i] instanceof ButtonGenerator) {
        this.children.list[i].clean();
      }
    }
  }
}
