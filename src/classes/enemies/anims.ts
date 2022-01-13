import { Zombie } from "./zombie";

export const initAnimations = (zombie: Zombie) => {
  zombie.scene.anims.create({
    key: 'zombie-idle',
    frames: zombie.scene.anims.generateFrameNames('a-zombie', {
      prefix: 'idle-',
      end: 7,
    }),
    frameRate: 8,
    repeat: -1,
  });

  zombie.scene.anims.create({
    key: 'zombie-run',
    frames: zombie.scene.anims.generateFrameNames('a-zombie', {
      prefix: 'run-',
      end: 6,
    }),
    frameRate: 8,
    repeat: -1,
  });

  zombie.scene.anims.create({
    key: 'zombie-attack',
    frames: zombie.scene.anims.generateFrameNames('a-zombie', {
      prefix: 'attack1-',
      end: 6,
    }),
    frameRate: 8,
  });
}