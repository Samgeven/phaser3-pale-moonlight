import { Player } from ".";

export const initAnimations = (player: Player) => {
  player.scene.anims.create({
    key: 'run',
    frames: player.scene.anims.generateFrameNames('a-hero', {
      prefix: 'run-',
      end: 5,
    }),
    frameRate: 8,
    repeat: -1
  });

  player.scene.anims.create({
    key: 'idle',
    frames: player.scene.anims.generateFrameNames('a-hero', {
      prefix: 'idle-',
      end: 3,
    }),
    frameRate: 5,
    repeat: -1
  });

  player.scene.anims.create({
    key: 'jump',
    frames: player.scene.anims.generateFrameNames('a-hero', {
      prefix: 'jump-',
      end: 9,
    }),
    frameRate: 8,
  });

  player.scene.anims.create({
    key: 'attack1',
    frames: player.scene.anims.generateFrameNames('a-hero', {
      prefix: 'attack1-',
      end: 5,
    }),
    frameRate: 12,
  });

  player.scene.anims.create({
    key: 'attack2',
    frames: player.scene.anims.generateFrameNames('a-hero', {
      prefix: 'attack2-',
      end: 3,
    }),
    frameRate: 12,
  });
}