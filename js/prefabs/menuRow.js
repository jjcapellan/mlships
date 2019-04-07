class MenuRow {
  constructor(scene, title, subtitles, data, buttons, graphics) {
    this.scene = scene;
    this.title = title;
    this.subtitles = subtitles;
    this.data = data;
    this.buttons = buttons;
    this.graphics = graphics;
    this.gameWidth = this.scene.game.config.width;
    this.paddingY = this.scene.paddingY;
    this.paddingX = 10;
    this.letterWidth;
    this.bottomTitle;
    this.titleWidth;
    this.bottomSubtitles;
    this.subtitlesWidth;
    this.dataWidth;
    this.dataRight;
    this.data_bmf = [];
    this.bottomButtons;
    this.init();
  }

  init() {
    this.setLetterWidth();
    this.makeLine();
    this.addTitle();
    this.addSubtitles();
    this.addDataLabels();
    this.addButtons();
    this.setActualBottomRow();
  }

  makeLine() {
    let x = this.scene.marginX;
    let y = this.scene.actualBottomRow;
    this.graphics.lineBetween(x, y, this.gameWidth - x, y);
  }

  addTitle() {
    let x = this.scene.marginX;
    let y = this.scene.actualBottomRow + this.paddingY;
    let bmf = this.scene.add.bitmapText(x, y, 'bmf', this.title, 24).setOrigin(0);
    this.bottomTitle = bmf.y + bmf.height;
    this.titleWidth = bmf.width;
  }

  addSubtitles() {
    let x = this.scene.marginX;
    let y = this.bottomTitle;
    let width = 0;
    let bmf;
    for (let i = 0, j = this.subtitles.length; i < j; i++) {
      bmf = this.scene.add.bitmapText(x, y, 'bmf', this.subtitles[i], 20).setOrigin(0);
      y += bmf.height;
      if (bmf.width > width) {
        width = bmf.width;
      }
    }
    this.bottomSubtitles = y + bmf.height;
    this.subtitlesWidth = width;
  }

  addDataLabels() {
    let x = this.subtitlesWidth + this.scene.marginX + this.paddingX + 20 + 8 * this.letterWidth;
    let y = this.bottomTitle;
    let width = 0;
    for (let i = 0, j = this.data.length; i < j; i++) {
      let bmf = this.scene.add.bitmapText(x, y, 'bmf', this.data[i], 20).setOrigin(1, 0);
      this.data_bmf.push(bmf);
      y += bmf.height;
      if (bmf.width > width) {
        width = bmf.width;
      }
    }
    this.dataWidth = width;
    this.dataRight = x + this.paddingX;
  }

  addButtons() {
    let x0 = this.gameWidth - this.scene.marginX;
    let y = this.scene.actualBottomRow + this.paddingY/2;
    let x = x0;
    for (let i = 0, j = this.buttons.length; i < j; i++) {
      let bt = this.buttons[i];
      if (x - bt.width < this.dataRight) {
        y += bt.height + this.paddingY;
        x = x0;
      }
      bt.setOrigin(1, 0).setPosition(x, y);
      x -= bt.width + this.paddingX;
    }
    this.bottomButtons = y + this.buttons[this.buttons.length - 1].height + this.paddingY/2;
  }

  setActualBottomRow() {
    this.scene.actualBottomRow = this.bottomButtons > this.bottomSubtitles ? this.bottomButtons : this.bottomSubtitles;
  }

  setData(index, value) {
    this.data_bmf[index].setText(value);
  }

  setLetterWidth() {
    let a = this.scene.add.bitmapText(0, 0, 'bmf', 'O', 20);
    let width = a.width;
    a.destroy();
    this.letterWidth = width;
  }
}
