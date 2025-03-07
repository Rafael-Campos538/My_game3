
var botao 

// CENA DO MENU INICIAL
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menu', 'assets/menu.png'); // Fundo do menu
        this.load.image('play', 'assets/play.png'); // Botão de jogar
    }

    create() {
        this.add.image(600, 300, 'menu'); // Fundo do menu

        let botao = this.add.image(600, 450, 'play').setInteractive(); // Adiciona o botão

        botao.on('pointerdown', () => {
            this.scene.start('GameScene'); // Muda para a cena do jogo ao clicar
        });

        this.add.text(400, 150, 'Super Purple Onion', { fontSize: '48px', fill: '#fff', fontFamily: 'Arial' });
        this.add.text(400, 250, 'Clique em "Play" para começar', { fontSize: '24px', fill: '#fff' });
    }
}