
//CENA DO JOGO
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }


    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bloco', 'assets/bloco.png');
        this.load.image('moeda', 'assets/moeda.png');
        this.load.image('grama', 'assets/piso.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('tijolos', 'assets/tijolos.png');
        this.load.image('cano', 'assets/cano.png');
        this.load.image('parede', 'assets/parede.png');
        this.load.spritesheet('fogo', 'assets/fogo.png', { frameWidth: 180, frameHeight: 140 });  //fremeWidth e frameHeight são as dimensões do sprite
        this.load.image('nuvem', 'assets/nuvem.png');
        this.load.image('chegada', 'assets/chegada.png');
        this.load.image('laranja', 'assets/laranja.png');
        this.load.image('vermelho', 'assets/vermelho.png');
    }


    create ()
    {
        this.tempo = 0;
        this.pontos = 0;
        this.add.image(400, 300, 'sky');

        this.plataforma = this.physics.add.staticGroup();
        this.grama = this.plataforma.create(275, 600, 'grama');
        this.cano = this.physics.add.staticImage(1000, 410, 'cano').setScale(0.1).refreshBody();
        
        //criar fogo nas posicoes x
        this.fogos = this.physics.add.group();
        this.createFire(700);
        this.createFire(750);
        this.createFire(800);


        this.lava = this.physics.add.staticImage(825, 580, 'lava');

        //tijolos
        const tijolosPos = [[55, 430], [305, 330], [55, 230], [305, 130], [510, 500]];
        this.tijolos = this.physics.add.staticGroup();
        tijolosPos.forEach(([x, y]) => this.tijolos.create(x, y, 'tijolos').setScale(0.7).refreshBody());

        //bloco
        const blocosPos = [[640, 420], [860, 380], [1130, 440], [800, 210]];
        this.blocos = this.physics.add.staticGroup();
        blocosPos.forEach(([x, y]) => this.blocos.create(x, y, 'bloco').setScale(0.06).refreshBody());
        

        //moedas
        const moedasPos = [[55, 395], [305, 295], [55, 195], [305, 95], [500, 465], [1000, 295]];
        this.moedas = this.physics.add.group();
        moedasPos.forEach(([x, y]) => {
            let moeda = this.moedas.create(x, y, 'moeda').setScale(0.01).refreshBody();
            moeda.body.setSize(30, 30);  // Ajuste o tamanho da hitbox conforme necessário
            moeda.body.setAllowGravity(false); // Moedas não devem cair
            moeda.body.setImmovable(true); // Impede que sejam movidas por colisões
        });


        this.laranja = this.physics.add.staticImage(600, 100, 'laranja').setScale(0.09).refreshBody();
        this.vermelho = this.physics.add.staticImage(1130, 400, 'vermelho').setScale(0.08).refreshBody();
        this.chegada = this.physics.add.staticImage(630, 150, 'chegada').setScale(1).refreshBody();  //chegada
        this.nuvem = this.physics.add.staticImage(1000, 140, 'nuvem').setScale(0.3).refreshBody();  //nuvem para bloquear personagem de pular parte do trajeto
        this.parede = this.physics.add.staticImage(410, 310, 'parede').setScale(1.1).refreshBody();
        

        // Ajusta a hitbox de TUDO
        this.grama.body.setSize(600, 150, true);  // Define a largura e altura da hitbox
        this.lava.body.setSize(800, 120, true);  // Define a largura e altura da hitbox
        this.nuvem.body.setSize(50, 200, true);  // Define a largura e altura da hitbox
        this.nuvem.body.setOffset(-300, 50);  
        this.chegada.body.setSize(120, 30, true);  
        this.laranja.body.setSize(30, 30, true);
        this.vermelho.body.setSize(30, 30, true);

        this.parede.body.setSize(90, 430, true);  // Define a largura e altura da hitbox
        this.parede.body.setOffset(170, 5);  // Ajusta a posição da hitbox para alinhar com o sprite

        //parte do jogador
        this.player = this.physics.add.sprite(200, 100, 'dude');
        this.player.setCollideWorldBounds(true); //não deixa o jogador sair da tela
        this.player.setMass(10); // O valor padrão é 1, então aumentar o tornará mais pesado mas nao muda o tempo q ele car ;/
        this.player.setGravityY(350); // Aumenta a gravidade do jogador (padrão é 300)

        //colições
        this.physics.add.collider(this.player, this.grama);
        this.physics.add.collider(this.player, this.cano);
        this.physics.add.collider(this.player, this.parede);
        this.physics.add.collider(this.player, this.tijolos);
        this.physics.add.collider(this.player, this.nuvem);
        this.physics.add.collider(this.player, this.blocos);
        this.physics.add.collider(this.player, this.chegada);

        //colisao com pontos
        const coletarMoeda = (player, moeda) => {
            moeda.destroy(); // Remove a moeda
            this.pontos += 10; // Atualiza a pontuação
            this.pontosTexto.setText('Pontos: ' + this.pontos); // Atualiza o texto na tela
        };
        
        const coletarVermelho = (player, vermelho) => { 
            vermelho.destroy();
            this.pontos += 40;
            this.pontosTexto.setText('Pontos: '+ this.pontos);
        };

        const coletarLaranja = (player, laranja) => {
            laranja.destroy();
            this.pontos += 100;
            this.pontosTexto.setText('Pontos: ' + this.pontos);
            
            // Alterando o fluxo para evitar problemas com pausa
            this.physics.pause();
            this.tempo.stop();
            gameOver = true;
        
            // Adicionando delay para evitar que a cena reinicie imediatamente
            this.time.delayedCall(1000, () => {
                this.scene.start('EndScene', { score: this.pontos });  // Passa a pontuação para a EndScene
            });
        };
        

        
        // Adiciona colisão entre player e pontos
        this.physics.add.overlap(this.player, this.moedas, coletarMoeda, null, this);
        this.physics.add.overlap(this.player, this.vermelho, coletarVermelho, null, this)
        this.physics.add.overlap(this.player, this.laranja, coletarLaranja, null, this)

        //colisão com morte
        const hitMorte = (player, lava, fogo) => {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');
            this.tempo.stop();
            gameOver = true;
        }        
        this.physics.add.overlap(this.player, this.lava, hitMorte, null, this);
        this.physics.add.overlap(this.player, this.fogos, hitMorte, null, this);  

        //animacao player
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.cursors = this.input.keyboard.createCursorKeys();


        // Adiciona o texto no canto superior direito
        this.tempoTexto = this.add.text(1000, 20, 'Tempo: 0s', {
            fontSize: '32px',
            fill: '#000',
            fontFamily: 'Arial'
        });
        // Inicia o contador de tempo
        this.time.addEvent({
            delay: 1000, // Atualiza a cada segundo
            callback: () => {
                this.tempo++;
                this.tempoTexto.setText('Tempo: ' + this.tempo + 's'); // Atualiza o texto na tela
            },
            loop: true
        });

        // Adiciona o texto no canto superior esquerdo
        this.pontosTexto = this.add.text(20, 20, 'Pontos: 0', {
            fontSize: '32px',
            fill: '#000',
            fontFamily: 'Arial'
        });

    }

    createFire(x) {
        let fogo = this.fogos.create(x, 200, 'fogo').setScale(0.5).setAngle(90);
    
        this.anims.create({
            key: 'fogoAnim',
            frames: this.anims.generateFrameNumbers('fogo', { start: 0, end: 3 }),
            frameRate: 9,
            repeat: -1
        });
    
        fogo.anims.play('fogoAnim', true);
        fogo.body.setAllowGravity(false); // Impede que a gravidade afete o fogo
        fogo.body.setImmovable(true); // Não deve ser movido por colisões

    
        this.tweens.add({
            targets: fogo,
            y: 550,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Linear'
        });
    
        fogo.body.setSize(50, 50);
        fogo.body.setOffset(40, 70);
    }

    update ()
    {



        //movimentação do jogador
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-200);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(200);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-400); //pulo -270 com gravidade 300
        }


        //if (fogo.subindo && fogo.y <= 410){
        //    fogo.y += 5;
        //}
        //else if (fogo.descendo && fogo.y >= 500){
        //   fogo.y -= 5;
            //}
        }
    }
