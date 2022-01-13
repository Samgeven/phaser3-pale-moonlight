import { Actor } from './actor';
import { Player } from './player';
import { EVENTS_NAME } from '../constants';

export class Enemy extends Actor {
  protected target: Player;
  protected AGRESSOR_RADIUS = 100;
  private attackHandler: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.target = target;

    // ADD TO SCENE
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // PHYSICS MODEL
    this.getBody().setSize(20, 30);
    this.getBody().setOffset(8, 0);

    this.attackHandler = () => {
      if (
        Phaser.Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          { x: this.target.x, y: this.target.y },
        ) < this.target.width
      ) {
        this.getDamage();
        this.disableBody(true, false);
  
        this.scene.time.delayedCall(300, () => {
          this.scene.game.events.removeListener('update')
          this.destroy();
        });
      }
    };

    // EVENTS
    this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    this.on('destroy', () => {
      this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler);
    });
  }

  public setTarget(target: Player): void {
    this.target = target;
  }
}