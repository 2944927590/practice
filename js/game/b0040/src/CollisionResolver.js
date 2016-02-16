function CollisionResolver(game) {
    this.game = game;
    this.balls = [];
    this.bullets = [];

}

CollisionResolver.prototype.registerBall = function(ball) {
    this.balls.push(ball);
};


CollisionResolver.prototype.registerBullet = function(bullet) {
    this.bullets.push(bullet);
};


CollisionResolver.prototype.update = function() {
    this.balls.forEach(function(val) {
        this.watch(val);
    }, this);

    this.bullets.forEach(function(val) {
        this.watchBullet(val);
    }, this);
};

CollisionResolver.prototype.unregisterBall = function(ball) {
    this.balls.forEach(function(val, ind, arr) {
        if (ball === val) {
            arr.splice(ind, 1);
        }
    });
};

CollisionResolver.prototype.unregisterBullet = function(bullet) {
    this.bullets.forEach(function(val, ind, arr) {
        if (bullet === val) {
            arr.splice(ind, 1);
        }
    });
};

CollisionResolver.prototype.conduct = function(ball) {
    var bricks = this.game.bricks;
    var height = this.game.bricks.brickProportions.height, width = this.game.bricks.brickProportions.width;

    var rowTop = Math.floor(ball.y / height), rowBot = Math.floor(ball.bottom / height),
            colLeft = Math.floor(ball.x / width),
            colRight = Math.floor(ball.right / width);
    var suspects = bricks.slice({
        rows: [rowTop, rowBot],
        cols: [colLeft, colRight]
    });
    if (suspects.length === 0) {
        return;
    }
    var i = 0;
    while (
            suspects[i] &&
            i < suspects.length) {
        this.detectBrickCollision(ball, suspects[i]);
        i++;
    }

};

CollisionResolver.prototype.detectBrickCollision = function(ball, brick) {
    var intersects = this.intersects(ball, brick);
    if (intersects) {
        switch (intersects) {
            case "top":
                ball.y = brick.y - ball.height;
                ball.yVelocity = -ball.yVelocity;
                break;
            case 'bottom':
                ball.y = brick.bottom;
                ball.yVelocity = -ball.yVelocity;
                break;
            case 'left':
                ball.x = brick.x - ball.width;
                ball.xVelocity = -ball.xVelocity;
                break;
            case 'right':
                ball.x = brick.right;
                ball.xVelocity = -ball.xVelocity;
                break;
        }
        brick.collide(ball);
        return true;
    }
    return false;

};

CollisionResolver.prototype.intersects = function(ball, brick) {
    //find closest point on the rectangle's perimeter
    var closestX = this.clamp(ball.center.x, brick.x, brick.right),
            closestY = this.clamp(ball.center.y, brick.y, brick.bottom);

    //calculate the distance between this closest point and circle's center
    var dx = ball.center.x - closestX,
            dy = ball.center.y - closestY;

    //if the distance is less than circle's radius, an intersection occurs
    var d = Math.sqrt((dx * dx) + (dy * dy));

    if (d < ball.radius) {
        var side = this.getSide(brick, ball);
        //determin which side of rectangle collided
        return side;
    }
    return false;
};



CollisionResolver.prototype.castLine = function(x1, x2, y1, y2) {
    var dx = x2 - x1,
            dy = y2 - y1;
    if (dx == 0) {
        return {x: x2};
    } else if (dy == 0) {
        return {y: y2};
    }
    var k = (y2 - y1) / (x2 - x1),
            b = y1 - k * x1;
    return {
        k: k,
        b: b
    };
};


CollisionResolver.prototype.cross = function(line, side) {
    var o = {};
    var y = side.y, x = side.x, max = side.max, min = side.min, k = line.k, b = line.b;

    if (k != undefined) {
        if (y) {
            o.x = (y - b) / k;
            return (o.x >= min && o.x <= max);
        } else if (x) {
            o.y = x * k + b;
            return (o.y >= min && o.y <= max);
        }
    } else if (line.y != undefined) {
        if (y) {
            return (y == line.y);
        } else if (x) {
            return (line.y >= min && line.y <= max);
        }
    } else if (line.x != undefined) {
        if (x) {
            return (x == line.x);
        } else if (y) {
            return (line.x >= min && line.x <= max);
        }
    }
};

