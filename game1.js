const gameState = {
    winterScore: 0,
    summerScore: 0,
};

const summerName = ['summerSanta1', 'summerSanta2'];
const winterName = ['winterSanta1', 'winterSanta2'];

class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameScene'})
  }
  preload() { 
    this.load.image('santa','santa.png');
    this.load.image('summerSanta1', 'summerSanta1.png');
    this.load.image('summerSanta2', 'summerSanta2.png');
    this.load.image('winterSanta1', 'winterSanta1.png');
    this.load.image('winterSanta2', 'winterSanta2.png');
    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
    this.load.image('wall', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
    this.load.image('winterEnd', 'winterEnd.jpg');
    this.load.image('summerEnd', 'summerEnd.jpg');
  }

  create() {
//Create player   
    gameState.player = this.physics.add.sprite(450, 350, 'santa').setScale(.08);
    gameState.player.body.setAllowGravity(false);

//Create platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(450, 690, 'platform').setScale(5, .3).refreshBody();

//Create wall
    const wall = this.physics.add.staticGroup();
    wall.create(-12, 450, 'wall').setScale(.05, 14).refreshBody();

//Create scores and timer texts
    gameState.scoreSummerText = this.add.text(115, 680, 'Summer: 0', { fontSize: '15px', fill: '#000000' });
    gameState.timerText = this.add.text(415, 680, 'Time: 60s', { fontSize: '15px', fill: '#000000' });
    gameState.scoreWinterText = this.add.text(715, 680, 'Winter: 0', { fontSize: '15px', fill: '#000000' });

//Create colisions
    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, platforms);

//Create keyboard movements
    gameState.cursors = this.input.keyboard.createCursorKeys();

//Create timer and end game 
    const endGame = () => {
        summer.clear(true);
        winter.clear(true);
        winterClothesLoop.destroy();
        summerClothesLoop.destroy();
        this.physics.pause();
        this.add.text(410, 645, 'Play Again', { fontSize: '15px', fill: '#000000' });
        if (gameState.winterScore > gameState.summerScore) {
            return this.add.image(450, 310, 'winterEnd', null);
            } 
        if (gameState.winterScore < gameState.summerScore) {
            return this.add.image(450, 310, 'summerEnd', null);
            } 
        this.input.on('pointerup', () => {
            this.scene.restart('GameScene'); 
            gameState.timerText = this.add.text(195, 485, 'Time: 60s', { fontSize: '15px', fill: '#000000' });
            gameState.scoreSummerText = this.add.text(70, 485, 'Summer: 0', { fontSize: '15px', fill: '#000000' });
            gameState.scoreWinterText = this.add.text(315, 485, 'Winter: 0', { fontSize: '15px', fill: '#000000' });
            gameState.winterScore = 0;
            gameState.summerScore = 0;           
        });
    }

    gameState.timer = this.time.addEvent({
        delay: 60000,
        callback: endGame,
        callbackScope: this,
        loop: false,
    });

//Create winter clothes
    const winter = this.physics.add.group();
    
    const winterClothes = () => {
      const xCoord = Math.random() * 890;
      winter.create(xCoord, 10, winterName[Math.floor(Math.random() * (2))]);
      winter.children.iterate((child) => {
        child.setScale(0.032, 0.032);
      });
    }

    const winterClothesLoop = this.time.addEvent({
      delay: 350,
      callback: winterClothes,
      callbackScope: this,
      loop: true,
    });

//Create summer clothes
    const summer = this.physics.add.group();

    const summerClothes = () => {
        const yCoord = Math.random() * 590;
        summer.create(910, yCoord, summerName[Math.floor(Math.random() * (2))]);
        summer.children.iterate((child) => {
            child.setScale(0.075, 0.075);
          });
        summer.setVelocityX(-100);
        summer.setVelocityY(-53);
      }
  
    const summerClothesLoop = this.time.addEvent({
        delay: 600,
        callback: summerClothes,
        callbackScope: this,
        loop: true,
      });

//Destroy winter clothes after colision with platform
    this.physics.add.collider(winter, platforms, boot => {
        boot.destroy();
    })

//Destroy summer clothes after colision with wall
    this.physics.add.collider(summer, wall, short => {
        short.destroy();
    })

//Update summer score
    this.physics.add.overlap(gameState.player, summer, (player, short) => {
        short.destroy();
        gameState.summerScore += 10;
        gameState.scoreSummerText.setText(`Summer: ${gameState.summerScore}`);
    }, null, this);

//Update winter score  
    this.physics.add.overlap(gameState.player, winter, (player, boot) => {
        boot.destroy();
        gameState.winterScore += 10;
        gameState.scoreWinterText.setText(`Winter: ${gameState.winterScore}`);
    }, null, this); 
  }

  update() {
//Keyboard movements
    if (gameState.cursors.right.isDown) {
        gameState.player.x += 5;
    }
    
    if (gameState.cursors.left.isDown) {
        gameState.player.x -= 5;
    }
    
    if (gameState.cursors.down.isDown) {
        gameState.player.y += 5;
    }
    
    if (gameState.cursors.up.isDown) {
        gameState.player.y -= 5;
    }

//Update and format timer
    const time = 60 - gameState.timer.getElapsedSeconds();
    gameState.timerText.setText(`Time: ${time.toString().substr(0,2)}s`);
  }
}

//Create game
const config = {
	type: Phaser.AUTO,
	width: 900,
	height: 700,
	backgroundColor: "#327d52",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			enableBody: true,
		}
	},
	scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);

