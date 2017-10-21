import Ship from './Objects/Ship';
import * as Vector from './Utility/vector';

let SHIP_ROTATION_SPEED = 0.08;

export default class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 760;
    this.canvas.height = 480;
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
    if (e.keyCode === '38') {
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
