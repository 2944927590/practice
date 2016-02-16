// GameItem - superclass 
function GameItem(game, color) {
    this.color = color || 'rgb(200, 200, 200)';
    this.game = game || null;
}
GameItem.prototype.update = function() {
    // /
};

GameItem.prototype.placeAt = function(x, y) {
    this.x = x;
    this.y = y;
};

Object.defineProperty(GameItem.prototype, "bottom", {
    get: function() {
        return this.y + this.height;
    }
});

Object.defineProperty(GameItem.prototype, "right", {
    get: function() {
        return this.x + this.width;
    }
});

Object.defineProperty(GameItem.prototype, "center", {
    get: function() {
        var halfWidth = (this.radius) ? this.radius : this.width / 2,
                halfHeight = (this.radius) ? this.radius : this.height / 2;
        var cX = this.x + halfWidth,
                cY = this.y + halfHeight;
        var center = {
            'x': cX,
            'y': cY
        };
        return center;
    }
});

// Ball - subclass
function Ball() {
    GameItem.apply(this, arguments);
    this.normalSpeed = {
        x: 3,
        y: -7
    };
    this.color = '#FFFF99';
    this.radius = 5;
    this.speedToNormal();
    this.glued = null;
    this.power = 1;
    this.unstoppable = false;
    this.width = this.height = this.radius * 2;
    this.game.collisionResolver.registerBall(this);
}

Ball.prototype = Object.create(GameItem.prototype);

Ball.prototype.update = function() {
    this.move();
};

Ball.prototype.draw = function() {
    this.game.canvasUtil.drawCircle(this.color, this.x + this.radius,
            this.y + this.radius, this.radius);
};
Ball.prototype.move = function() {
    if (this.glued) {
        var offset = this.glued;
        this.x = this.game.bate.x + offset;
    } else {
        var now = new Date().getTime();
        var delta = now - this.game.lastRender;
        var k = delta / this.game.delay;
        this.x += this.xVelocity * k;
        this.y += this.yVelocity * k;
    }
    if (this.y <= 0) {
        this.yVelocity = -this.yVelocity;
        this.y = 1;
    }
    if (this.right >= this.game.width) {
        this.xVelocity = -this.xVelocity;
        this.x = this.game.width - (this.width + 1);
    }
    if (this.x <= 0) {
        this.xVelocity = -this.xVelocity;
        this.x = 1;
    }
    if (this.y >= this.game.height) {
        this.die();
    }
};


Ball.prototype.disrupt = function() {
    var left = new Ball(this.game);
    var right = new Ball(this.game);
    this.game.balls.push(left);
    left.placeAt(this.x - this.width - 5, this.y);
    left.yVelocity = right.yVelocity = this.yVelocity;
    left.xVelocity = this.xVelocity - 1;
    this.game.collisionResolver.registerBall(left);

    this.game.balls.push(right);
    right.placeAt(this.right + 5, this.y);
    right.xVelocity = this.xVelocity + 1;
    this.game.collisionResolver.registerBall(right);
};

Ball.prototype.speedToNormal = function() {
    this.xVelocity = this.normalSpeed.x;
    this.yVelocity = this.normalSpeed.y;
};

Ball.prototype.die = function() {
    this.game.balls.forEach(function(val, index) {
        if (val === this) {
            this.game.balls.splice(index, 1);
        }
    }, this);
    this.game.collisionResolver.unregisterBall(this);

    if (this.game.balls.length == 1 && !this.game.paused) {
        this.game.restore();
    }

    if (this.game.balls.length === 0 && !this.game.paused) {
        this.game.decrementLives();
    }

};

function Bate() {
    GameItem.apply(this, arguments);
    this.color = 'lightgray';
    this.width = 70;
    this.height = 20;
    this.normalWidth = 70;
    this.step = 10;
    this.direction = 0;
}
Bate.prototype = Object.create(GameItem.prototype);

