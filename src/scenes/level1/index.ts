import Phaser from 'phaser';
import { Zombie } from '../../classes/enemies/zombie';
import { Player } from '../../classes/player';

export class Level1 extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private player!: Player;
  private zombie!: Zombie;

  constructor() {
    super('level-1-scene');
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'lvl1-map', tileWidth: 16, tileHeight: 16 });
    this.tileset = this.map.addTilesetImage('level1', 'tiles');
    this.groundLayer = this.map.createLayer('Grounds', this.tileset, 0, 0);

    this.groundLayer.setCollisionByProperty({ collides: true });
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(3);
  }

  create() {
    this.initMap()
    this.player = new Player(this, 100, 500);
    this.zombie = new Zombie(this, 200, 500, 'zombie', this.player);
    console.log(this.zombie)
    
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.zombie, this.groundLayer);
    this.physics.add.collider(this.zombie, this.player);
    this.initCamera()
  }

  update(): void {
    this.player.update();
    this.zombie.update();
  }
}
