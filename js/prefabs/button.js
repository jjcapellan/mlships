
class ButtonGenerator extends Phaser.GameObjects.Image{
    constructor(scene, x, y, fontKey, fontSize, text, textColor, buttonColor){
        super(scene,x,y);

        this.x = x;
        this.y = y;
        this.text = text;
        this.fontKey = fontKey;
        this.fontSize = fontSize;
        this.textColor = textColor;
        this.buttonColor = buttonColor;
        this.width;
        this.height;
        this.bitmapText = null;
        this.rectangle = null;
        this.padding = 10;
        this.buttonTexture;

        this.init();
    }

    init(){
        this.createBitmapText();
        this.createRectangle();              
        this.createTexture();
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains);
        this.setTexture('rt_button');
        this.setBehaviors();
        this.clean();

    }

    createBitmapText(){
        this.bitmapText = this.scene.make.bitmapText({
            font: this.fontKey,
            text: this.text,
            size: this.fontSize
        }, false);
        this.bitmapText.setTint(this.textColor);
    }

    createRectangle(){
        let textBounds = this.bitmapText.getTextBounds(true);
        this.width = textBounds.local.width + this.padding*2;
        this.height = textBounds.local.height + this.padding*2;
        
        let g = this.scene.make.graphics(undefined, false);
        g.fillStyle(this.buttonColor, 0.2);
        g.fillRoundedRect(0,0,this.width,this.height,10);

        this.rectangle = g;
    }

    createTexture(){
        let texture = this.scene.make.renderTexture({
            width: this.width,
            height: this.height
        }, false);

        texture.draw(this.rectangle,0,0);
        texture.draw(this.bitmapText,this.padding,this.padding);

        texture.saveTexture('rt_button');
    }

    setBehaviors(){
        this.on('pointerover', function(){
            this.setTint(0xefe823);
        },this);
        this.on('pointerout', function(){
            this.clearTint();
        },this);
    }

    clean(){
        this.rectangle.destroy();
        this.bitmapText.destroy();
    }
}