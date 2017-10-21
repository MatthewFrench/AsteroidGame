import * as Vector from '../Utility/vector';

export default class Ship {
  constructor() {
    this.position = {x: 760 / 2, y: 480 / 2};
    this.angle = 0;
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

  setColor = (color) => {
    this.color = color;
  };

  update = () => {
    this.position = Vector.add(this.position, this.velocity);

    if (this.position.x < 15 || this.position.x > 760 - 15) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 15 || this.position.y > 360 - 15) {
      this.velocity.y *= -1;
    }
    this.angle += this.angularVelocity;
  };

  render = (ctx) => {
    ctx.save();
    //ctx.translate(-15, -15);
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
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
    ctx.restore();
  }
}