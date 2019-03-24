class Menu extends Phaser.Scene {
    constructor() {
      super('menu');
    }
  
    init() {

        this.conf = this.registry.get('config');
        this.el_inputFile = document.getElementById('inputFile');
        this.el_inputFile.addEventListener('change', this.loadNetwork.bind(this), false);
  
    }
  
    create() {
        let t = this;

        // Buttons
        //this.bt_training = this.add.existing(new ButtonGenerator(this,50,110,'bmf',20,'TRAIN NETWORK','0xffffee','0xffffff')).setOrigin(0);
        //this.bt_saveNetwork = this.add.existing(new ButtonGenerator(this,50,170,'bmf',20,'SAVE NETWORK TO FILE','0xffffee','0xffffff')).setOrigin(0);
        //this.bt_loadNetwork = this.add.existing(new ButtonGenerator(this,50,230,'bmf',20,'LOAD NETWORK FROM FILE','0xffffee','0xffffff')).setOrigin(0);
        this.bt_test = this.add.existing(new ButtonGenerator(this,50,410,'bmf',20,'TEST','0xffffee','0xffffff')).setOrigin(0);

        /*this.bt_training.on('pointerup',function(){
            this.scene.start('preTest');
        }, t);

        this.bt_saveNetwork.on('pointerup',function(){
            this.saveNetwork();
        }, t);

        this.bt_loadNetwork.on('pointerup',function(){
            this.el_inputFile.click();
        }, t);*/

        this.bt_test.on('pointerup',function(){
            this.scene.start('test');
        }, t);
    }
  

  saveNetwork(){

        const nnJSON = shipBrain.toJSON();

        const blob = new Blob([JSON.stringify(nnJSON)], {
          type: 'text/plain'
        });

        let anchor = document.createElement('a');
        anchor.download = 'neuralNetwork.JSON';
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
        
  }

  saveData(){
    const blob = new Blob([JSON.stringify(shipRawData)], {
        type: 'text/plain'
      });

      let anchor = document.createElement('a');
      anchor.download = 'datacapturedV2.JSON';
      anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
      anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
      anchor.click();
  }

  

  loadNetwork(event){

    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
        const txtNetwork = this.result;
        const JSONnetwork = JSON.parse(txtNetwork);
        shipBrain.fromJSON(JSONnetwork);
    }
    reader.readAsText(files[0]);
  }

  loadData(event){

    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = function() {
        shipRawData = JSON.parse(this.result);
    }
    reader.readAsText(files[0]);

  }

}