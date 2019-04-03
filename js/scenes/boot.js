class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    this.load.bitmapFont('bmf', 'assets/fonts/bmf_xolonium.png', 'assets/fonts/bmf_xolonium.xml');
  }

  create() {
    // Generates "ship" texture(30*20)
    let graphics = this.add.graphics();
    graphics.setVisible(false);
    graphics.fillStyle(0x00ff00, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(30, 10);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.fillPath();
    graphics.generateTexture('ship', 30, 20);

    // Selected ship
    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(30, 10);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.fillPath();
    graphics.generateTexture('selectedShip', 30, 20);

    // Generates "asteroid" texture(30*30)
    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(15, 15, 15);
    graphics.generateTexture('asteroid', 30, 30);

    this.scene.start('menu');
  }
}