Bate.prototype.move = function() {
    var x = this.x;
    x += (this.direction * this.step);
            if (x < 0) {
            x = 0;
        } else if (x+this.width > this.game.width) {
            x = this.game.width - this.width;
        }
        this.x = x;
};

Bate.prototype.startMoving = function(keyCode) {
    this.direction = (keyCode == 39)? 1 : -1;
};

Bate.prototype.stop = function() {
  this.direction = 0;  
};

Bate.prototype.draw = function() {
    var color = this.color;
    this.game.canvasUtil.drawBate(this, true);
};
Bate.prototype.collide = function(ball) {
    ball.yVelocity = -ball.yVelocity;
};
Bate.prototype.update = function() {
    if (this.finalWidth && this.width < this.finalWidth) {
        this.width++;
        if (this.width % 2 !== 0) {
            this.x--;
        }
    } else {
        delete this.finalWidth;
    }
    this.move();
};

Bate.prototype.extend = function() {
    this.finalWidth = this.width * 2;
};

Bate.prototype.toNormalWidth = function() {
    this.width = this.normalWidth;
    this.finalWidth = null;
};


function StickyBate() {
    Bate.apply(this, arguments);
    this.sticky = true;
    this.color = 'YellowGreen';
    this.loaded = null;
}

StickyBate.prototype = Object.create(Bate.prototype);

StickyBate.prototype.launch = function(ball, launchSpeed) {
    if (!this.loaded) {
        return;
    }
    this.loaded.ball.yVelocity = this.loaded.launchSpeed.y;
    this.loaded.ball.xVelocity = this.loaded.launchSpeed.x;
    this.loaded.ball.glued = null;
    this.loaded = null;
};

StickyBate.prototype.constructor = StickyBate();


function ArmedBate() {
    Bate.apply(this, arguments);
    this.armed = true;
    this.lastFired = 0;
    this.coolDown = 300;
}

ArmedBate.prototype = Object.create(Bate.prototype);

ArmedBate.prototype.fire = function() {
    var now = new Date().getTime();
    if (now - this.lastFired < this.coolDown) {
        return;
    } else {
        var left = this.game.bullets.create();
        left.placeAt(this.x + 5, this.y - left.height);
        var right = this.game.bullets.create();
        right.placeAt(this.right - 5 - right.width, this.y - right.height);
        this.lastFired = new Date().getTime();
    }
};

ArmedBate.prototype.draw = function() {
  Bate.prototype.draw.call(this);
  this.game.canvasUtil.lazerAim();
};


ArmedBate.prototype.constructor = ArmedBate;

function Brick(gameObject, color, properties, collectionObject) {
    GameItem.apply(this, arguments);
    this.color = color || 'gray';
    this.hp = 1;
    this.collection = collectionObject;
    this.row = properties.row;
    this.col = properties.col;
    this.width = properties.proportions.width;
    this.height = properties.proportions.height;
    this.x = this.col * this.width;
    this.y = this.row * this.height;
}
Brick.prototype = Object.create(GameItem.prototype);

Object.defineProperty(Brick.prototype, 'score', {
    get: function() {

        return (this instanceof ToughBrick) ? this.game.stage * 50 : this.collection.scores[this.color];
    }
});

Brick.prototype.draw = function() {
    var color = this.color;
    this.game.canvasUtil.drawBrick(this);
};
Brick.prototype.collide = function(ball) {
    if (this.unbreakable) {
        this.startBlinking();
        return;
    }
    this.hp -= ball.power;
    if (this.hp <= 0) {
        this.die();
    } else {
        this.startBlinking();
    }
};

Brick.prototype.randomizePrize = function() {
    var length = this.game.prizePossibility.length;
    var rand = Math.floor(Math.random() * (length - 0.0001));
    return this.game.prizePossibility[rand];

};

