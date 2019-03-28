class Menu extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  init() {
    this.el_inputFile = document.getElementById('inputFile');
    this.el_inputFile.addEventListener('change', this.loadNetwork.bind(this), false);
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
        if (localStorage.hasOwnProperty('bestNN')) {
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
        let jsonNN = JSON.parse(localStorage.getItem('bestNN'));
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
  }

  saveNetwork() {
    const nnJSON = shipBrain.toJSON();

    const blob = new Blob([ JSON.stringify(nnJSON) ], {
      type: 'text/plain'
    });

    let anchor = document.createElement('a');
    anchor.download = 'neuralNetwork.JSON';
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [ 'text/plain', anchor.download, anchor.href ].join(':');
    anchor.click();
  }

  saveData() {
    const blob = new Blob([ JSON.stringify(shipRawData) ], {
      type: 'text/plain'
    });

    let anchor = document.createElement('a');
    anchor.download = 'datacapturedV2.JSON';
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [ 'text/plain', anchor.download, anchor.href ].join(':');
    anchor.click();
  }

  loadNetwork(event) {
    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
      const txtNetwork = this.result;
      const JSONnetwork = JSON.parse(txtNetwork);
      shipBrain.fromJSON(JSONnetwork);
    };
    reader.readAsText(files[0]);
  }

  loadData(event) {
    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
      shipRawData = JSON.parse(this.result);
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
