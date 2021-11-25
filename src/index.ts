import Phaser from 'phaser';
import { Level1, LoadingScene } from './scenes/index'
import type Window from 'typescript'

interface WindowCustom extends Window {
  sizeChanged: () => void;
  game: Phaser.Game;
}

type GameConfigExtended = Phaser.Types.Core.GameConfig & {
  winScore: number;
};

declare const window: WindowCustom;

export const gameConfig: GameConfigExtended  = {
	title: 'Phaser game tutorial',
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1C1820',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged();
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  winScore: 40,
  scene: [LoadingScene, Level1],
};

window.game = new Phaser.Game(gameConfig);

window.sizeChanged = () => {
	if (window.game.isBooted) {
		setTimeout(() => {
		window.game.scale.resize(window.innerWidth, window.innerHeight);

		window.game.canvas.setAttribute(
				'style',
				`display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
		);
		}, 100);
	}
};
  
window.onresize = () => window.sizeChanged();