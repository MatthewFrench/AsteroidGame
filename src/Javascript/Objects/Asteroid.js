import * as Vector from '../Utility/vector';

let GAME_WIDTH = 760;
let GAME_HEIGHT = 480;
let ASTEROID_DEFAULT_SIZE = 20;

export default class Asteroid {
  constructor() {
    this.color = 'black';
    //Made this pointing up which it needs to start by pointing right
    //Angle of 0 is facing right.
    //So I fix by rotating it right
    //Generate random polygon

    //Choose random position that isn't near the center of the screen
    let randomPosition = {x: Math.floor(Math.random()*GAME_WIDTH),
      y: Math.floor(Math.random()*GAME_HEIGHT)};
    //Push position out of the center if it's in center
    let centerPosition = {x: GAME_WIDTH/2, y: GAME_HEIGHT/2};
    this.position = Vector.pushVectorOutsideRadius(randomPosition, centerPosition, 100);
    //Choose random angle
    this.angle = Math.random()*Math.PI*2;
    //Choose random velocity
    this.velocity = Vector.create(Math.random()*1.5, Math.random()*Math.PI*2);


    this.scale = Math.random()*2.5 + 0.5;

    //Choose random angular velocity
    this.angularVelocity = (Math.random()*0.08 - 0.04) / this.scale;

    //Create random polygon that is similar to a circle
    this.polygon = [];
    let polygonSize = ASTEROID_DEFAULT_SIZE;
    let sizeVariance = 10;
    let maxCircleStepSize = Math.PI * 2 / (Math.random() * 25 + 6);
    for (let circleRotation = 0;
         circleRotation <= Math.PI * 2;
         circleRotation += Math.random() * maxCircleStepSize + maxCircleStepSize/10) {
      polygonSize += Math.random() * sizeVariance - sizeVariance/2;
      let newPoint = Vector.create(polygonSize, circleRotation);
      this.polygon.push(newPoint);
    }
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

  getPolygonBounds = () => {
    //Factor in rotation
    let bounds = {
      left: null,
      right: null,
      top: null,
      bottom: null
    };
    for (let point of this.polygon) {
      //Rotate point
      let rotatedPoint = Vector.rotate(point, this.angle);
      //Set point
      if (bounds.left === null) {
        bounds.left = rotatedPoint.x;
        bounds.right = rotatedPoint.x;
        bounds.top = rotatedPoint.y;
        bounds.bottom = rotatedPoint.y;
      } else {
        if (rotatedPoint.x < bounds.left) {
          bounds.left = rotatedPoint.x;
        } else if (rotatedPoint.x > bounds.right) {
          bounds.right = rotatedPoint.x;
        }
        if (rotatedPoint.y < bounds.top) {
          bounds.top = rotatedPoint.y;
        } else if (rotatedPoint.y > bounds.bottom) {
          bounds.bottom = rotatedPoint.y;
        }
      }
    }
    let lineWidth = 2 * this.scale;
    bounds.left = bounds.left * this.scale + this.position.x - lineWidth;
    bounds.right = bounds.right * this.scale + this.position.x + lineWidth;
    bounds.top = bounds.top * this.scale + this.position.y - lineWidth;
    bounds.bottom = bounds.bottom * this.scale + this.position.y + lineWidth;

    return bounds;
  };

  getPossibleWarpPositions = () => {
    let bounds = this.getPolygonBounds();
    let positions = [];
    positions.push(this.position);
    if (bounds.left < 0 && bounds.top < 0) {
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y + GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y+ GAME_HEIGHT});
    } else if (bounds.left < 0 && bounds.bottom > GAME_HEIGHT) {
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y - GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y - GAME_HEIGHT});
    } else if (bounds.right > GAME_WIDTH && bounds.top < 0) {
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y + GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y+ GAME_HEIGHT});
    } else if (bounds.right > GAME_WIDTH && bounds.bottom > GAME_HEIGHT) {
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y});
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y - GAME_HEIGHT});
      positions.push({x: this.position.x,y: this.position.y - GAME_HEIGHT});
    } else if (bounds.left < 0) {
      positions.push({x: this.position.x + GAME_WIDTH,y: this.position.y});
    } else if (bounds.right > GAME_WIDTH) {
      positions.push({x: this.position.x - GAME_WIDTH,y: this.position.y});
    } else if (bounds.top < 0) {
      positions.push({x: this.position.x,y: this.position.y + GAME_HEIGHT});
    } else if (bounds.bottom > GAME_HEIGHT) {
      positions.push({x: this.position.x,y: this.position.y - GAME_HEIGHT});
    }
    return positions;
  };

  render = (ctx) => {
    let positions = this.getPossibleWarpPositions();
    for (let position of positions) {
      ctx.save();
      ctx.fillStyle = 'white';
      //ctx.translate(-15, -15);
      ctx.translate(position.x, position.y);
      ctx.scale(this.scale, this.scale);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
      for (let point of this.polygon) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      //Draw circle
      //ctx.arc(0,0,15,0,2*Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
      //Draw hit bounds
      //let bounds = this.getPolygonBounds();
      //ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
      //ctx.fillText(this.angle.toFixed(2), 5, 15);
    }
  }
}