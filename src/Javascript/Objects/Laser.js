import * as Vector from '../Utility/vector';

let GAME_WIDTH = 760;
let GAME_HEIGHT = 480;

export default class Laser {
  constructor() {
    this.position = {x: 760 / 2, y: 480 / 2};
    this.angle = -Math.PI/2;
    this.velocity = {x:0, y:0};
    this.angularVelocity = 0;
    this.color = 'black';
    this.scale = 1.0;
    //Made this pointing up which it needs to start by pointing right
    //Angle of 0 is facing right.
    //So I fix by rotating it right
    this.polygon = [
      Vector.rotate({x: -1, y:-10}, Math.PI/2),
      Vector.rotate({x: 1, y:-10}, Math.PI/2),
      Vector.rotate({x: 1, y:10}, Math.PI/2),
      Vector.rotate({x: -1, y:10}, Math.PI/2)
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


  /**
   * Returns the bounds of the original polygon.
   * @returns {Array}
   */
  getBounds = () => {
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
    let lineWidth = 2;
    bounds.left = (bounds.left - lineWidth) * this.scale;
    bounds.right = (bounds.right + lineWidth) * this.scale;
    bounds.top = (bounds.top - lineWidth) * this.scale;
    bounds.bottom = (bounds.bottom + lineWidth) * this.scale;
    return bounds;
  };

  /**
   * Returns the bounds at the world position.
   */
  getWorldBounds = () => {
    return Vector.addVectorToBounds(this.position, this.getBounds());
  };

  /**
   * Returns the polygon rotated and scaled.
   * @returns {Array}
   */
  getPolygon = () => {
    let transformedPolygon = [];
    for (let point of this.polygon) {
      let transformedPoint = Vector.rotate(point, this.angle);
      transformedPoint = Vector.scale(transformedPoint, this.scale);
      transformedPolygon.push(transformedPoint);
    }
    return transformedPolygon;
  };

  /**
   * Returns the polygon in world position.
   * @returns {Array}
   */
  getWorldPolygon = () => {
    let polygon = this.getPolygon();
    let transformedPolygon = [];
    for (let point of polygon) {
      transformedPolygon.push(Vector.add(point, this.position));
    }
    return transformedPolygon;
  };

  render = (ctx) => {
      ctx.save();
      //ctx.translate(-15, -15);
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.angle);
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