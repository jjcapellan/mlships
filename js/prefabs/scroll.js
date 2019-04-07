class Scroll {
  /**
   * Creates an instance of Scroll.
   * @param  {Phaser.Scene} scene 
   * @param  {Phaser.Cameras.Scene2D.Camera} camera 
   * @param  {number} upperLimit Minimum value of camera.scrollY
   * @param  {number} lowerLimit Maximum value of camera.scrollY
   * @param  {boolean} useDrag
   * @param  {boolean} useWheel 
   * @param  {object} [options]
   * @param  {number} [options.dragFactor = 1] - Reduces or increases the drag scroll. 
   * E.g 0.2 = 20% of scroll, 1 = 100% of scroll, 1.5 = 150% of scroll
   * @param  {number} [options.wheelFactor = 1] - Reduces or increases the drag scroll.
   * E.g 0.2 = 20% of scroll, 1 = 100% of scroll, 1.5 = 150% of scroll
   */
  constructor(scene, camera, upperLimit, lowerLimit, useDrag, useWheel, { dragFactor, wheelFactor } = {}) {
    this.scene = scene;
    this.camera = camera;
    this.upper = upperLimit;
    this.lower = lowerLimit;
    this.useDrag = useDrag;
    this.useWheel = useWheel;
    this.wheelFactor = wheelFactor || 1;
    this.dragFactor = dragFactor || 1;
    this.init();
  }

  init() {
    if (this.useDrag) {
      this.setDragEvent();
    }
    if (this.useWheel) {
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
    let camera = this.camera;
    if (pointer.isDown) {
      camera.scrollY -= (pointer.position.y - pointer.prevPosition.y) * this.dragFactor;
      camera.scrollY = Math.max(this.upper, camera.scrollY);
      camera.scrollY = Math.min(this.lower, camera.scrollY);
    }
  }

  wheelHandler(event) {
    let camera = this.camera;
    camera.scrollY += event.deltaY * this.wheelFactor;
    camera.scrollY = Math.max(this.upper, camera.scrollY);
    camera.scrollY = Math.min(this.lower, camera.scrollY);
  }

  // Frees resources not managed by Phaser
  dispose() {
    window.removeEventListener('wheel', this.wheelHandler);
  }
}
