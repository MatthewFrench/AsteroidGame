/**
 * @module Collision
 * A library of collision functions.
 */
module.exports = exports = {
  boundsIntersect: boundsIntersect,
  getLineIntersection: getLineIntersection
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

function getLineIntersection(line1Start, line1End, line2Start, line2End) {
  let line2YLength = line2End.y - line2Start.y;
  let line2XLength = line2End.x - line2Start.x;
  let line1XLength = line1End.x - line1Start.x;
  let line1YLength = line1End.y - line1Start.y;
  let denominator = (line2YLength * line1XLength) - (line2XLength * line1YLength);
  if (denominator === 0) {
    return null;
  }
  let startYDiff = line1Start.y - line2Start.y;
  let startXDiff = line1Start.x - line2Start.x;
  let numerator1 = (line2XLength * startYDiff) - (line2YLength * startXDiff);
  let numerator2 = (line1XLength * startYDiff) - (line1YLength * startXDiff);
  let onSegment1 = numerator1 / denominator;
  let onSegment2 = numerator2 / denominator;

  let resultX = line1Start.x + (startYDiff * line1XLength);
  let resultY = line1Start.y + (startYDiff * line1YLength);
  if (onSegment1 > 0 && onSegment1 < 1 && onSegment2 > 0 && onSegment2 < 1) {
    return {x: resultX, y: resultY};
  }
  return null;
}