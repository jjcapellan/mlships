class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  init() {

    let config = {
      // meteors params
      meteors_qty: 4, // Max quantity per type (there are 4 types)
      meteors_maxSpeed: 70, // px/sec
      meteors_minSpeed: 50, // px/sec
      meteors_mass: 2,      

      // ship
      ship_acceleration: 300,
      ship_maxVelocity: 180, // max speed for x and y components
      ship_bounce: 0.8, // percentage of speed returned after a collision (0.8 = 80%)
      ship_mass: 1,

      // ui
      ui_margin: 10
    };

    this.registry.set('config',config);

  }

  preload() {
    this.load.bitmapFont('bmf','assets/fonts/bmf_xolonium.png','assets/fonts/bmf_xolonium.xml');
  }

  create() {

    // Generates "ship" texture
    let graphics = this.add.graphics();
    graphics.setVisible(false);
    graphics.fillStyle(0x00ff00, 1);
    graphics.beginPath();
    graphics.moveTo(0,0);
    graphics.lineTo(30, 10);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.fillPath();
    graphics.generateTexture('ship',30,20);

    // Generates "asteroid" texture
    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(15, 15, 15);
    graphics.generateTexture('asteroid',30,30);

    this.scene.start('menu');
  }
}
