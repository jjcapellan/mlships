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
    this.data1X = 0;
    this.data2X = 0;
    this.data1Y = 0;
    this.data2Y = 0;
  }

  create() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;
    
    // Button: Config
    this.bt_config = this.add
      .existing(new ButtonGenerator(this, t.marginX, t.marginY, 'CONFIG', buttonConfig))
      .setOrigin(0);
    let lineHeight = this.bt_config.height + this.paddingY;
      // Button: Evolve New Population
    this.bt_evolve = this.add
      .existing(new ButtonGenerator(this, t.marginX, t.marginY + lineHeight, 'EVOLVE NEW POPULATION', buttonConfig))
      .setOrigin(0);
      // Button: Load Population
    this.bt_load = this.add
      .existing(new ButtonGenerator(this, this.marginX, t.marginY + 2 * lineHeight, 'LOAD POPULATION', buttonConfig))
      .setOrigin(0);
      // Button: Evolve Loaded Population
    this.bt_evolveLoaded = this.add
      .existing(
        new ButtonGenerator(
          t,
          t.game.config.width - t.marginX,
          t.marginY + 3 * lineHeight + t.paddingY,
          'EVOLVE',
          buttonConfig
        )
      )
      .setOrigin(1, 0)
      .disable();
      

    // Lines
    const g = this.add.graphics();
    g.lineStyle(2, 0xffffff, 0.9);
    g.lineBetween(t.marginX, t.marginY + 3 * lineHeight, t.game.config.width - t.marginX, t.marginY + 3 * lineHeight);

    // Labels
    const text1 = 'POPULATION\n' + 'Number of genomes \n' + 'Current generation \n' + 'Max Score ';
    const text2 = 'BEST GENOME\n' + 'Hidden neurons \n' + 'Score ';
    const initialDataTxt1 = '\n' + '0\n' + '0\n' + '0';
    const initialDataTxt2 = '\n' + '0\n' + '0';
    const secondLineY = this.setLabels(t.marginX, t.marginY + 3 * lineHeight + t.paddingY, text1, text2, g);
    this.data_txt1 = this.add.bitmapText(t.data1X, t.data1Y, 'bmf',initialDataTxt1, 20);
    this.data_txt2 = this.add.bitmapText(t.data2X, t.data2Y, 'bmf',initialDataTxt2, 20);

    // Button: Evolve Best Genome
    this.bt_evolveFromGenome = this.add
    .existing(
      new ButtonGenerator(
        t,
        t.game.config.width - t.marginX,
        secondLineY + t.paddingY,
        'EVOLVE',
        buttonConfig
      )
    )
    .setOrigin(1, 0)
    .disable();

    // Button: Test Genome
    this.bt_test = this.add
    .existing(
      new ButtonGenerator(
        t,
        t.game.config.width - t.marginX,
        secondLineY + t.paddingY + lineHeight,
        'TEST',
        buttonConfig
      )
    )
    .setOrigin(1, 0)
    .disable();

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

    /*this.bt_load.on(
      'pointerup',
      function() {
        this.clean();
        this.el_inputFile.click();
      },
      t
    );*/
  }

  setLabels(originX, originY, text1, text2, graphics) {
    let bmt1 = this.add.bitmapText(originX, originY, 'bmf', text1, 20);
    let bmt2 = this.add.bitmapText(originX, originY + bmt1.height + 2 * this.paddingY, 'bmf', text2, 20);
    let lineY = originY + this.paddingY + bmt1.height;
    graphics.lineBetween(this.marginX, lineY, this.game.config.width - this.marginX, lineY);

    this.data1X = originX + bmt1.width + this.paddingY;
    this.data2X = this.data1X;
    this.data1Y = originY;
    this.data2Y = originY + bmt1.height + 2 * this.paddingY

    return lineY;
  }

  loadPopulation(event) {
    const t = this;
    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
      const txtPopulation = this.result;
      //array --> [Ngeneration, neuralNetwork[], maxScore, bestGenome]
      LOADED_POPULATION = JSON.parse(txtPopulation); 
      t.showPopulationData();
      /*t.scene.start('evolve', { population: JSONpopulation });*/
    };
    reader.readAsText(files[0]);
  }

  showPopulationData(){
    let populationSize = LOADED_POPULATION[1].length;
    let generation = LOADED_POPULATION[0];
    let maxScore = LOADED_POPULATION[2];
    this.data_txt1.setText(`\n${populationSize}\n${generation}\n${maxScore}`);

    let hiddenNeurons = 0;
    let jsonNN = LOADED_POPULATION[3];
    if (jsonNN) {
      let nn = neataptic.Network.fromJSON(jsonNN);
      hiddenNeurons = nn.nodes.length - GLOBALS.INPUTS_SIZE;
    }
    this.data_txt2.setText(`\n${hiddenNeurons}\n${maxScore}`);
  }

  clean() {
    for (let i = 0, j = this.children.length; i < j; i++) {
      if (this.children.list[i] instanceof ButtonGenerator) {
        this.children.list[i].clean();
      }
    }
  }
}
