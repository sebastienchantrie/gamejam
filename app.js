var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();
    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');
    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
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

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);
    let compt = 0;
    let timer = 400;
        setInterval( () => {
            let step = Math.floor(Math.random() * (600 - 40 + 1) + 40);
            let xroll = Math.floor(Math.random() * -980); // Kassdéd
            stars = this.physics.add.group({
                key: 'star',
                repeat: 11,
                setXY: { x: xroll, y: -20, stepX: step}
            });
        stars.children.iterate((child) => {
            child.setVelocityY(Phaser.Math.Between(-100, 200), 200);
            child.setVelocityX(Phaser.Math.Between(200 && -300, 200), 200); // 200 vitesse gravité
        });
        this.physics.add.collider(player, stars, hitstar, null, this);
        this.physics.add.collider(stars.children , stars);
        compt++
        console.log(compt)
        }, timer);
}

function update () {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-360);
        player.anims.play('left', true);

    } else if (cursors.right.isDown) {
        player.setVelocityX(360);
        player.anims.play('right', true);

    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    } if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-330);
}



function hitstar (player, star) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}

