class Main extends Phaser.Scene {
    
    // This function essentially loads things into our game
    preload() {
        this.load.spritesheet('plane', 'planesheet.png', {frameWidth: 98, frameHeight: 83});
        this.load.image('pipe', 'pipe.png');
        this.load.audio('music', 'fly.mp3');
    }

    //  it runs once at the beginning of the game and
    //  allows the user to place the things that they’ve preloaded with preload() and
    //  create objects within our game such as animations, collision detectors, text, groups, and much more
    create() {
    this.tekst = this.add.text(0, 0, "Made by someone", {fontSize: 14, color: "black"});
    //Додаємо літак на сцену
    this.plane = this.physics.add.sprite(0, 230, 'plane')
    //Масштабуємо літак
    this.plane.setScale(0.65, 0.65);
    //Встановлюємо опорну точку літака
    this.plane.setOrigin(0, 0.5);
    this.originalMusicVolume = 0.4;
    this.musicVolume = this.originalMusicVolume;
    this.anims.create({
        key: "planeAnimation",
        frames: this.anims.generateFrameNumbers('plane', {frames: [0, 1, 3, 2]}),
        frameRate: 10,
        repeat: -1
    });

    this.plane.play("planeAnimation");
    
    this.plane.body.gravity.y = 0;

    this.score = 0;
    this.originalPipeSpeed = -300;
    this.pipeSpeed = this.originalPipeSpeed;
    this.labelScore = this.add.text(20, 20, "0", {fontSize: 24, color: "black"});

    this.pipes = this.physics.add.group();

    this.timedEvent = this.time.addEvent({
        delay: 1500,
        callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
        callbackScope: this,
        loop: true
    });
    this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);

    this.backgroundMusic = this.sound.add('music', { loop: true, volume: this.musicVolume });
    this.backgroundMusic.play();
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() {
        if (this.plane.y < 0 || this.plane.y > 490) {
            this.scene.restart();
        }
        if (this.cursorKeys.up.isDown) {
            this.movePlaneUp();
            this.plane.angle -= 1;
            this.adjustMusicVolume(true);
        } else if (this.cursorKeys.down.isDown) {
            this.movePlaneDown();
            this.plane.angle += 1;
            this.adjustMusicVolume(true);
        } else {
            this.plane.angle = 0;
            this.adjustMusicVolume();
        }
    }

    adjustMusicVolume(increaseVolume = false) {
        if (increaseVolume) {
            // Збільшити гучність
            this.musicVolume = Math.min(1, this.musicVolume = 1);
        } else {
            // Зменшити гучність
            this.musicVolume = Math.max(this.originalMusicVolume, this.musicVolume = 0.25);
        }
    
        // Змініть гучність музики
        this.backgroundMusic.setVolume(this.musicVolume);
    }

    movePlaneUp() {
        this.plane.y -= 5;
    }
    
    movePlaneDown() {
        this.plane.y += 5;
    }

    //Функція для створення блоку труби
    addOnePipe(x, y) {
    var pipe = this.physics.add.sprite(x, y, 'pipe');
    pipe.setOrigin(0, 0);
    this.pipes.add(pipe);
    pipe.body.velocity.x = this.pipeSpeed;

    pipe.collideWorldBounds = true;
    pipe.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfPipes() {
    var hole = Math.floor(Math.random() * 5) + 1;
    this.score += 1;

    if (this.score > 10) {
        this.pipeSpeed = this.originalPipeSpeed * 1.2;
    }

    if (this.score > 25) {
        this.pipeSpeed = this.originalPipeSpeed * 1.35;
    }

    if (this.score > 50) {
        this.pipeSpeed = this.originalPipeSpeed * 1.5;
    }

    this.labelScore.text = this.score;
    for (var i = 0; i < 20; i++) {
        if (!(i >= hole && i <= hole + 2))
            this.addOnePipe(460, i * 50 + 5);
    }
}
returnAnimation() {
    this.returnAnimationTimeline.add({
        targets: this.plane,
        angle: 0,
        duration: 100,
        ease: 'Linear',
    });

    this.returnAnimationTimeline.play();
}
    hitPipe () {
    if (this.plane.alive == false) return;

    this.timedEvent.remove(false);
    this.plane.alive = false;

    this.pipes.children.each(function(pipe) {
        pipe.body.velocity.x = 0;
    });
    this.scene.restart();
}

}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 460,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: '#07ebe7',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    }
};

const game = new Phaser.Game(config);