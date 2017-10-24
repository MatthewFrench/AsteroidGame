import Ship from './Objects/Ship';
import Laser from './Objects/Laser';
import * as Vector from './Utility/vector';
import * as Collision from './Utility/Collision';
import Stopwatch from "./Utility/Stopwatch";
import Asteroid from "./Objects/Asteroid";

let SHIP_ROTATION_SPEED = 0.08;
let SHIP_MAX_SPEED = 2.0;
let SHIP_IMPULSE_SPEED = 0.08;
let LASER_SPEED = 8.0;
let LASER_SHOOT_DELAY_SECONDS = 0.05;
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
    this.existingAsteroidCollision = [];
    //Create asteroids
    for (let index = 0; index < 10; index++) {
      let asteroid = new Asteroid();
      this.asteroids.push(asteroid);
    }

    this.score = 0;
    this.lives = 3;
    this.level = 1;

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

  /*
  runShipAsteroidCollision = () => {
      let shipBounds = ship.getWorldBounds();
      let laserPolygon = laser.getWorldPolygon();

      let destroyLaser = false;
      asteroidLoop:
        for (let asteroidIndex = 0; asteroidIndex < this.asteroids.length; asteroidIndex++) {
          let asteroid = this.asteroids[asteroidIndex];
          let allBoundsAndPolygons = asteroid.getWarpBoundsAndPolygons();

          for (let boundAndPolygon1 of allBoundsAndPolygons) {
            if (Collision.boundsIntersect(boundAndPolygon1.bounds, laserBounds)) {
              let polygon1 = boundAndPolygon1.polygon;
              for (let vector1Index = 0; vector1Index < polygon1.length; vector1Index++) {
                let vector1Start = polygon1[vector1Index];
                let vector1End;
                if (vector1Index === polygon1.length - 1) {
                  vector1End = polygon1[0];
                } else {
                  vector1End = polygon1[vector1Index + 1];
                }
                for (let vector2Index = 0; vector2Index < laserPolygon.length; vector2Index++) {
                  let vector2Start = laserPolygon[vector2Index];
                  let vector2End;
                  if (vector2Index === laserPolygon.length - 1) {
                    vector2End = laserPolygon[0];
                  } else {
                    vector2End = laserPolygon[vector2Index + 1];
                  }
                  let collisionPoint = Collision.getLineIntersection(vector1Start, vector1End, vector2Start, vector2End);
                  if (collisionPoint !== null) {
                    destroyLaser = true;
                    //Destroy asteroid
                    this.asteroids.splice(asteroidIndex, 1);
                    //Remove recorded asteroid collisions
                    this.existingAsteroidCollision =
                      this.existingAsteroidCollision.filter(function(a){
                        return a[0] !== asteroid && a[1] !== asteroid;
                      });
                    //Create 2 new asteroids
                    if (asteroid.scale > 1.0) {
                      let a1 = new Asteroid();
                      a1.scale = asteroid.scale/2;
                      a1.position = Vector.clone(asteroid.position);
                      this.asteroids.push(a1);
                      let a2 = new Asteroid();
                      a2.scale = asteroid.scale/2;
                      a2.position = Vector.clone(asteroid.position);
                      this.asteroids.push(a2);
                    }
                    this.score++;
                    break asteroidLoop;
                  }
                }
              }
            }
          }
        }
      if (laser.position.x < -50 || laser.position.x > GAME_WIDTH + 50 ||
        laser.position.y < -50 || laser.position.y > GAME_HEIGHT + 50) {
        destroyLaser = true;
      }
      if (destroyLaser) {
        this.lasers.splice(laserIndex, 1);
        laserIndex--;
      }
  };*/

  runLaserAsteroidCollision = () => {
    for (let laserIndex = 0; laserIndex < this.lasers.length; laserIndex++) {
      let laser = this.lasers[laserIndex];
      let laserBounds = laser.getWorldBounds();
      let laserPolygon = laser.getWorldPolygon();

      let destroyLaser = false;
      asteroidLoop:
      for (let asteroidIndex = 0; asteroidIndex < this.asteroids.length; asteroidIndex++) {
        let asteroid = this.asteroids[asteroidIndex];
        let allBoundsAndPolygons = asteroid.getWarpBoundsAndPolygons();

        for (let boundAndPolygon1 of allBoundsAndPolygons) {
          if (Collision.boundsIntersect(boundAndPolygon1.bounds, laserBounds)) {
            let polygon1 = boundAndPolygon1.polygon;
            for (let vector1Index = 0; vector1Index < polygon1.length; vector1Index++) {
              let vector1Start = polygon1[vector1Index];
              let vector1End;
              if (vector1Index === polygon1.length - 1) {
                vector1End = polygon1[0];
              } else {
                vector1End = polygon1[vector1Index + 1];
              }
              for (let vector2Index = 0; vector2Index < laserPolygon.length; vector2Index++) {
                let vector2Start = laserPolygon[vector2Index];
                let vector2End;
                if (vector2Index === laserPolygon.length - 1) {
                  vector2End = laserPolygon[0];
                } else {
                  vector2End = laserPolygon[vector2Index + 1];
                }
                let collisionPoint = Collision.getLineIntersection(vector1Start, vector1End, vector2Start, vector2End);
                if (collisionPoint !== null) {
                  destroyLaser = true;
                  //Destroy asteroid
                  this.asteroids.splice(asteroidIndex, 1);
                  //Remove recorded asteroid collisions
                  this.existingAsteroidCollision =
                    this.existingAsteroidCollision.filter(function(a){
                    return a[0] !== asteroid && a[1] !== asteroid;
                  });
                  //Create 2 new asteroids
                  if (asteroid.scale > 1.0) {
                    let a1 = new Asteroid();
                    a1.scale = asteroid.scale/2;
                    a1.position = Vector.clone(asteroid.position);
                    this.asteroids.push(a1);
                    let a2 = new Asteroid();
                    a2.scale = asteroid.scale/2;
                    a2.position = Vector.clone(asteroid.position);
                    this.asteroids.push(a2);
                  }
                  this.score++;
                  break asteroidLoop;
                }
              }
            }
          }
        }
      }
      if (laser.position.x < -50 || laser.position.x > GAME_WIDTH + 50 ||
        laser.position.y < -50 || laser.position.y > GAME_HEIGHT + 50) {
        destroyLaser = true;
      }
      if (destroyLaser) {
        this.lasers.splice(laserIndex, 1);
        laserIndex--;
      }
    }
  };

  runAsteroidCollision = () => {
    for (let asteroidIndex = 0; asteroidIndex < this.asteroids.length; asteroidIndex++) {
      let collision = false;
      let asteroid = this.asteroids[asteroidIndex];
      let allBoundsAndPolygons = asteroid.getWarpBoundsAndPolygons();

      for (let asteroidIndex2 = asteroidIndex + 1; asteroidIndex2 < this.asteroids.length; asteroidIndex2++) {
        let asteroid2 = this.asteroids[asteroidIndex2];
        let collisionPoints = [];
        /*
        Collision Point contains:
            point - Intersection point
            asteroid1Center - Center of the asteroid
            asteroid2Center - Center of the second asteroid
         */
        for (let boundAndPolygon1 of allBoundsAndPolygons) {
          let allBoundsAndPolygons2 = asteroid2.getWarpBoundsAndPolygons();
          for (let boundAndPolygon2 of allBoundsAndPolygons2) {
            if (Collision.boundsIntersect(boundAndPolygon1.bounds, boundAndPolygon2.bounds)) {
              let polygon1 = boundAndPolygon1.polygon;
              let polygon2 = boundAndPolygon2.polygon;

              for (let vector1Index = 0; vector1Index < polygon1.length; vector1Index++) {
                let vector1Start = polygon1[vector1Index];
                let vector1End;
                if (vector1Index === polygon1.length - 1) {
                  vector1End = polygon1[0];
                } else {
                  vector1End = polygon1[vector1Index + 1];
                }
                for (let vector2Index = 0; vector2Index < polygon2.length; vector2Index++) {
                  let vector2Start = polygon2[vector2Index];
                  let vector2End;
                  if (vector2Index === polygon2.length - 1) {
                    vector2End = polygon2[0];
                  } else {
                    vector2End = polygon2[vector2Index + 1];
                  }
                  let collisionPoint = Collision.getLineIntersection(vector1Start, vector1End, vector2Start, vector2End);
                  if (collisionPoint !== null) {
                    collisionPoints.push({
                      point: collisionPoint,
                      asteroid1Center: Vector.getBoundCenter(boundAndPolygon1.bounds),
                      asteroid2Center: Vector.getBoundCenter(boundAndPolygon2.bounds)
                    });
                  }
                }
              }
            }
          }
        }
        //Compute the collision
        let collisionAlreadyExists = this.existingAsteroidCollision.find(
          (a)=>{return ((a[0] === asteroid && a[1] === asteroid2) || (a[0] === asteroid2 && a[1] === asteroid)) }) !== undefined;
        if (collisionPoints.length > 0 && !collisionAlreadyExists) {
          collision = true;

          let normal1 = {x: 0, y: 0};
          let normal2 = {x: 0, y: 0};

          for (let collision of collisionPoints) {
            let point = collision.point;
            let asteroid1Center = collision.asteroid1Center;
            let asteroid2Center = collision.asteroid2Center;

            let collisionNormal1 = Vector.normalize(Vector.subtract(point, asteroid1Center));
            let collisionNormal2 = Vector.normalize(Vector.subtract(asteroid2Center, point));

            normal1 = Vector.add(collisionNormal1, normal1);
            normal2 = Vector.add(collisionNormal2, normal2);
          }
          normal1 = Vector.normalize(normal1);
          normal2 = Vector.normalize(normal2);
          let asteroid1Mass = asteroid.getScale();
          let asteroid2Mass = asteroid2.getScale();

          let newVelX1 = normal1.x * (asteroid.velocity.x * (asteroid1Mass - asteroid2Mass) + (2 * asteroid2Mass * asteroid2.velocity.x)) / (asteroid1Mass + asteroid2Mass);
          let newVelY1 = normal1.y * (asteroid.velocity.y * (asteroid1Mass - asteroid2Mass) + (2 * asteroid2Mass * asteroid2.velocity.y)) / (asteroid1Mass + asteroid2Mass);
          let newVelX2 = normal2.x * (asteroid2.velocity.x * (asteroid2Mass - asteroid1Mass) + (2 * asteroid1Mass * asteroid.velocity.x)) / (asteroid1Mass + asteroid2Mass);
          let newVelY2 = normal2.y * (asteroid2.velocity.y * (asteroid2Mass - asteroid1Mass) + (2 * asteroid1Mass * asteroid.velocity.y)) / (asteroid1Mass + asteroid2Mass);

          asteroid.velocity.x *= -1;
          asteroid.velocity.y *= -1;
          asteroid2.velocity.x *= -1;
          asteroid2.velocity.y *= -1;
          this.existingAsteroidCollision.push([asteroid, asteroid2]);
          //asteroid.velocity = normal1;
          //asteroid2.velocity = normal2;

          let audio = new Audio('/AsteroidHit.wav');
          audio.play();
        } else if (collisionPoints.length === 0 && collisionAlreadyExists) {
          //Remove existing collision
          this.existingAsteroidCollision = this.existingAsteroidCollision.filter((a)=>{return !((a[0] === asteroid && a[1] === asteroid2) || (a[0] === asteroid2 && a[1] === asteroid)) });
        }
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

    this.runLaserAsteroidCollision();

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

        let audio = new Audio('/LaserShot.wav');
        audio.play();
      }
    }

    //If all asteroids are gone, new level
    if (this.asteroids.length === 0) {
      this.level++;
      this.ship = new Ship();

      //Create asteroids
      for (let index = 0; index < 10; index++) {
        let asteroid = new Asteroid();
        this.asteroids.push(asteroid);
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

    this.context.font = '15px Helvetica';
    this.context.fillText('Level: ' + this.level, 5, 15);
    this.context.fillText('Score: ' + this.score, 5, 35);
    this.context.fillText('Lives: ' + this.lives, 5, 55);
  };

  loop = () => {
    this.render();
    this.update();
    requestAnimationFrame(this.loop);
  }
}
