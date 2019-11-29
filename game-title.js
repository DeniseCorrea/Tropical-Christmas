class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() { 
        this.load.image('socks1','socks1.png');
    }

    create() {
        this.add.text(180, 350, 'Tropical Christmas', { font: "70px Times New Roman bold", fill: '#82130a' });
        this.add.text(360, 530, 'Click to Start', { font: "30px Times New Roman bold", fill: '#82130a' });
        this.add.image(440, 120, 'socks1').setScale(0.75, 0.75);

        this.input.on('pointerup', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        });
    }
}