import { Enemy } from '../enemy'
import { Player } from '../player';

export class Zombie extends Enemy {
  private damage: number
  private ATTACK_RADIUS = 25

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, target, frame);

    this.damage = 18
    this.hp = 50

    this.initAnimations()
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: 'zombie-idle',
      frames: this.scene.anims.generateFrameNames('a-zombie', {
        prefix: 'idle-',
        end: 7,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'zombie-run',
      frames: this.scene.anims.generateFrameNames('a-zombie', {
        prefix: 'run-',
        end: 6,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'zombie-attack',
      frames: this.scene.anims.generateFrameNames('a-zombie', {
        prefix: 'attack1-',
        end: 6,
      }),
      frameRate: 8,
    });
  }
  
  update(): void {
    if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.ATTACK_RADIUS
    ) {
      this?.anims?.play('zombie-attack', true)
      this?.getBody()?.setVelocityX(0);
    } else if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.AGRESSOR_RADIUS
    ) {
      this?.anims?.play('zombie-run', true)
      this?.getBody()?.setVelocityX(this.target.x - this.x);
      this?.checkFlip()
    } else {
      this?.anims?.play('zombie-idle', true)
      this?.getBody()?.setVelocityX(0);
      this?.checkFlip()
    }
  }
}
