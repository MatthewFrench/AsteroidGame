import Ship from './Objects/Ship';
import Laser from './Objects/Laser';
import * as Vector from './Utility/vector';
import * as Collision from './Utility/Collision';
import Stopwatch from "./Utility/Stopwatch";
import Asteroid from "./Objects/Asteroid";

let SHIP_ROTATION_SPEED = 0.08;
let SHIP_MAX_SPEED = 2.0;
let SHIP_IMPULSE_SPEED = 0.04;
let LASER_SPEED = 4.0;
let LASER_SHOOT_DELAY_SECONDS = 0.5;
let GAME_WIDTH = 760;
let GAME_HEIGHT = 480;

export default class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.canvas.className = 'GameCanvas';
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.ship = new Ship();

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.downPressed = false;
    this.upPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.spacePressed = false;

    this.laserStopwatch = new Stopwatch();
    this.lasers = [];

    this.asteroids = [];
    //Create asteroids
    for (let index = 0; index < 2; index++) {
      let asteroid = new Asteroid();
      this.asteroids.push(asteroid);
    }

    requestAnimationFrame(this.loop);
  }

  onKeyDown = (e) => {
    if (e.keyCode === 38) {
      // up arrow
      this.upPressed = true;
    }
    else if (e.keyCode === 40) {
      // down arrow
      this.downPressed = true;
    }
    else if (e.keyCode === 37) {
      // left arrow
      this.leftPressed = true;
    }
    else if (e.keyCode === 39) {
      // right arrow
      this.rightPressed = true;
    } else if (e.keyCode === 32) {
      //Space
      this.spacePressed = true;
    }
  };

  onKeyUp = (e) => {
    if (e.keyCode === 38) {
      // up arrow
      this.upPressed = false;
    }
    else if (e.keyCode === 40) {
      // down arrow
      this.downPressed = false;
    }
    else if (e.keyCode === 37) {
      // left arrow
      this.leftPressed = false;
    }
    else if (e.keyCode === 39) {
      // right arrow
      this.rightPressed = false;
    } else if (e.keyCode === 32) {
      //Space
      this.spacePressed = false;
    }
  };

  runAsteroidCollision = () => {
    for (let asteroidIndex = 0; asteroidIndex < this.asteroids.length; asteroidIndex++) {
      let collision = false;
      let asteroid = this.asteroids[asteroidIndex];
      let allPolygons = asteroid.getWorldPolygons();

      for (let asteroidIndex2 = 0; asteroidIndex2 < this.asteroids.length; asteroidIndex2++) {
        let asteroid2 = this.asteroids[asteroidIndex2];
        if (asteroidIndex === asteroidIndex2) {
          continue;
        }
        for (let bounds1 of allPolygons) {
          let allPolygons2 = asteroid2.getWorldPolygons();
          for (let bounds2 of allPolygons2) {
            if (Collision.boundsIntersect(bounds1, bounds2)) {
              collision = true;
              this.context.save();
              this.context.fillStyle = 'white';
              //ctx.translate(-15, -15);
              this.context.beginPath();
              this.context.strokeStyle = 'blue';
              this.context.lineWidth = 3;
              this.context.moveTo(bounds1[0].x, bounds1[0].y);
              for (let point of bounds1) {
                this.context.lineTo(point.x, point.y);
              }
              this.context.closePath();
              this.context.moveTo(bounds2[0].x, bounds2[0].y);
              for (let point of bounds2) {
                this.context.lineTo(point.x, point.y);
              }
              this.context.closePath();
              //Draw circle
              //ctx.arc(0,0,15,0,2*Math.PI);
              this.context.stroke();
              this.context.fill();
              this.context.restore();
            }
          }
        }
      }

      if (collision) {
        asteroid.color = 'red';
      } else {
        asteroid.color = 'black';
      }
    }
  };

  update = () => {
    if (this.leftPressed) {
      this.ship.setAngularVelocity(-SHIP_ROTATION_SPEED);
    } else if (this.rightPressed) {
      this.ship.setAngularVelocity(SHIP_ROTATION_SPEED);
    } else {
      this.ship.setAngularVelocity(0);
    }
    let shipVelocity = this.ship.getVelocity();
    if (this.upPressed) {
      shipVelocity =
        Vector.addMagnitudeAtAngle(
          shipVelocity, SHIP_IMPULSE_SPEED, this.ship.getAngle());
      shipVelocity = Vector.limitMagnitude(shipVelocity, SHIP_MAX_SPEED);
    } else if (this.downPressed) {
      shipVelocity = Vector.scale(shipVelocity, 0.99);
    }
    this.ship.setVelocity(shipVelocity);

    this.ship.update();

    for (let asteroid of this.asteroids) {
      asteroid.update();
    }
    this.runAsteroidCollision();

    for (let laser of this.lasers) {
      laser.update();
    }

    //Fire lasers
    if (this.spacePressed) {
      if (this.laserStopwatch.getSeconds() >= LASER_SHOOT_DELAY_SECONDS) {
        this.laserStopwatch.reset();
        let newLaser = new Laser();
        //Put the laser at the front of the ship
        newLaser.setPosition(Vector.add(this.ship.position, Vector.create(20, this.ship.angle)));
        newLaser.setAngle(this.ship.angle);
        newLaser.setVelocity(
          Vector.addMagnitudeAtAngle(this.ship.getVelocity(), LASER_SPEED, this.ship.angle));
        this.lasers.push(newLaser);
      }
    }
  };

  render = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Render Asteroids
    for (let asteroid of this.asteroids) {
      asteroid.render(this.context);
    }

    //Render Lasers
    for (let laser of this.lasers) {
      laser.render(this.context);
    }

    this.ship.render(this.context);
  };

  loop = () => {
    this.render();
    this.update();
    requestAnimationFrame(this.loop);
  }
}
