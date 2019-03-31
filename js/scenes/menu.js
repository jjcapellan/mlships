class Menu extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  init() {
    this.el_inputFile = document.getElementById('inputFile');
    this.el_inputFile.addEventListener('change', this.loadPopulation.bind(this), false);
    this.physics.world.setFPS(60);
  }

  create() {
    let t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;

    // Buttons
    this.bt_config = this.add.existing(new ButtonGenerator(this, 50, 230, 'CONFIG', buttonConfig)).setOrigin(0);
    this.bt_test = this.add.existing(new ButtonGenerator(this, 50, 290, 'TEST BEST GENOME', buttonConfig)).setOrigin(0);
    this.bt_evolveFromBest = this.add
      .existing(new ButtonGenerator(this, 50, 350, 'EVOLVE FROM BEST GENOME', buttonConfig))
      .setOrigin(0);
    this.bt_evolve = this.add
      .existing(new ButtonGenerator(this, 50, 410, 'EVOLVE NEW POPULATION', buttonConfig))
      .setOrigin(0);
      this.bt_load = this.add.existing(new ButtonGenerator(this, 50, 470, 'LOAD POPULATION', buttonConfig)).setOrigin(0);

    // Buttons events
    this.bt_config.on(
      'pointerup',
      function() {
        this.clean();
        this.scene.start('configuration');
      },
      t
    );

    this.bt_test.on(
      'pointerup',
      function() {
        if (localStorage.hasOwnProperty(GLOBALS.BEST_GEN_STORE_NAME)) {
          this.clean();
          this.scene.start('test');
        }
      },
      t
    );

    this.bt_evolveFromBest.on(
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
    );

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


  loadPopulation(event) {
    const t = this;
    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
      const txtPopulation = this.result;
      const JSONpopulation = JSON.parse(txtPopulation); //array --> [Ngeneration, neuralNetwork[]]
      t.scene.start('evolve', {population: JSONpopulation});

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
