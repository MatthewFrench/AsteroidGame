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
      {x: -1, y:-10},
      {x: 1, y:-10},
      {x: 1, y:10},
      {x: -1, y:10}
    ];
    this.needsRemoved = false;
  }

  getPosition = () => {
    return {
      x: this.position.x,
      y: this.position.y
    };
  };

  setAngle = (angle) => {
    this.angle = angle;
  };

  setPosition = (newPosition) => {
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
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

  getNeedsRemoved = () => {
    return this.needsRemoved;
  };

  update = () => {
    this.position = Vector.add(this.position, this.velocity);

    if (this.position.x < -50) {
      this.needsRemoved = true;
    }
    if (this.position.x > GAME_WIDTH +50) {
      this.needsRemoved = true;
    }
    if (this.position.y < -50) {
      this.needsRemoved = true;
    }
    if (this.position.y > GAME_HEIGHT + 50) {
      this.needsRemoved = true;
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
      ctx.save();
      //ctx.translate(-15, -15);
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.angle + Math.PI/2);
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
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