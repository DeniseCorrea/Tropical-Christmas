class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        this.add.text(180, 250, 'Tropical Christmas', { font: "70px Times New Roman bold", fill: '#82130a' });
        this.add.text(360, 430, 'Click to Start', { font: "30px Times New Roman bold", fill: '#82130a' });

        this.input.on('pointerup', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        });
    }
}