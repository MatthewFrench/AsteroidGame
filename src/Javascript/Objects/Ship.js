import * as Vector from '../Utility/vector';

let GAME_WIDTH = 760;
let GAME_HEIGHT = 480;

export default class Ship {
  constructor() {
    this.position = {x: 760 / 2, y: 480 / 2};
    this.angle = -Math.PI/2;
    this.velocity = {x:0, y:0};
    this.angularVelocity = 0;
    this.color = 'black';
    this.polygon = [
      {x: 0, y:-15},
      {x: 5, y:-7},
      {x: 5, y:15},
      {x: -5, y:15},
      {x: -5, y:-7}
    ];
  }

  getPosition = () => {
    return {
      x: this.position.x,
      y: this.position.y
    };
  };

  setVelocity = (velocity) => {
    this.velocity.x = velocity.x;
    this.velocity.y = velocity.y;
  };

  getVelocity = () => {
    return {
      x: this.velocity.x,
      y: this.velocity.y
    };
  };

  setAngularVelocity = (angularVelocity) => {
    this.angularVelocity = angularVelocity;
  };

  getAngularVelocity = () => {
    return this.angularVelocity;
  };

  getAngle = () => {
    return this.angle;
  };

  setColor = (color) => {
    this.color = color;
  };

  update = () => {
    this.position = Vector.add(this.position, this.velocity);

    if (this.position.x < 0) {
      this.position.x += GAME_WIDTH;
    }
    if (this.position.x > GAME_WIDTH) {
      this.position.x -= GAME_WIDTH;
    }
    if (this.position.y < 0) {
      this.position.y += GAME_HEIGHT;
    }
    if (this.position.y > GAME_HEIGHT) {
      this.position.y -= GAME_HEIGHT;
    }
    this.angle += this.angularVelocity;
    if (this.angle < 0) {
      this.angle += 2 * Math.PI;
    }
    if (this.angle > 2 * Math.PI) {
      this.angle -= 2 * Math.PI;
    }
  };

  render = (ctx) => {
    let positions = [];
    positions.push(this.position);
    if (this.position.x < 40 && this.position.y < 40) {
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y + GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y+ GAME_HEIGHT});
    } else if (this.position.x < 40 && this.position.y > GAME_HEIGHT - 40) {
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y - GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y - GAME_HEIGHT});
    } else if (this.position.x > GAME_WIDTH - 40 && this.position.y < 40) {
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y + GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y+ GAME_HEIGHT});
    } else if (this.position.x > GAME_WIDTH - 40 && this.position.y > GAME_HEIGHT - 40) {
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y - GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y - GAME_HEIGHT});
    } else if (this.position.x < 40) {
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y});
    } else if (this.position.x > GAME_WIDTH - 40) {
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y});
    } else if (this.position.y < 40) {
      positions.push({x: this.position.x,y: this.position.y + GAME_HEIGHT});
    } else if (this.position.y > GAME_HEIGHT - 40) {
      positions.push({x: this.position.x,y: this.position.y - GAME_HEIGHT});
    }
    for (let position of positions) {
      ctx.save();
      ctx.fillStyle = 'white';
      //ctx.translate(-15, -15);
      ctx.translate(position.x, position.y);
      ctx.rotate(this.angle + Math.PI/2);
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
      for (let point of this.polygon) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      //ctx.arc(0,0,15,0,2*Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }
}