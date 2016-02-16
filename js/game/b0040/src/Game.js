function Game() {
    this.fps = 60;
    var canvas = document.getElementById('game_field');
    this.height = 640;
    this.width = 598;
    this.canvasUtil = new CanvasUtil(this, canvas, this.width, this.height);
    this.stage = 1;
    this.lives = 3;
    this.totalScore = 0;
    this.paused = true;
    this.lastRender = 0;
    this.wasPausedAt = null;
    this.generatePrizes = 1;
    this.currentListener = null;
    this.end = false;
    this.prizeTypes = ['ExtendPrize', 'GluePrize', 'SlowPrize', 'PlasmaGunPrize', 'DisruptionPrize',
        'ExtraLifePrize'];
    this.prizePossibility = [0, 0, 0, 1];
    this.prizes = new PrizeCollection(this);
    this.bullets = new BulletCollection(this);
    this.activePowerup = null;
    this.collisionResolver = new CollisionResolver(this);
    var bate = new Bate(this);
    this.bate = bate;
    this.balls = [];
    var ball = new Ball(this);
    ball.placeAt(256 - ball.radius, 450 - ball.height);
    this.balls.push(ball);
    this.levels = {
        1: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['s', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
            ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'],
            ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l']
        ],
        2: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['r', 'y', 'r', 'y', 'r', 'y', 'r', 'r', 'y', 'r', 'y', 'r', 'y'],
            ['a', 'w', 'a', 'w', 'a', 'w', 'a', 'w', 'a', 'w', 'a', 'w', 'a'],
            ['s', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's'],
            ['b', 'o', 'b', 'o', 'b', 'o', 'b', 'o', 'o', 'b', 'o', 'b', 'o'],
            ['o', 'g', 'o', 'g', 'o', 'g', 'o', 'g', 'g', 'o', 'g', 'o', 'g'],
            ['s', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's']
        ],
        3: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'r', 'r'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'y', 'y', 'y', 'y', 'y'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['b', 'b', 'b', 'b', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['w', 'w', 'w', 'w', 'w', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['p', 'p', 'p', 'p', 'p', 'p', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['y', 'y', 'y', 'y', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['l', 'l', 'l', 'l', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']
        ],
        4: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 'u', 'u', 'u', 'u', 'u', 'u', 'u', 0, 0, 0],
            [0, 0, 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'u', 'u', 0, 0],
            [0, 0, 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 0, 0],
            [0, 0, 'u', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'u', 0, 0],
            [0, 0, 'u', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'u', 0, 0],
            [0, 0, 'u', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'u', 0, 0],
            [0, 0, 'u', 's', 'p', 'p', 'p', 'p', 'p', 's', 'u', 0, 0],
            [0, 0, 'u', 's', 's', 'w', 'w', 'w', 's', 's', 'u', 0, 0]
        ],
        5: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'r', 'r', 'r', 'r', 'r', 0, 'l', 'l', 'l', 'l', 'l', 0],
            [0, 'p', 'p', 'p', 'p', 'p', 0, 'w', 'w', 'w', 'w', 'w', 0],
            [0, 'g', 'g', 'g', 'g', 'g', 0, 'o', 'o', 'o', 'o', 'o', 0],
            [0, 'b', 'b', 'b', 'b', 'b', 0, 'p', 'p', 'p', 'p', 'p', 0],
            [0, 'y', 'y', 'y', 'y', 'y', 0, 'g', 'g', 'g', 'g', 'g', 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'l', 'l', 'l', 'l', 'l', 0, 'a', 'a', 'a', 'a', 'a', 0],
            [0, 'r', 'r', 'r', 'r', 'r', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'y', 'y', 'y', 'y', 'y', 0],
            [0, 'o', 'o', 'o', 'o', 'o', 0, 'b', 'b', 'b', 'b', 'b', 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'y', 'y', 'y', 'y', 'y', 0, 'g', 'g', 'g', 'g', 'g', 0],
        ],
        6: [
            ['b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['w', 'w', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['y', 'y', 'y', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['g', 'g', 'g', 'g', 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['a', 'a', 'a', 'a', 'a', 0, 0, 0, 0, 0, 0, 0, 0],
            ['o', 'o', 'o', 'o', 'o', 'o', 0, 0, 0, 0, 0, 0, 0],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 0, 0, 0, 0, 0, 0],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 0, 0, 0, 0, 0],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 0, 0, 0, 0],
            ['a', 'a', 'a', 'a', 'a', 'y', 'y', 'y', 'y', 'y', 0, 0, 0],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 0, 0],
            ['s', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'r'],
        ]
    };

    this.renderLevel();


}


