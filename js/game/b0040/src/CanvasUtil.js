function CanvasUtil(game, canvas, fieldWidth, fieldHeight) {
    this.game = game;
    this.canvas = canvas;
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this.context = canvas.getContext('2d');
}

CanvasUtil.prototype.drawBrick = function(brick) {
    var tough = (brick instanceof ToughBrick || brick instanceof UnbreakableBrick);
    var ctx = this.context;
    var x = brick.x,
            y = brick.y,
            height = brick.height,
            width = brick.width;
    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = 2;
    ctx.fillStyle = brick.color;
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(width - 1, 0);
    ctx.lineTo(width - 1, height - 1);
    ctx.lineTo(0, height - 1);
    ctx.strokeStyle = "black";
    ctx.stroke();

    if (tough) {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(2, height - 6);

        ctx.lineTo(2, 2);
        ctx.lineTo(width - 6, 2);

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - 4, 0);
        ctx.lineTo(width - 4, height - 4);
        ctx.lineTo(0, height - 4);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();
        ctx.restore();
    }
    if (brick.isFirst()) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
    }

    ctx.restore();
    if (brick.isBlinking) {
        var stripWidth = Math.round(brick.width / 2.5);
        if (brick.currX - 2 * stripWidth > width - 2) {
            brick.stopBlinking();
        } else {
            brick.currX += 5;
            brick.currY += 5;

            var toX = this.calcDest(brick).toX,
                    toY = this.calcDest(brick).toY,
                    fromX = this.calcDest(brick).fromX,
                    fromY = this.calcDest(brick).fromY;
            this.drawStrip(brick, stripWidth, fromX, toX, fromY, toY);
        }
    }
};

