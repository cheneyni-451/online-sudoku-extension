/**
 *
 * @param {number} keyCode
 */
function keydown(keyCode) {
  window.dispatchEvent(new KeyboardEvent("keydown", { keyCode }));
}

export const Directions = Object.freeze({
  UP: Symbol("UP"),
  DOWN: Symbol("DOWN"),
  LEFT: Symbol("LEFT"),
  RIGHT: Symbol("RIGHT"),
});

/**
 *
 * @param {Directions} direction
 */
export function move(direction) {
  switch (direction) {
    case Directions.UP:
      keydown(38);
      break;
    case Directions.DOWN:
      keydown(40);
      break;
    case Directions.LEFT:
      keydown(37);
      break;
    case Directions.RIGHT:
      keydown(39);
      break;
    default:
      throw new Error("error");
  }
}

/**
 *
 * @param {number} digit single integer between [1,9]
 */
export function inputDigit(digit) {
  const num = parseInt(digit);
  if (!isNaN(num)) {
    if (1 <= num && num <= 9) {
      keydown(num + 48);
    }
  }
}