Game.prototype.gameloop = function() {
    if (this.lastRender == 0)
        this.lastRender = new Date().getTime();
    var current = new Date().getTime(),
            delta = current - this.lastRender;
    if (delta >= this.delay && !this.paused) {
        this.updateAll();
        if (this.paused)
            return;
        this.drawAll();
        this.lastRender = new Date().getTime();
        if (this.bricks.length == 0) {
            this.nextLevel();
        }
    }
    this.loop = requestAnimationFrame(Game.prototype.gameloop.bind(this));
};

Game.prototype.restore = function() {

    return this.activePowerup && this.activePowerup.prototype.deactivate.call(this);
};

Game.prototype.randomPrize = function() {
    var int = Math.floor(Math.random() * (this.prizeTypes.length - 0.0001)),
            type = this.prizeTypes[int];
    var prize = this.prizes.create(type);
    return prize;
};

Game.prototype.win = function() {
    this.drawAll();
    this.end = true;
    this.canvasUtil.message('You win! \n Your score: ' + this.totalScore, 300, this.height / 2 + 100);
    this.canvasUtil.message('press space to restart', 300, this.height / 2 + 150);
};

Game.prototype.over = function() {
    this.pause();
    this.end = true;
    this.canvasUtil.message('Game over! \n Your score: ' + this.totalScore, 300, this.height / 2 + 100);
    this.canvasUtil.message('press space to restart', 300, this.height / 2 + 150);

};

Game.prototype.restart = function() {
    this.end = false;
    this.stage = 0;
    this.totalScore = 0;
    this.lives = 3;
    this.nextLevel();
};

Game.prototype.renderLevel = function() {
    this.canvasUtil.fillMargin();

    this.canvasUtil.clear();
    this.canvasUtil.fillBlack();

    this.canvasUtil.drawStatistics();
    this.canvasUtil.updateLives();
    this.canvasUtil.drawDescription();
    this.toInitialPosition();
    this.prizes.purge();
    this.bullets.purge();
    //this.collisionResolver.update();
    this.bricks = new BricksCollection(this);


    this.drawAll();
};

Game.prototype.decrementLives = function() {
    this.lives--;
    this.canvasUtil.updateLives();
    this.totalScore = Math.max(this.totalScore - 500, 0);

    if (this.lives < 0) {
        this.lives = 0;
        this.over();
        return;
    }
    this.restore();
    this.toInitialPosition();
    this.drawAll();
    this.pause();
};

Game.prototype.toInitialPosition = function() {
    this.bate.placeAt(this.width / 2 - this.bate.width / 2, this.height - 60);
    this.balls.forEach(function(val) {
        val.die();
    });
    this.balls = [];
    this.balls.push(new Ball(this));
    this.balls[0].placeAt(this.width / 2 - this.balls[0].radius, this.height - 60 - this.balls[0].height);
    this.balls[0].speedToNormal();
};

Game.prototype.start = function() {
    var game = this;
    this.end = false;
    game.paused = false;
    /*
     document.addEventListener('mousemove', function(e) {
     var offset = game.canvasUtil.canvas.getBoundingClientRect().left;
     var x = (e.clientX - offset) - game.bate.width / 2;
     if (x < 0) {
     x = 0;
     } else if (x + game.bate.width > game.width) {
     x = game.width - game.bate.width;
     }
     game.bate.x = x;
     });
     */
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 39 || e.keyCode === 37) {
            game.bate.startMoving(e.keyCode);
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 39 || e.keyCode === 37) {
            game.bate.stop();
        }
    });
    if (this.wasPausedAt) {
        var now = new Date().getTime();
        var pauseTime = now - this.wasPausedAt;
        this.lastRender += pauseTime;
    }
    this.gameloop();

};


Object.defineProperty(Game.prototype, 'delay', {
    get: function() {
        return 1000 / this.fps;
    }
});

Game.prototype.pause = function(gameover) {
    if (this.paused)
        return;
    var cancelAnimationFrame = cancelAnimationFrame || clearTimeout;
    cancelAnimationFrame(this.loop);
    this.wasPausedAt = new Date().getTime();
    this.paused = true;
};

Game.prototype.nextLevel = function() {
    this.pause();
    this.stage++;
    if (!this.levels[this.stage])
        this.win();
    else {
        this.restore();
        this.updateAll();
        this.drawAll();
        this.renderLevel();
    }
};

Game.prototype.drawAll = function() {
    this.canvasUtil.clear();
    this.canvasUtil.fillBlack();
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].draw();
    }
    this.bricks.draw();
    this.bate.draw();
    this.bullets.draw();
    this.prizes.draw();
};