Brick.prototype.die = function() {
    this.game.totalScore += this.score;
    var lucky = this.game.generatePrizes && this.randomizePrize();
    if (lucky) {
        var prize = this.game.randomPrize();
        prize.placeAt(this.center.x - prize.width / 2, this.center.y - prize.height / 2);
    }
    this.collection.remove(this);

};

Brick.prototype.startBlinking = function() {
    if (this.isBlinking) {
        return;
    }
    this.isBlinking = true;
    this.currX = 0;
    this.currY = 0;
};

Brick.prototype.stopBlinking = function() {
    this.isBlinking = false;
};

Brick.prototype.isLast = function() {
    return !!(this.col === this.collection.cols - 1);
};

Brick.prototype.isUpper = function() {
    return !!(this.row === 0);
};

Brick.prototype.isFirst = function() {
    return (this.col === 0);
};

Object.defineProperty(Brick.prototype, "above", {
    get: function() {
        return this.collection.above(this);
    }
});

Object.defineProperty(Brick.prototype, "below", {
    get: function() {
        return this.collection.below(this);
    }
});
Object.defineProperty(Brick.prototype, "nextInRow", {
    get: function() {
        return this.collection.nextInRow(this);
    }
});
Object.defineProperty(Brick.prototype, "prevInRow", {
    get: function() {
        return this.collection.prevInRow(this);
    }
});

Ball.prototype.constructor = Ball;
Bate.prototype.constructor = Bate;
Brick.prototype.constructor = Brick;

function ToughBrick() {
    Brick.apply(this, arguments);
    this.color = '#B8B8B8';
    this.hp = 2;
}

Object.defineProperty(ToughBrick.prototype, "score", {
    get: function() {
        return this.game.stage * 50;
    }
});

ToughBrick.prototype = Object.create(Brick.prototype);

ToughBrick.prototype.draw = function() {
    this.game.canvasUtil.drawBrick(this);
};

ToughBrick.prototype.constructor = ToughBrick;

function UnbreakableBrick() {
    Brick.apply(this, arguments);
    this.color = "#CC9900";
    this.unbreakable = true;
}

UnbreakableBrick.prototype = Object.create(Brick.prototype);

UnbreakableBrick.prototype.constructor = UnbreakableBrick;

function Bullet(game, bulletsCollection) {
    GameItem.apply(this, arguments);
    this.width = 6;
    this.height = 16;
    this.color = '#F5FFFA';
    this.dy = -7;
    this.power = 1;
    this.stage = this.game.stage;
    this.collection = bulletsCollection;
}

Bullet.prototype = Object.create(GameItem.prototype);

Bullet.prototype.draw = function() {
    this.game.canvasUtil.drawBullet(this);
};

Bullet.prototype.move = function() {
    var now = new Date().getTime();
    var delta = now - this.game.lastRender;
    var k = delta / this.game.delay;
    this.y += this.dy * k;
};

Bullet.prototype.explode = function() {
    this.collection.remove(this);
    this.game.collisionResolver.unregisterBullet(this);
};

Bullet.prototype.constructor = Bullet;

function BulletCollection(game) {
    this.game = game;
    this.bullets = [];
}

BulletCollection.prototype.draw = function() {
    this.bullets.forEach(function(val) {
        val.draw();
    });
};

BulletCollection.prototype.update = function() {
    this.bullets.forEach(function(val) {
        val.move();
    });
};

BulletCollection.prototype.remove = function(bullet) {
    this.bullets.forEach(function(val, index, array) {
        if (val === bullet) {
            array.splice(index, 1);
        }
    });
    this.game.collisionResolver.unregisterBullet(bullet);
};

BulletCollection.prototype.create = function() {
    var bullet = new Bullet(this.game, this);
    this.bullets.push(bullet);
    this.game.collisionResolver.registerBullet(bullet);
    return bullet;
};

BulletCollection.prototype.purge = function() {
    this.bullets.forEach(function(val) {
        val.explode();
    });
};

BulletCollection.prototype.constructor = BulletCollection;

