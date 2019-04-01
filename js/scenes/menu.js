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
    this.data3Y = 0;
    this.lineHeight = 0;

    // Ranking position of the selected genome of current generation
    this.selectedGenome = 1;
  }

  create() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;

    // Button: Config
    this.bt_config = this.add
      .existing(new ButtonGenerator(this, t.marginX, t.marginY, 'CONFIG', buttonConfig))
      .setOrigin(0);
    this.lineHeight = this.bt_config.height + this.paddingY;

    // Lines
    const g = this.add.graphics();
    g.lineStyle(2, 0xffffff, 0.9);
    g.lineBetween(
      t.marginX,
      t.marginY + 3 * t.lineHeight,
      t.game.config.width - t.marginX,
      t.marginY + 3 * t.lineHeight
    );

    // Labels
    const text1 = 'POPULATION\n' + 'Number of genomes \n' + 'Current generation \n' + 'Max Score ';
    const text2 = 'BEST GENOME ALL GENS\n' + 'Hidden neurons \n' + 'Score ';
    const text3 = 'CURRENT GENOMES\n' + 'Hidden neurons \n' + 'Ranking';
    const initialDataTxt1 = '\n' + '0\n' + '0\n' + '0';
    const initialDataTxt2 = '\n' + '0\n' + '0';
    const initialDataTxt3 = '\n' + '0\n';
    this.secondLineY = this.setLabels(t.marginX, t.marginY + 3 * t.lineHeight + t.paddingY, text1, text2, text3, g);
    // Data labels
    this.data_txt1 = this.add.bitmapText(t.data1X, t.data1Y, 'bmf', initialDataTxt1, 20);
    this.data_txt2 = this.add.bitmapText(t.data2X, t.data2Y, 'bmf', initialDataTxt2, 20);
    this.data_txt3 = this.add.bitmapText(t.data1X, t.data3Y, 'bmf', initialDataTxt3, 20);
    this.data_ranking = this.add.bitmapText(t.data1X, t.data3Y, 'bmf', '\n\n1', 20);

    this.makeButtons();
    this.setButtonEvents();

    // Buttons events

    if (LOADED_POPULATION) {
      this.showPopulationData();
    } else {
      this.bt_evolveLoaded.disable();
      this.bt_evolveFromGenome.disable();
      this.bt_test.disable();
      this.bt_save.disable();
      this.bt_resetGenome.disable();
      this.bt_evolveCurrentGenome.disable();
      this.bt_testCurrent.disable();
    }
  }

  setLabels(originX, originY, text1, text2, text3, graphics) {
    let bmt1 = this.add.bitmapText(originX, originY, 'bmf', text1, 20);
    let bmt2 = this.add.bitmapText(originX, originY + bmt1.height + 2 * this.paddingY, 'bmf', text2, 20);
    let lineY = originY + this.paddingY + bmt1.height;
    graphics.lineBetween(this.marginX, lineY, this.game.config.width - this.marginX, lineY);

    this.data1X = originX + bmt1.width + this.paddingY;
    this.data2X = this.data1X;
    this.data1Y = originY;
    this.data2Y = originY + bmt1.height + 2 * this.paddingY;
    this.data3Y = this.data2Y + bmt2.height + 2 * this.paddingY;

    let lineY2 = this.data3Y - this.paddingY;
    graphics.lineBetween(this.marginX, lineY2, this.game.config.width - this.marginX, lineY2);

    let bmt3 = this.add.bitmapText(originX, this.data3Y, 'bmf', text3, 20);

    return lineY;
  }

  makeButtons() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;

    // Button: Evolve New Population
    this.bt_evolve = this.add
      .existing(new ButtonGenerator(t, t.marginX, t.marginY + t.lineHeight, 'EVOLVE NEW POPULATION', buttonConfig))
      .setOrigin(0);

    //// Population buttons /////////////////////
    // Button: Evolve Loaded Population
    this.bt_evolveLoaded = this.add
      .existing(new ButtonGenerator(t, t.game.config.width - t.marginX, t.data1Y, 'EVOLVE', buttonConfig))
      .setOrigin(1, 0);

    // Button: Save Population
    this.bt_save = this.add
      .existing(
        new ButtonGenerator(
          t,
          t.bt_evolveLoaded.x - t.bt_evolveLoaded.width - t.paddingY,
          t.data1Y,
          'SAVE',
          buttonConfig
        )
      )
      .setOrigin(1, 0);
    // Button: Load Population
    this.bt_load = this.add
      .existing(new ButtonGenerator(t, t.bt_save.x - t.bt_save.width - t.paddingY, t.data1Y, 'LOAD', buttonConfig))
      .setOrigin(1, 0);

    //// Best genome buttons /////////////////////
    // Button: Evolve Best Genome
    this.bt_evolveFromGenome = this.add
      .existing(
        new ButtonGenerator(t, t.game.config.width - t.marginX, t.data2Y, 'EVOLVE', buttonConfig)
      )
      .setOrigin(1, 0);

    // Button: Test Best Genome
    this.bt_test = this.add
      .existing(
        new ButtonGenerator(
          t,
          t.bt_evolveFromGenome.x - t.bt_evolveFromGenome.width - t.paddingY,
          t.data2Y,
          'TEST',
          buttonConfig
        )
      )
      .setOrigin(1, 0);

    // Button: Reset Genome
    this.bt_resetGenome = this.add
      .existing(
        new ButtonGenerator(
          t,
          t.bt_test.x - t.bt_test.width - t.paddingY,
          t.data2Y,
          'RESET',
          buttonConfig
        )
      )
      .setOrigin(1, 0);

    // Button: Evolve Current Genome
    this.bt_evolveCurrentGenome = this.add
      .existing(new ButtonGenerator(t, t.game.config.width - t.marginX, t.data3Y, 'EVOLVE', buttonConfig))
      .setOrigin(1, 0);

    // Button: Test Current Genome
    this.bt_testCurrent = this.add
      .existing(
        new ButtonGenerator(
          t,
          t.game.config.width - t.marginX - t.bt_evolveFromGenome.width - t.paddingY,
          t.data3Y,
          'TEST',
          buttonConfig
        )
      )
      .setOrigin(1, 0);

    this.makeAddButton(
      t.bt_testCurrent.x - 2 * t.bt_testCurrent.width,
      t.data3Y,
      1,
      5000,
      'selectedGenome',
      t.data_ranking,
      '>',
      'increase'
    );
    this.makeAddButton(
      t.bt_testCurrent.x - 3 * t.bt_testCurrent.width,
      t.data3Y,
      1,
      1,
      'selectedGenome',
      t.data_ranking,
      '<',
      'decrease'
    );
  }

  makeAddButton(x, y, step, limit, property, label, caption, control) {
    const t = this;
    let ButtonConfig = {
      fontKey: 'bmf',
      fontSize: 20,
      textColor: '0xffffee',
      buttonColor: '0xffffff',
      control: control,
      object: t
    };

    let bt_genome_plus = this.add.existing(new ButtonGenerator(this, x, y, caption, ButtonConfig)).setOrigin(1, 0);
    bt_genome_plus.step = step;
    bt_genome_plus.limit = limit;
    bt_genome_plus.property = property;
    bt_genome_plus.callback = function(value) {
      label.setText(`\n\n${value}`);
    }.bind(this);
  }

  makeMinusButton() {}

  setButtonEvents() {
    const t = this;
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
        /*if (localStorage.hasOwnProperty(GLOBALS.BEST_GEN_STORE_NAME)) {
          this.clean();
          this.scene.start('test');
        }*/
        this.clean();
        this.scene.start('test', { network: LOADED_POPULATION[3] });
      },
      t
    );

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
        LOADED_POPULATION = null;
        this.scene.start('evolve');
      },
      t
    );

    this.bt_evolveLoaded.on(
      'pointerup',
      function() {
        this.clean();
        this.scene.start('evolve', { population: LOADED_POPULATION });
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

    this.bt_resetGenome.on(
      'pointerup',
      function() {
        LOADED_POPULATION[2] = 0;
        localStorage.removeItem('maxScore');
        t.showPopulationData();
        t.bt_test.disable();
        t.bt_evolveFromGenome.disable();
      },
      t
    );

    this.bt_save.on(
      'pointerup',
      function() {
        this.clean();
        this.savePopulation();
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
      //array --> [Ngeneration, neuralNetwork[], maxScore, bestGenome]
      LOADED_POPULATION = JSON.parse(txtPopulation);
      t.selectedGenome = 1;
      t.showPopulationData();
    };
    reader.readAsText(files[0]);
  }

  savePopulation(){
    const blob = new Blob([ JSON.stringify(LOADED_POPULATION) ], {
      type: 'text/plain'
    });

    let anchor = document.createElement('a');
    anchor.download = 'population.JSON';
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [ 'text/plain', anchor.download, anchor.href ].join(':');
    anchor.click();
  }

  showPopulationData() {
    let populationSize = LOADED_POPULATION[1].length;
    let generation = LOADED_POPULATION[0];
    let maxScore = LOADED_POPULATION[2];
    this.data_txt1.setText(`\n${populationSize}\n${generation}\n${maxScore}`);

    let bestHiddenNeurons = LOADED_POPULATION[3].nodes.length - GLOBALS.INPUTS_SIZE;
    let selectedHiddenNeurons = LOADED_POPULATION[1][this.selectedGenome - 1].nodes.length - GLOBALS.INPUTS_SIZE;

    this.data_txt2.setText(`\n${bestHiddenNeurons}\n${maxScore}`);
    this.data_txt3.setText(`\n${selectedHiddenNeurons}`);
    this.data_ranking.setText('\n\n1');

    this.bt_evolveLoaded.enable();
    this.bt_save.enable();
    if (LOADED_POPULATION[2]) {
      this.bt_evolveFromGenome.enable();
      this.bt_test.enable();
      this.bt_resetGenome.enable();
    }
    this.bt_evolveCurrentGenome.enable();
    this.bt_testCurrent.enable();
  }

  clean() {
    for (let i = 0, j = this.children.length; i < j; i++) {
      if (this.children.list[i] instanceof ButtonGenerator) {
        this.children.list[i].clean();
      }
    }
  }
}
