/**
 * @module Vector
 * A library of vector functions.
 */
module.exports = exports = {
  add: add,
  subtract: subtract,
  scale: scale,
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize,
  getRotation: getRotation,
  addMagnitude: addMagnitude,
  create: create,
  addMagnitudeAtAngle: addMagnitudeAtAngle,
  limitMagnitude: limitMagnitude,
  clone: clone,
  distanceBetween: distanceBetween,
  pushVectorOutsideRadius: pushVectorOutsideRadius,
  addVectorToBounds: addVectorToBounds,
  getBoundCenter: getBoundCenter
};

/**
 * Adds a vector to bounds.
 * @param vector
 * @param bounds
 * @returns {{left: *, right: *, top: *, bottom: *}}
 */
function addVectorToBounds(vector, bounds) {
  return {left: bounds.left + vector.x,
          right: bounds.right + vector.x,
          top: bounds.top + vector.y,
          bottom: bounds.bottom + vector.y};
}

function getBoundCenter(bounds) {
  return {x: (bounds.left - bounds.right) / 2 + bounds.right,
          y: (bounds.top - bounds.bottom) / 2 + bounds.bottom};
}

/**
 * Pushes vector away from the repulse vector in radius.
 * @param vector
 * @param repulseVector
 * @param radius
 */
function pushVectorOutsideRadius(vector, repulseVector, radius) {
  if (distanceBetween(vector, repulseVector) >= radius) {
    return vector;
  }
  return {x: repulseVector.x + radius * (repulseVector.x - vector.x) / (Math.sqrt(Math.pow(repulseVector.x - vector.x,2) + Math.pow(repulseVector.y - vector.y,2))),
    y: repulseVector.y + radius * (repulseVector.y - vector.y) / (Math.sqrt(Math.pow(repulseVector.x - vector.x,2) + Math.pow(repulseVector.y - vector.y,2)))};
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clone(a) {
  return {x: a.x, y: a.y};
}

/**
 * @function rotate
 * Scales a vector
 * @param {Vector} a - the vector to scale
 * @param {float} scale - the scalar to multiply the vector by
 * @returns a new vector representing the scaled original
 */
function scale(a, scale) {
  return {x: a.x * scale, y: a.y * scale};
}

/**
 * @function add
 * Computes the sum of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed sum
 */
function add(a, b) {
  return {x: a.x + b.x, y: a.y + b.y};
}

/**
 * @function subtract
 * Computes the difference of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed difference
 */
function subtract(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

function getRotation(a) {
  return Math.atan2(a.y, a.x);
}

function create(length, angle) {
  return rotate({x: length, y: 0}, angle);
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function addMagnitude(a, addAmount) {
  let oldMagnitude = magnitude(a);
  let rotation = getRotation(a);
  let newMagnitude = oldMagnitude + addAmount;
  return create(newMagnitude, rotation);
}

function addMagnitudeAtAngle(a, addAmount, angle) {
  let newVector = create(addAmount, angle);
  return add(a, newVector);
}

function limitMagnitude(a, maxMagnitude) {
  let oldMagnitude = magnitude(a);
  if (oldMagnitude > maxMagnitude) {
    let rotation = getRotation(a);
    return create(maxMagnitude, rotation);
  } else {
    return a;
  }
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}