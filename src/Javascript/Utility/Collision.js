/**
 * @module Collision
 * A library of collision functions.
 */
module.exports = exports = {
  boundsIntersect: boundsIntersect
};

function boundsIntersect(bounds1, bounds2) {
  //Return false if the rectangles are too far to the left or right
  if (bounds1.left > bounds2.right || bounds2.left > bounds1.right) {
    return false;
  }
  //Return false if the rectangles are too far above or below
  if (bounds1.top > bounds2.bottom || bounds2.top > bounds1.bottom) {
    return false;
  }
  //Rectangles must be overlapping
  return true;
}