Game.prototype.updateAll = function() {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].update();
    }
    ;
    this.bate.update();
    this.bullets.update();
    this.prizes.update();
    this.collisionResolver.update();
    this.canvasUtil.updateStatistics(this.totalScore, this.stage);
};


function BricksCollection(game) {
    this.length = 0;
    this.brickProportions = {
        height: 23,
        width: 46
    };
    this.scores = {
        '#00FFFF': 50,
        '#FFFFFF': 60,
        '#FFA500': 70,
        '#FFC0CB': 80,
        '#FFFF00': 90,
        '#008000': 100,
        '#0000FF': 110,
        '#FF0000': 120,
        '#00FF00': 130
    };
    this.shortNames = {
        'r': '#FF0000',
        'b': '#0000FF',
        'g': '#008000',
        'y': '#FFFF00',
        'p': '#FFC0CB',
        'o': '#FFA500',
        'w': '#FFFFFF',
        'l': '#00FF00',
        'a': '#00FFFF'
    };
    this.game = game;
    this.bricks = [];
    var stage = this.game.levels[this.game.stage];
    var rows = stage.length;
    for (var r = 0; r < rows; r++) {
        this.bricks.push([]);
        var col = 0;
        stage[r].forEach(
                function(val) {
                    switch (val) {
                        case 'u':
                            this.bricks[r].push(new UnbreakableBrick(this.game, null, {
                                row: r,
                                col: col,
                                proportions: this.brickProportions
                            }, this));
                            break;
                        case 's':
                            this.bricks[r].push(new ToughBrick(this.game, null, {
                                row: r,
                                col: col,
                                proportions: this.brickProportions
                            }, this));
                            this.length++;
                            break;
                        case 0:
                            this.bricks[r].push(null);
                            break;
                        default:
                            this.bricks[r].push(new Brick(this.game, this.shortNames[val], {
                                row: r,
                                col: col,
                                proportions: this.brickProportions
                            }, this
                                    ));
                            this.length++;
                            break;
                    }
                    col++;
                }, this);
    }
}

BricksCollection.prototype.draw = function() {
    this.bricks.forEach(function(el, index, array) {
        if (Array.isArray(el)) {
            el.forEach(function(val) {
                if (val instanceof Brick) {
                    val.draw();
                }
            });
        }
    });
};

BricksCollection.prototype.add = function(brick) {
    if (brick instanceof Brick) {
        var row = brick.position.row, col = brick.position.col;
        this.bricks[row][col] = brick;
    } else
        return;
};
BricksCollection.prototype.remove = function(brick) {
    var row = brick.row, col = brick.col;
    this.bricks[row][col] = null;
    this.length--;
    if (this.length === 0) {
        this.game.nextLevel();
    }
};
BricksCollection.prototype.slice = function(obj) {
    var exist = [];
    for (var i = obj.rows[0]; i <= Math.min(obj.rows[1], this.bricks.length); i++) {
        for (var k = obj.cols[0]; k <= obj.cols[1]; k++) {
            if (Array.isArray(this.bricks[i])) {
                var brick = this.bricks[i][k];
                if (brick)
                    exist.push(brick);
            }
        }
    }
    return exist;
};
BricksCollection.prototype.above = function(brick) {
    var row = brick.row,
            col = brick.col;
    var above = row - 1;
    if (above < 0)
        return null;
    return this.bricks[above][col];
};
BricksCollection.prototype.below = function(brick) {
    var row = brick.row,
            col = brick.col;
    var below = row + 1;
    if (below > this.bricks.length - 1)
        return null;
    return this.bricks[below][col];
};
BricksCollection.prototype.nextInRow = function(brick) {
    var row = brick.row,
            col = brick.col;
    var next = col + 1;
    if (next > this.cols - 1)
        return null;
    return this.bricks[row][next];
};
BricksCollection.prototype.prevInRow = function(brick) {
    var row = brick.row,
            col = brick.col;
    var prev = col - 1;
    if (prev < 0)
        return null;
    return this.bricks[row][prev];
};

BricksCollection.prototype.getLowerBrick = function(x) {
    var col = Math.floor(x / this.brickProportions.width);
    for (var i = this.bricks.length - 1; i >= 0; i--) {
        var brick = this.getBrick(i, col);
        if (!brick)
            continue;
        else
            return brick;
    }
};

Object.defineProperty(BricksCollection.prototype, 'rows', {
    get: function() {
        return this.bricks.length;
    }
});

Object.defineProperty(BricksCollection.prototype, 'cols', {
    get: function() {
        return this.bricks[0].length;
    }
});

BricksCollection.prototype.getBrick = function(row, col) {
    if (this.bricks[row]) {
        var brick = this.bricks[row][col];
    }
    return (brick) ? brick : null;
}
;

