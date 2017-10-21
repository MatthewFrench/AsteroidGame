import Ship from './Objects/Ship';
import * as Vector from './Utility/vector';

let SHIP_ROTATION_SPEED = 0.08;
let SHIP_MAX_SPEED = 2.0;
let SHIP_IMPULSE_SPEED = 0.04;
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
  };

  render = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Render Asteroids

    //Render Lasers

    this.ship.render(this.context);
  };

  loop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  }
}
