export default class Stopwatch {
  constructor() {
    this.reset();
  }

  reset = () => {
    this.time = performance.now();
  };

  getSeconds = () => {
    return this.getMilliseconds() / 1000.0;
  };

  getMilliseconds = () => {
    return performance.now() - this.time;
  };
}