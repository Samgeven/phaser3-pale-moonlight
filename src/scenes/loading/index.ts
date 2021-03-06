import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {

  constructor() {
    super('loading-scene');
  }

  preload(): void {
    this.load.image('hero', 'assets/hero.png');
    this.load.atlas('a-hero', 'assets/hero-sprite.png', 'assets/a-hero_atlas.json');

    this.load.image('zombie', 'assets/zombie.png');
    this.load.atlas('a-zombie', 'assets/zombie-sprite.png', 'assets/a-zombie_atlas.json');

    this.load.image({
      key: 'tiles',
      url: 'assets/tilemaps/lvl1.png',
    });
    this.load.tilemapTiledJSON('lvl1-map', 'assets/tilemaps/lvl1-map.json');
  }

  create(): void {
    this.scene.start('level-1-scene');
  }
}