CanvasUtil.prototype.drawBullet = function(bullet) {
    var ctx = this.context,
            x = bullet.x,
            y = bullet.y,
            width = bullet.width,
            height = bullet.height;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(width / 2, height - width / 2, width / 2, 0, Math.PI);
    ctx.lineTo(0, width / 2);
    ctx.arc(width / 2, width / 2, width / 2, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.restore();
};


CanvasUtil.prototype.drawStrip = function(brick, stripWidth, fromX, toX, fromY, toY) {
    var ctx = this.context,
            brickX = brick.x,
            brickY = brick.y,
            width = brick.width - 2,
            height = brick.height - 2;

    ctx.save();
    ctx.translate(brickX, brickY);
    ctx.beginPath();
    if (toX >= width) {
        ctx.moveTo(width, height);
    } else {
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
    }
    if (toX == 0) {
        ctx.lineTo(Math.max(toX - stripWidth, 0), Math.max(toY - stripWidth, 0));
    } else if (toX - stripWidth < 0) {
        ctx.lineTo(0, height);
        ctx.lineTo(0, height - (stripWidth - toX));
    } else {
        ctx.lineTo(Math.max(toX - stripWidth, 0), toY);
    }
    if (fromX == width && fromY < stripWidth) {
        ctx.lineTo(width - (stripWidth - fromY), 0);
        ctx.lineTo(width, 0);
    } else if (fromX == width && fromY >= stripWidth) {
        ctx.lineTo(fromX, fromY - stripWidth);
    } else {
        ctx.lineTo(Math.max(fromX - stripWidth, 0), fromY);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
    ctx.restore();
};

CanvasUtil.prototype.calcDest = function(brick) {
    var x = brick.currX,
            y = brick.currY,
            width = brick.width - 2,
            height = brick.height - 2;

    var fromX = x,
            fromY = 0;
    if (fromX > width) {
        fromX = width;
        fromY = x - width;
    }

    var toX = 0;
    var toY = y;
    if (y > height) {
        toX = y - height;
        toY = height;
    }
    return {
        fromX: fromX,
        toX: toX,
        fromY: fromY,
        toY: toY
    };

};

CanvasUtil.prototype.drawCircle = function(color, x, y, rad) {
    var ctx = this.context;
    ctx.fillStyle = color;

    ctx.save();

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 25;

    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    var grad = ctx.createRadialGradient(-3, -3, 0, 0, 0, rad);
    grad.addColorStop(0.150, 'rgba(255,255,255, 0.3)');
    grad.addColorStop(0.2, 'rgba(0,0,0,0.0)');
    grad.addColorStop(0.9, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

};

CanvasUtil.prototype.drawPrize = function(prize) {
    var ctx = this.context;
    var x = prize.x,
            y = prize.y,
            width = prize.width,
            height = prize.height,
            color = prize.color;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.3)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.4, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
    ctx.fillStyle = color;
    ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(width - height / 2, 0);
    ctx.arc(width - height / 2, height / 2, height / 2,
            Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(height / 2, height);
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(prize.center.x, prize.center.y + 5);
    ctx.fillStyle = 'yellow';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 0;
    ctx.font = "bold 14pt Courier";
    ctx.textAlign = 'center';
    ctx.fillText(prize.letter, 0, 0, width);
    ctx.strokeStyle = 'black';
    ctx.restore();
};

CanvasUtil.prototype.drawBate = function(bate, shadow) {
    var ctx = this.context;
    var shadow = shadow || null;
    var width = bate.width,
            height = bate.height,
            x = bate.x,
            y = bate.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.4)');
    grad.addColorStop(0.3, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
    if (shadow) {
        ctx.save();

        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 15;
        ctx.shadowOffsetY = 25;
    }
    ctx.beginPath();
    ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.closePath();
    ctx.fillStyle = 'orangered';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineTo(width - height / 2 - 10, 0);
    ctx.closePath();
    ctx.fillStyle = bate.color;
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width - height / 2 - 10, 0);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width - height / 2, height / 2, height / 2, Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineTo(width - height / 2 - 10, 0);
    ctx.closePath();
    ctx.fillStyle = 'orangered';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    if (shadow) {
        ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(height / 2, height / 2, height / 2, Math.PI * 2 / 3, Math.PI * 4 / 3);
    ctx.closePath();
    ctx.fillStyle = 'aqua';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - height / 2, height / 2, height / 2, -Math.PI / 3, Math.PI / 3);
    ctx.closePath();
    ctx.fillStyle = 'aqua';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    
    ctx.restore();
};


CanvasUtil.prototype.lazerAim = function() {
    var ctx = this.context,
            length;
    var fromX = this.game.bate.x + this.game.bate.width / 2,
            fromY = this.game.bate.y;
    var brick = this.game.bricks.getLowerBrick(fromX);

    var toY = (brick) ? brick.bottom : 0;
    length = fromY - toY;
    ctx.save();
    ctx.translate(fromX, fromY);
    ctx.strokeStyle= 'rgba(255, 0, 0, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.restore();
};

CanvasUtil.prototype.clear = function() {
    this.context.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
};

CanvasUtil.prototype.fillBlack = function() {
    this.context.fillStyle = '#00004A';
    this.context.fillRect(0, 0, this.fieldWidth, this.fieldHeight);
    this.drawSeparator();
};

CanvasUtil.prototype.fillMargin = function() {
    this.context.fillStyle = 'black';
    this.context.fillRect(this.fieldWidth, 0, this.canvas.width - this.fieldWidth, this.fieldHeight);

};


CanvasUtil.prototype.drawStatistics = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.fieldWidth + 20, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px  arial';
    ctx.fillText('Score: ', 0, 40, this.canvas.width - this.fieldWidth - 100);
    ctx.fillText('Level: ', 0, 120, this.canvas.width - this.fieldWidth - 100);
    ctx.fillText('Lives left: ', 0, 180, this.canvas.width - this.fieldWidth - 100);
    ctx.restore();
};

CanvasUtil.prototype.drawDescription = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.fieldWidth + 20, 260);
    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 30px arial';
    ctx.fillText('Powerups: ', 0, 0);

    ctx.fillStyle = 'white';

    var ext = new ExtendPrize(this.game);
    ext.placeAt(0, 40);
    this.drawPrize(ext);
    ctx.font = 'bold 15px arial';
    ctx.fillText(' - Extend', 40, 54);

    var glue = new GluePrize(this.game);
    glue.placeAt(0, 70);
    this.drawPrize(glue);
    ctx.fillText(' - Glue', 40, 84);

    var slow = new SlowPrize(this.game);
    slow.placeAt(0, 100);
    this.drawPrize(slow);
    ctx.fillText(' - Slow down', 40, 114);

    var dis = new DisruptionPrize(this.game);
    dis.placeAt(0, 130);
    this.drawPrize(dis);
    ctx.fillText(' - Disruption', 40, 144);

    var pl = new PlasmaGunPrize(this.game);
    pl.placeAt(0, 160);
    this.drawPrize(pl);
    ctx.fillText(' - Plasma gun', 40, 174);

    var life = new ExtraLifePrize(this.game);
    life.placeAt(0, 190);
    this.drawPrize(life);
    ctx.fillText(' - Extra life', 40, 204);

    ctx.font = 'bold 30px arial';
    ctx.fillText('Controls: ', 0, 264);
    ctx.font = 'bold 15px arial';
    ctx.fillText('fire/continue - <space>', 0, 290);
    ctx.fillText('move - <arrows>', 0, 320);

    ctx.restore();
};

CanvasUtil.prototype.updateStatistics = function(score, level) {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.fieldWidth, 0);
    ctx.clearRect(150, 0, this.canvas.width - this.fieldWidth - 150, 200);
    ctx.fillStyle = 'black';
    ctx.fillRect(150, 0, this.canvas.width - this.fieldWidth - 150, 200);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px  arial';
    ctx.fillText(score, 150, 40, this.canvas.width - this.fieldWidth - 200);
    ctx.fillText(level, 150, 120, this.canvas.width - this.fieldWidth - 200);
    ctx.restore();
};

CanvasUtil.prototype.updateLives = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.fieldWidth + 20, 200);
    ctx.clearRect(0, 0, this.canvas.width - this.fieldWidth - 20, 40);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas.width - this.fieldWidth - 20, 40);
    ctx.scale(0.5, 0.5);
    var bate = new Bate(this.game);

    for (var i = 0, offset = 0; i < this.game.lives; i++, offset += 15) {
        bate.placeAt(i * bate.width + offset, 0);
        this.drawBate(bate);
    }
    ctx.restore();
};


CanvasUtil.prototype.drawSeparator = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.fieldWidth + 2, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'silver';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.fieldHeight);
    ctx.stroke();
    ctx.restore();
};


CanvasUtil.prototype.message = function(message, x, y) {
    var ctx = this.context;
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'red';
    ctx.font = 'bold 40px arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, x, y, 500);
    ctx.strokeText(message, x, y, 500);
    ctx.restore();
};