CollisionResolver.prototype.getSide = function(brick, ball) {

    var left = {
        x: brick.x,
        min: brick.y - ball.radius,
        max: brick.bottom + ball.radius,
        which: 'left'
    },
    right = {
        x: brick.right,
        min: brick.y - ball.radius,
        max: brick.bottom + ball.radius,
        which: 'right'
    },
    top = {
        y: brick.y,
        min: brick.x - ball.radius,
        max: brick.right + ball.radius,
        which: "top"
    },
    bot = {
        y: brick.bottom,
        min: brick.x - ball.radius,
        max: brick.right + ball.radius,
        which: 'bottom'
    },
    y1 = ball.center.y,
            x1 = ball.center.x,
            y, x;

    y = y1 - ball.yVelocity;
    x = x1 - ball.xVelocity;

    var path = this.castLine(x, x1, y, y1);

    var bound = [left, top, right, bot];
    var sides = [];
    for (var i = 0; i < bound.length /*&& sides.length < 2*/; i++) {
        if (this.cross(path, bound[i])) {
            sides.push(bound[i].which);
        }
    }
    for (var i = 0; i < sides.length; i++) {
        switch (sides[i]) {
            case 'top':
                if (ball.yVelocity < 0 || brick.isUpper() || brick.above) {
                    sides[i] = null;
                }
                break;
            case 'bottom':
                if (ball.yVelocity > 0 || brick.below) {
                    sides[i] = null;
                }
                break;
            case 'left':
                if (ball.xVelocity < 0 || brick.prevInRow || brick.isFirst()) {
                    sides[i] = null;
                }
                break;
            case 'right':
                if (ball.xVelocity > 0 || brick.nextInRow || brick.isLast()) {
                    sides[i] = null;
                }
                break;
        }
    }
    var which;
    for (var i = 0; i < sides.length; i++) {
        if (!sides[i])
            continue;
        else
            which = sides[i];
    }
    return which;
};



CollisionResolver.prototype.clamp = function(val, min, max) {
    if (val >= min && val <= max)
        return val;
    else if (val < min)
        return min;
    else if (val > max)
        return max;
};

CollisionResolver.prototype.watch = function(ball) {
    if (!ball)
        return;
    var bricksLevel = this.game.bricks.rows * this.game.bricks.brickProportions.height,
            bate = this.game.bate;
    if (ball.y <= bricksLevel) {
        this.conduct(ball);
    } else if (ball.bottom >= bate.y && ball.y <= bate.center.y && ball.yVelocity > 0) {
        this.handleBateCollision(ball, bate);
    }
};


CollisionResolver.prototype.watchBullet = function(bullet) {
    var bricksLevel = this.game.bricks.rows * this.game.bricks.brickProportions.height;

    if (bullet.y <= bricksLevel) {
        this.conductBullet(bullet);
    }
};

CollisionResolver.prototype.conductBullet = function(bullet) {
    var bricks = this.game.bricks;
    var width = this.game.bricks.brickProportions.width,
            height = this.game.bricks.brickProportions.height;
    var col = Math.floor(bullet.center.x / width);
    var row = Math.floor(bullet.center.y / height);
    var brick = bricks.getBrick(row, col);
    if (brick) {
        if (!brick.below && bullet.stage == this.game.stage)
            brick.collide(bullet);
        bullet.explode();
    }
    if (bullet.bottom <= 0) {
        bullet.explode();
    }
};

CollisionResolver.prototype.reflectAtAngle = function(ball, deg) {
    var rad = deg / 180 * Math.PI;
    v = Math.sqrt(Math.pow(ball.xVelocity, 2) + Math.pow(ball.yVelocity, 2));

    var dy = -Math.abs(v * Math.sin(rad)),
            dx = v * Math.cos(rad);
    ball.y = this.game.bate.y - ball.height;
    return {
        x: dx,
        y: dy
    };
};

CollisionResolver.prototype.handleBateCollision = function(ball, bate) {
    var offset = ball.center.x - bate.x;
    if (offset < 0 || offset > bate.width)
        return;

    for (var i = 1; i < 6; i++) {
        if (offset < i * bate.width / 5)
            break;
    }

    var speed,
            potentialY,
            potentialX;

    switch (i) {
        case 1:
            speed = this.reflectAtAngle(ball, 150);
            break;
        case 2:
            speed = this.reflectAtAngle(ball, 120);
            break;
        case 3:
            ball.y = this.game.bate.y - ball.height;
            speed = {
                x: ball.xVelocity,
                y: -ball.yVelocity
            };
            break;
        case 4:
            speed = this.reflectAtAngle(ball, 60);
            break;
        case 5:
            speed = this.reflectAtAngle(ball, 30);
            break;
        default:
            return;
    }

    potentialX = speed.x;
    potentialY = speed.y;

    if (bate instanceof StickyBate) {
        ball.yVelocity = ball.xVelocity = 0;
        ball.glued = offset;
        bate.loaded = {
            'ball': ball,
            'launchSpeed': speed
        };
    } else {
        ball.yVelocity = potentialY;
        ball.xVelocity = potentialX;
    }

};

