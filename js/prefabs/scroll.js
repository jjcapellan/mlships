class Scroll {
  /**
   * Creates an instance of Scroll.
   * @param  {Phaser.Scene} scene 
   * @param  {Phaser.Cameras.Scene2D.Camera} camera 
   * @param  {number} top Minimum value of camera.scrollY
   * @param  {number} bottom Maximum value of camera.scrollY
   * @param  {object} [options]
   * @param  {boolean} [options.wheel = false] The scroll is activated by wheel mouse?
   * @param  {number} [options.dragFactor = 1] - Reduces or increases the drag scroll. 
   * E.g 0.2 = 20% of scroll, 1 = 100% of scroll, 1.5 = 150% of scroll
   * @param  {number} [options.wheelFactor = 1] - Reduces or increases the drag scroll.
   * E.g 0.2 = 20% of scroll, 1 = 100% of scroll, 1.5 = 150% of scroll
   */
  constructor(scene, camera, top, bottom, { wheel, dragFactor, wheelFactor } = {}) {
    this.scene = scene;
    this.camera = camera;
    this.top = top;
    this.bottom = bottom - this.camera.height;
    this.wheel = wheel;
    this.wheelFactor = wheelFactor || 1;
    this.dragFactor = dragFactor || 1;
    this.rectangle = new Phaser.Geom.Rectangle(camera.x, camera.y, camera.width, camera.height);
    this.init();
  }

  init() {
    this.camera.removeBounds();
    this.setDragEvent();
    if (this.wheel) {
      this.setWheelEvent();
    }
  }

  setDragEvent() {
    this.scene.input.on('pointermove', this.dragHandler, this);
  }

  setWheelEvent() {
    window.addEventListener('wheel', this.wheelHandler.bind(this));
  }

  dragHandler(pointer) {
    if (pointer.isDown && this.isOver(pointer)) {
      this.camera.scrollY -= (pointer.position.y - pointer.prevPosition.y) * this.dragFactor;
      this.clampScroll();
    }
  }

  wheelHandler(event) {
    if(this.isOver(this.scene.input.activePointer)){
    this.camera.scrollY += event.deltaY * this.wheelFactor;
    this.clampScroll();
    }
  }

  clampScroll() {
    this.camera.scrollY = Phaser.Math.Clamp(this.camera.scrollY, this.top, this.bottom);
  }

  isOver(pointer){
    return this.rectangle.contains(pointer.x, pointer.y);
  }

  // Frees resources not managed by Phaser
  destroy() {
    window.removeEventListener('wheel', this.wheelHandler);    
  }
}
