import { EVENTS_NAME } from '../../constants';
import { Enemy } from '../enemy'
import { Player } from '../player';
import StateMachine from '../state-machine'; 
import { initAnimations } from './anims';

export class Zombie extends Enemy {
  private DAMAGE = 12
  private ATTACK_RADIUS = 25
  private ATTACK_DELAY = 1500
  private ATTACK_COOLDOWN = false
  private zombieStateMachine: StateMachine

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, target, frame);

    initAnimations(this)

    this.zombieStateMachine = new StateMachine(this, 'player', true)
			.addState('idle', {
				onEnter: this.zombieIdleEnter,
				onUpdate: this.zombieIdleUpdate,
			})
			.addState('run', {
        onEnter: this.zombieRunEnter,
			})
			.addState('attack', {
        onEnter: this.zombieAttackEnter,
			})

		this.zombieStateMachine.setState('idle')

    this.scene.game.events.on(EVENTS_NAME.enemyAttack, () => {
      console.log('enemy attacks')
      this.ATTACK_COOLDOWN = true
      setTimeout(() => {
        this.ATTACK_COOLDOWN = false
        this.zombieStateMachine.setState('idle')
      }, this.ATTACK_DELAY)
    }, this);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'zombie-attack', () => {
      this.zombieStateMachine.setState('idle')
    })
  }

  private zombieIdleEnter(): void {
    this.anims.play('zombie-idle')
    this.setVelocityX(0)
  }

  private zombieIdleUpdate(): void {
    if (this.ATTACK_COOLDOWN) {
      return
    }

    if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.ATTACK_RADIUS
    ) {
      this.zombieStateMachine.setState('attack')
    } else if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y },
      ) < this.AGRESSOR_RADIUS
    ) {
      this.zombieStateMachine.setState('run')
    } else {
      this.zombieStateMachine.setState('idle')
    }
  }

  private zombieRunEnter(): void {
    this.anims.play('zombie-run')
    this.getBody().setVelocityX(this.target.x - this.x);
    this.checkFlip()
  }

  private zombieAttackEnter(): void {
    if (this.ATTACK_COOLDOWN) return
    this.anims.play('zombie-attack')
    this.getBody().setVelocityX(0)
    this.scene.game.events.emit(EVENTS_NAME.enemyAttack);
  }
  
  update(): void {
    if (!this.active) return
    this.zombieIdleUpdate()
  }
}
