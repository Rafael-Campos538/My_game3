export class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    init(data) {
        this.pontuacaofinal = data.score || 0; // Recebe a pontuação final
    }

    preload() {
        this.load.image('end', 'assets/end.png'); // Imagem de fundo da tela final
        this.load.image('reset', 'assets/reset.png'); // Botão de reinício
    }

    create() {
        this.add.image(600, 300, 'end'); // Define a imagem de fundo
        
        this.add.text(400, 150, 'Parabéns!', { fontSize: '64px', fill: '#fff', fontFamily: 'Arial', fontStyle: 'bold' });
        this.add.text(420, 250, `Sua pontuação final: ${this.pontuacaofinal}`, { fontSize: '32px', fill: '#fff', fontFamily: 'Arial' });
        
        let reset = this.add.image(600, 400, 'reset').setInteractive();
        reset.on('pointerdown', () => {
            this.scene.start('GameScene'); // Reinicia o jogo
        });
    }
}
