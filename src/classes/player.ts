import { Actor } from './actor';
import { EVENTS_NAME } from '../constants';

export class Player extends Actor {
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;
  private isAttacking: Boolean;
  private playerSpeed: number;
  private currentAttackAnim: 'attack1' | 'attack2';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero');

    // KEYS
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keySpace = this.scene.input.keyboard.addKey(32);

    this.isAttacking = false
    this.playerSpeed = 110
    this.currentAttackAnim = 'attack1'

    this.keySpace.on('down', (event: KeyboardEvent) => {
      if (!this.isAttacking) {
        this.anims.play(this.currentAttackAnim, true);
        this.scene.game.events.emit(EVENTS_NAME.attack);
        this.isAttacking = true
        this.playerSpeed = 70
      }
    });

    const attackCompleteCallback = (anim: Phaser.Animations.Animation) => {
      if (this.isAttacking) {
        this.isAttacking = false;
        this.playerSpeed = 110

        if (anim.key === 'attack1') {
          this.currentAttackAnim = 'attack2'
          scene.time.addEvent({
            delay: 100,
            callback: () => this.currentAttackAnim = 'attack1',
            repeat: 0,
          });
        }
      }
    }

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'attack1', attackCompleteCallback, this);
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'attack2', attackCompleteCallback, this);
    
    this.scene.game.events.on(EVENTS_NAME.attack, () => console.log('attack'), this);

    this.keyW.on('down', (event: KeyboardEvent) => {
      if (!this.isAttacking && this.getBody().onFloor()) {
        this.anims.play('jump', true);
        this.body.velocity.y = -160;
      }
    });

    // PHYSICS
    this.getBody().setSize(30, 30);
    this.getBody().setOffset(8, 0);

    this.initAnimations()

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('a-hero', {
        prefix: 'run-',
        end: 5,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('a-hero', {
        prefix: 'idle-',
        end: 3,
      }),
      frameRate: 5,
    });

    this.scene.anims.create({
      key: 'jump',
      frames: this.scene.anims.generateFrameNames('a-hero', {
        prefix: 'jump-',
        end: 9,
      }),
      frameRate: 8,
    });

    this.scene.anims.create({
      key: 'attack1',
      frames: this.scene.anims.generateFrameNames('a-hero', {
        prefix: 'attack1-',
        end: 5,
      }),
      frameRate: 12,
    });

    this.scene.anims.create({
      key: 'attack2',
      frames: this.scene.anims.generateFrameNames('a-hero', {
        prefix: 'attack2-',
        end: 3,
      }),
      frameRate: 12,
    });
	}

  public getDamage(value?: number): void {
    super.getDamage(value);
  }

  update(): void {

    if (this.keyA?.isDown) {
      this.body.velocity.x = -this.playerSpeed;
      this.checkFlip();
      this.getBody().onFloor() && !this.isAttacking && this.anims.play('run', true);
    }

    else if (this.keyD?.isDown) {
      this.body.velocity.x = this.playerSpeed;
      this.checkFlip();
      this.getBody().onFloor() && !this.isAttacking && this.anims.play('run', true);
    }

    else {
      this.body.velocity.x = 0;
      !this.anims.isPlaying && this.anims.play('idle', true);
    }
  }
}