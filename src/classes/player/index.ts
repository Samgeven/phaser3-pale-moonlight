import { Actor } from '../actor';
import { EVENTS_NAME } from '../../constants';
import StateMachine from '../state-machine';
import { initAnimations } from './anims';

export class Player extends Actor {
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;
  private isAttacking: Boolean;
  private playerSpeed: number;
  private currentAttackAnim: 'attack1' | 'attack2';
  private playerStateMachine!: StateMachine;
  private isInvincible: boolean;

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

    initAnimations(this)

    this.playerStateMachine = new StateMachine(this, 'player', false)
			.addState('idle', {
				onEnter: this.playerIdleEnter,
				onUpdate: this.playerIdleUpdate
			})
			.addState('run', {
				onEnter: this.playerRunEnter,
				onUpdate: this.playerRunUpdate
			})
			.addState('attack', {
				onEnter: this.playerAttackEnter
			})
      .addState('jump', {
        onEnter: this.playerJumpEnter,
        onUpdate: this.playerJumpUpdate
      })

		this.playerStateMachine.setState('idle')
    
    this.scene.game.events.on(EVENTS_NAME.attack, () => console.log('attack'), this);

    // PHYSICS
    this.getBody().setSize(20, 30);
    this.getBody().setOffset(14, 0);

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });
  }

  public getDamage(value?: number): void {
    super.getDamage(value);
  }

  public setSpeed(value: number) {
    this.playerSpeed = this.flipX ? -value : value
  }

  private playerIdleEnter() {
		this.anims.play('idle')
		this.setVelocityX(0)
	}

  private playerIdleUpdate() {
		if (this.keyA.isDown || this.keyD.isDown) {
			this.playerStateMachine.setState('run')
		}
		else if (this.keySpace.isDown) {
			this.playerStateMachine.setState('attack')
		}
    else if (this.keyW.isDown) {
      this.playerStateMachine.setState('jump')
		}
	}

  private playerRunEnter() {
		this.anims.play('run')
	}

  private playerRunUpdate() {
		if (this.keySpace.isDown) {
			this.playerStateMachine.setState('attack')
		}
    else if (this.keyW.isDown) {
      this.playerStateMachine.setState('jump')
		}
		else if (this.keyA.isDown) {
			this.setVelocityX(-this.playerSpeed)
			this.flipX = true
		}
		else if (this.keyD.isDown) {
			this.flipX = false
			this.setVelocityX(this.playerSpeed)
		}
		else {
			this.playerStateMachine.setState('idle')
		}
	}

  private playerAttackEnter()
	{
		this.anims.play(this.currentAttackAnim, true);

    this.playerStateMachine.setState('attack')

		const startHit = (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
			if (frame.index < 2) {
				return
			}

			this.scene.game.events.emit(EVENTS_NAME.attack);
			this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit)
      console.log('start hit')
		}

		this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit)

		this.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + this.currentAttackAnim, (anim: Phaser.Animations.Animation) => {
      this.currentAttackAnim = anim.key === 'attack1' ? 'attack2' : 'attack1'
			this.playerStateMachine.setState('idle')
		})
	}

  playerJumpEnter() {
    if (!this.isAttacking && this.getBody().onFloor()) {
      this.anims.play('jump', true);
      this.body.velocity.y = -160;
    }
  }

  playerJumpUpdate() {
    if (this.getBody().onFloor()) {
      this.playerStateMachine.setState('idle')
    }
  }

  update(dt: number): void {
    this.playerStateMachine.update(dt)
  }
}