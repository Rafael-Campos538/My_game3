import { MenuScene } from './scenes/menuScene.js';
import { GameScene } from './scenes/gameScene.js';
import { EndScene } from './scenes/EndScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    parent: "game",
    scene: [MenuScene, GameScene, EndScene]
};

new Phaser.Game(config);
