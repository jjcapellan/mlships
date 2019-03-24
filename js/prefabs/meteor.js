class Meteor extends Phaser.Physics.Arcade.Image {
  constructor(scene, x , y, texture,frame) {
    super(scene, x, y, texture,frame);
    this.scene = scene;
    
    this.x = 0;
    this.y = 0;
  }

  init(innerRect, outerRect, targetRect) { 
    this.innerRectangle = innerRect;
    this.outerRectangle = outerRect;
    this.targetRectangle = targetRect;   
    this.body.setCircle(this.width / 2);
    this.body.setImmovable(true);
    this.body.mass = this.scene.conf.meteors_mass;
    this.reset();
  }

  reset() {    
    let t = this;
    let direction = t.getDirection();
    t.body.reset(direction.fromX, direction.fromY);    
    t.scene.physics.moveTo(
      t,
      direction.toX,
      direction.toY,
      Phaser.Math.RND.between(
        t.scene.conf.meteors_minSpeed,
        t.scene.conf.meteors_maxSpeed
      )
    );
    t.body.setAngularVelocity(Phaser.Math.RND.between(-200, 200));
  }

  getDirection() {
    let t = this;
    let spawnPoint = Phaser.Geom.Rectangle.RandomOutside(t.outerRectangle, t.innerRectangle);
    let targetPoint = t.targetRectangle.getRandomPoint();
    let direction = {
      fromX: spawnPoint.x,
      fromY: spawnPoint.y,
      toX: targetPoint.x,
      toY: targetPoint.y
    };
    return direction;
  }
  
}
