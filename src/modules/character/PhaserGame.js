import Phaser from "phaser";

export class CharacterScene extends Phaser.Scene {
  constructor(selected,colors) {
    super("CharacterScene");
    this.selected = selected;
      this.colors = colors;

  }

  preload() {
    Object.keys(this.selected).forEach((key) => {
      this.load.image(key, `/assets/${key}/${this.selected[key]}.png`);
    });
  }

  create() {
    const x = 250;
    const y = 250;
this.smile = this.add.image(x, y-50, "smiles");
this.smile.setOrigin(0.5).setDepth(5).setScale(0.3);
this.body = this.add.image(x, y, "body");
// this.clothes = this.add.image(x, y+65, "clothes");
this.hair = this.add.image(x, y-150, "hair");
this.eyes = this.add.image(x, y-90, "eyes");
this.body.setOrigin(0.5).setDepth(1).setScale(1);
// this.clothes.setOrigin(0.5).setDepth(3).setScale(0.35);
this.hair.setOrigin(0.5).setDepth(2).setScale(0.8);
this.eyes.setOrigin(0.5).setDepth(4).setScale(0.3);

  if (this.colors?.hair) {
    this.hair.setTint(this.colors.hair);
  }
  if (this.colors?.eyes) {
    this.eyes.setTint(this.colors.eyes);
  }
  }
}

export function renderCharacter(containerId, selected,colors) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    parent: containerId,
    transparent: true,
    scene: new CharacterScene(selected,colors),
    pixelArt: true,
  });
}
