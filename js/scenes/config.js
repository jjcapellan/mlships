class Configuration extends Phaser.Scene {
    constructor() {
      super('configuration');
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

        // Minus buttons
        this.addMinusButton(centerX - 200,100,5,5,'POPULATION_AMOUNT',this.lbl_population);
        this.addMinusButton(centerX - 200,170,10,80,'DETECTION_RADIUS',this.lbl_detection);
        this.addMinusButton(centerX - 200,240,1,0,'START_HIDDEN_SIZE',this.lbl_hiddenNeurons);

        // Plus buttons
        this.addPlusButton(centerX + 200, 100, 5, 10000, 'POPULATION_AMOUNT',this.lbl_population);
        this.addPlusButton(centerX + 200, 170, 10, 8000, 'DETECTION_RADIUS',this.lbl_detection);
        this.addPlusButton(centerX + 200, 240, 1, 10000, 'START_HIDDEN_SIZE',this.lbl_hiddenNeurons);
    }

    addPlusButton(x,y,step,limit,property,label){
        let plusButtonConfig = {
            fontKey: 'bmf',
            fontSize: 20,
            textColor: '0xffffee',
            buttonColor: '0xffffff',
            control: 'increase',
            object: GLOBALS
        }

        let bt_hidden_plus = this.add.existing(new ButtonGenerator(this, x, y, '+', plusButtonConfig)).setOrigin(0,0.5);
        bt_hidden_plus.step = step;
        bt_hidden_plus.limit = limit;
        bt_hidden_plus.property = property;
        bt_hidden_plus.callback = function(value){
            label.setText(value);
        }.bind(this);

    }

    addMinusButton(x,y,step,limit,property,label){
        let minusButtonConfig = {
            fontKey: 'bmf',
            fontSize: 20,
            textColor: '0xffffee',
            buttonColor: '0xffffff',
            control: 'decrease',
            object: GLOBALS
        }

        let bt_hidden_plus = this.add.existing(new ButtonGenerator(this, x, y, '-', minusButtonConfig)).setOrigin(0,0.5);
        bt_hidden_plus.step = step;
        bt_hidden_plus.limit = limit;
        bt_hidden_plus.property = property;
        bt_hidden_plus.callback = function(value){
            label.setText(value);
        }.bind(this);

    }
  

  

  

}