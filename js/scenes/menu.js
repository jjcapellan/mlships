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
    this.marginY = 50;
    this.paddingY = 16;
    this.actualBottomRow;
  }

  create() {
    const t = this;
    this.makeDefaultButtons();
    // Top limit of info rows
    this.actualBottomRow = this.bt_evolve.y + this.bt_evolve.height + this.paddingY;
    // Graphics object to make lines
    const g = this.add.graphics();
    g.lineStyle(2, 0xffffff, 0.9);
    // Labels of info rows
    const labelsPopulation = [
      'Number of genomes',
      'Current generation',
      'Max score',
      'Number of sensors',
      'Detection radius',
      'Number of obstacles',
      'Ship speed',
      'Ship angular speed',
      'Obstacle speed'
    ];
    const labelsBestGenome = [ 'Hidden neurons', 'Score' ];
    const labelsSelectedGenome = [ 
      'Hidden neurons',
      'Number of sensors',
      'Detection radius',
      'Number of obstacles',
      'Ship speed',
      'Ship angular speed',
      'Obstacle speed'
     ];

    // Row objects
    this.rowPopulation = new MenuRow(
      this,
      'POPULATION',
      labelsPopulation,
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
      this.getPopulationButtons(),
      g
    );

    this.rowBestGenome = new MenuRow(this, 'BEST GENOME', labelsBestGenome, [ 0, 0 ], this.getBestGenomeButtons(), g);

    this.rowSelectedGenome = new MenuRow(
      this,
      'SELECTED GENOME',
      labelsSelectedGenome,
      [ 0, 0, 0, 0, 0, 0, 0 ],
      this.getSelectedGenomeButtons(),
      g
    );

    this.updateUI();

    // Vertical scroll
    let lowerLimit = this.actualBottomRow - this.game.config.height;
    let scroll = new Scroll(this, this.cameras.main, 0, lowerLimit, true, true, {wheelFactor: 0.2});

    // Free resources of Scroll object
    this.events.on('shutdown', function(){
      scroll.dispose();
    }, this);
  }

  updateUI() {
    if (LOADED_POPULATION) {
      this.showPopulationData();
    } else {
      this.bt_evolveLoaded.disable();
      this.bt_evolveFromBest.disable();
      this.bt_test.disable();
      this.bt_save.disable();
      this.bt_saveBest.disable();
      this.bt_resetGenome.disable();
    }

    if (!localStorage.hasOwnProperty('selectedNetwork')) {
      this.bt_saveCurrentGenome.disable();
      this.bt_evolveCurrentGenome.disable();
      this.bt_testCurrent.disable();
    } else {
      this.bt_saveCurrentGenome.enable();
      this.bt_evolveCurrentGenome.enable();
      this.bt_testCurrent.enable();
    }
  }

  getPopulationButtons() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;
    // Button: Evolve Loaded Population
    this.bt_evolveLoaded = this.add.existing(new ButtonGenerator(t, 0, 0, 'EVOLVE', buttonConfig));
    this.bt_evolveLoaded.on(
      'pointerup',
      function() {
        this.clean();
        this.scene.start('evolve', {
          network: null,
          population: LOADED_POPULATION.population,
          conditions: LOADED_POPULATION.learningConditions
        });
      },
      t
    );
    // Button: Save Population
    this.bt_save = this.add.existing(new ButtonGenerator(t, 0, 0, 'SAVE', buttonConfig));
    this.bt_save.on(
      'pointerup',
      function() {
        this.clean();
        this.saveElement(LOADED_POPULATION, 'population.JSON');
      },
      t
    );
    // Button: Load Population
    this.bt_load = this.add.existing(new ButtonGenerator(t, 0, 0, 'LOAD', buttonConfig));
    this.bt_load.on(
      'pointerup',
      function(event) {
        this.clean();
        this.el_inputFile.click();
      },
      t
    );

    return [ this.bt_evolveLoaded, this.bt_save, this.bt_load ];
  } // end getPopulationButtons()

  getBestGenomeButtons() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;
    // Button: Evolve best genome
    this.bt_evolveFromBest = this.add.existing(new ButtonGenerator(t, 0, 0, 'EVOLVE', buttonConfig));
    this.bt_evolveFromBest.on(
      'pointerup',
      function() {
        let NN = neataptic.Network.fromJSON(LOADED_POPULATION.bestGenome.genome);
        let conditions = LOADED_POPULATION.bestGenome.conditions;
        this.cleanStoredGens();
        LOADED_POPULATION = null;
        this.clean();
        this.scene.start('evolve', { network: NN, population: null, conditions: conditions });
      },
      t
    );

    // Button: Test best genome
    this.bt_test = this.add.existing(new ButtonGenerator(t, 0, 0, 'TEST', buttonConfig));
    this.bt_test.on(
      'pointerup',
      function() {
        this.clean();
        let conditions = LOADED_POPULATION.bestGenome.conditions;
        this.scene.start('test', { network: LOADED_POPULATION.bestGenome.genome, conditions: conditions });
      },
      t
    );

    // Button: Reset best genome
    this.bt_resetGenome = this.add.existing(new ButtonGenerator(t, 0, 0, 'RESET', buttonConfig));
    this.bt_resetGenome.on(
      'pointerup',
      function() {
        LOADED_POPULATION.bestGenome = null;
        LOADED_POPULATION.maxScore = 0;
        localStorage.removeItem('maxScore');
        localStorage.removeItem(GLOBALS.BEST_GEN_STORE_NAME);
        t.showPopulationData();
        t.bt_test.disable();
        t.bt_evolveFromBest.disable();
        t.bt_saveBest.disable();
      },
      t
    );
    // Button: Save best genome
    this.bt_saveBest = this.add.existing(new ButtonGenerator(t, 0, 0, 'SAVE', buttonConfig));
    this.bt_saveBest.on(
      'pointerup',
      function() {
        this.clean();
        this.saveElement(LOADED_POPULATION.bestGenome, 'bestGenome.JSON');
      },
      t
    );

    return [ this.bt_evolveFromBest, this.bt_saveBest, this.bt_test, this.bt_resetGenome ];
  } // end getBestGenomeButtons()

  getSelectedGenomeButtons() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;
    // Button: Evolve selected genome
    this.bt_evolveCurrentGenome = this.add.existing(new ButtonGenerator(t, 0, 0, 'EVOLVE', buttonConfig));
    this.bt_evolveCurrentGenome.on(
      'pointerup',
      function() {
        let genomeObj = t.getSelected();
        let NN = neataptic.Network.fromJSON(genomeObj.genome);
        let conditions = genomeObj.conditions;
        this.cleanStoredGens();
        LOADED_POPULATION = null;
        this.clean();
        this.scene.start('evolve', { network: NN, population: null, conditions: conditions });
      },
      t
    );

    // Button: Test selected genome
    this.bt_testCurrent = this.add.existing(new ButtonGenerator(t, 0, 0, 'TEST', buttonConfig));
    this.bt_testCurrent.on(
      'pointerup',
      function() {
        this.clean();
        let genomeObj = t.getSelected();
        let conditions = genomeObj.conditions;
        this.scene.start('test', { network: genomeObj.genome, conditions: conditions });
      },
      t
    );

    // Button: Save selected genome
    this.bt_saveCurrentGenome = this.add.existing(new ButtonGenerator(t, 0, 0, 'SAVE', buttonConfig));
    this.bt_saveCurrentGenome.on(
      'pointerup',
      function() {
        this.clean();
        this.saveElement(t.getSelected(), 'genome.JSON');
      },
      t
    );

    return [ this.bt_evolveCurrentGenome, this.bt_saveCurrentGenome, this.bt_testCurrent ];
  } // end getSelectedGenomeButtons()

  makeDefaultButtons() {
    const t = this;
    const buttonConfig = GLOBALS.BUTTON_CONFIG;

    // Button: Config
    this.bt_config = this.add
      .existing(new ButtonGenerator(this, t.marginX, t.marginY, 'CONFIG', buttonConfig))
      .setOrigin(0);
    this.bt_config.on(
      'pointerup',
      function() {
        this.clean();
        this.scene.start('configuration');
      },
      t
    );

    // Button: Evolve New Population
    this.bt_evolve = this.add
      .existing(
        new ButtonGenerator(
          t,
          t.marginX,
          t.marginY + this.bt_config.height + this.paddingY,
          'EVOLVE NEW POPULATION',
          buttonConfig
        )
      )
      .setOrigin(0);
    this.bt_evolve.on(
      'pointerup',
      function() {
        LOADED_POPULATION = null;
        let conditions = this.makeLearnConditionsObj();
        this.clean();
        this.scene.start('evolve', { conditions: conditions });
      },
      t
    );
  } // end makeDefaultButtons

  makeLearnConditionsObj() {
    let obj = {
      OBSTACLES_AMOUNT: GLOBALS.OBSTACLES_AMOUNT,
      DETECTION_RADIUS: GLOBALS.DETECTION_RADIUS,
      INPUTS_SIZE: GLOBALS.INPUTS_SIZE,
      OBSTACLE_SPEED: GLOBALS.ASTEROID_SPEED,
      SHIP_SPEED: GLOBALS.SHIP_SPEED,
      SHIP_ANGULAR_SP: GLOBALS.SHIP_ANGULAR_SP
    };

    return obj;
  }

  loadPopulation(event) {
    const t = this;
    let files = event.target.files;
    let reader = new FileReader();
    reader.onload = function() {
      let txtPopulation = this.result;
      // JSON
      LOADED_POPULATION = JSON.parse(txtPopulation);
      t.cleanStoredGens();
      t.showPopulationData();
      // This allow "change" event if same file is selected a second time
      event.target.value = null;
    };
    reader.readAsText(files[0]);
  }

  getSelected() {
    var selectedNetwork = JSON.parse(localStorage.getItem('selectedNetwork'));
    return selectedNetwork;
  }

  saveElement(element, fileName) {
    const blob = new Blob([ JSON.stringify(element) ], {
      type: 'text/plain'
    });

    let anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [ 'text/plain', anchor.download, anchor.href ].join(':');
    anchor.click();
  }

  saveJSONtoStorage(element, key) {
    localStorage.setItem(key, JSON.stringify(element));
  }

  showPopulationData() {
    let p = LOADED_POPULATION;
    let populationSize = p.population.length;
    let generation = p.generation;
    let maxScore = p.maxScore;
    let sensors = p.learningConditions.INPUTS_SIZE;
    let detectionRadius = p.learningConditions.DETECTION_RADIUS;
    let obstacles = p.learningConditions.OBSTACLES_AMOUNT;
    let shipSpeed = p.learningConditions.SHIP_SPEED;
    let shipAngular = p.learningConditions.SHIP_ANGULAR_SP;
    let obstacleSpeed = p.learningConditions.OBSTACLE_SPEED;

    this.updateRow(
      this.rowPopulation,
      [
        populationSize,
        generation,
        maxScore,
        sensors,
        detectionRadius,
        obstacles,
        shipSpeed,
        shipAngular,
        obstacleSpeed
      ] )

    let bestHiddenNeurons = p.bestGenome ? p.bestGenome.genome.nodes.length - p.bestGenome.genome.input - p.bestGenome.genome.output : 0;
    let selectedHiddenNeurons = 0;
    if(localStorage.hasOwnProperty('selectedNetwork')){
      let genObj = JSON.parse(localStorage.getItem('selectedNetwork'));
      let conditions = genObj.conditions;
      selectedHiddenNeurons = genObj.genome.nodes.length - genObj.genome.input - genObj.genome.output;
    sensors = conditions.INPUTS_SIZE;
    detectionRadius = conditions.DETECTION_RADIUS;
    obstacles = conditions.OBSTACLES_AMOUNT;
    shipSpeed = conditions.SHIP_SPEED;
    shipAngular = conditions.SHIP_ANGULAR_SP;
    obstacleSpeed = conditions.OBSTACLE_SPEED;
    }

    this.updateRow(
      this.rowSelectedGenome,
      [
        selectedHiddenNeurons,
        sensors,
        detectionRadius,
        obstacles,
        shipSpeed,
        shipAngular,
        obstacleSpeed
      ] );

    this.rowBestGenome.setData(0, bestHiddenNeurons);
    this.rowBestGenome.setData(1, maxScore);

    this.bt_evolveLoaded.enable();
    this.bt_save.enable();
    if (LOADED_POPULATION.bestGenome) {
      this.bt_saveBest.enable();
    }

    if (LOADED_POPULATION.bestGenome) {
      this.bt_evolveFromBest.enable();
      this.bt_test.enable();
      this.bt_resetGenome.enable();
    }
    if (localStorage.hasOwnProperty('selectedNetwork')) {
      this.bt_evolveCurrentGenome.enable();
      this.bt_testCurrent.enable();
      this.bt_saveCurrentGenome.enable();
    }
  } // end showPopulationData()

  updateRow(rowObj, data){
    for(let i=0, j=data.length; i<j;i++){
      rowObj.setData(i,data[i]);
    }
  }

  cleanStoredGens() {
    localStorage.removeItem('selectedNetwork');
    localStorage.removeItem(GLOBALS.BEST_GEN_STORE_NAME);
  }

  clean() {
    for (let i = 0, j = this.children.length; i < j; i++) {
      if (this.children.list[i] instanceof ButtonGenerator) {
        this.children.list[i].clean();
      }
    }
  }
}
