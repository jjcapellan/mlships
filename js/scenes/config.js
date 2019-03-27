class Configuration extends Phaser.Scene {
    constructor() {
      super('configuration');
    }
  
    init() {

        this.conf = this.registry.get('config');

    }
  
    create() {
        let t = this;
        let centerX = this.game.config.width/2;

        // Labels
        this.add.bitmapText(centerX,100,'bmf','POPULATION',20).setOrigin(0.5);
        this.add.bitmapText(centerX,170,'bmf','DETECTION RADIUS',20).setOrigin(0.5);
        this.add.bitmapText(centerX,240,'bmf','START HIDDEN NEURONS',20).setOrigin(0.5);

        // Data labels
        this.lbl_population = this.add.bitmapText(centerX,135,'bmf',`${GLOBALS.POPULATION_AMOUNT}`,20).setOrigin(0.5);
        this.lbl_detection = this.add.bitmapText(centerX,205,'bmf',`${GLOBALS.DETECTION_RADIUS}`,20).setOrigin(0.5);
        this.lbl_hiddenNeurons = this.add.bitmapText(centerX,275,'bmf',`${GLOBALS.START_HIDDEN_SIZE}`,20).setOrigin(0.5);
        // Buttons
        //this.bt_testBest = this.add.existing(new ButtonGenerator(this,50,110,'bmf',20,'TEST BEST NETWORK','0xffffee','0xffffff')).setOrigin(0);
        //this.bt_saveNetwork = this.add.existing(new ButtonGenerator(this,50,170,'bmf',20,'SAVE NETWORK TO FILE','0xffffee','0xffffff')).setOrigin(0);
        //this.bt_loadNetwork = this.add.existing(new ButtonGenerator(this,50,230,'bmf',20,'LOAD NETWORK FROM FILE','0xffffee','0xffffff')).setOrigin(0);
        //this.bt_test = this.add.existing(new ButtonGenerator(this,50,350,'bmf',20,'TEST BEST GENOME','0xffffee','0xffffff')).setOrigin(0);
        //this.bt_evolve = this.add.existing(new ButtonGenerator(this,50,410,'bmf',20,'EVOLVE NEW POPULATION','0xffffee','0xffffff')).setOrigin(0);

        /*this.bt_testBest.on('pointerup',function(){
            this.scene.start('preTest');
        }, t);

        this.bt_saveNetwork.on('pointerup',function(){
            this.saveNetwork();
        }, t);

        this.bt_loadNetwork.on('pointerup',function(){
            this.el_inputFile.click();
        }, t);*/

        /*this.bt_test.on('pointerup',function(){
          if(localStorage.hasOwnProperty('bestNN')){
            this.scene.start('test');
          }
      }, t);

        this.bt_evolve.on('pointerup',function(){
            this.scene.start('evolve');
        }, t);*/
    }
  

  

  

}