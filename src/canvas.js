export function getCanvas() {
  return document.getElementById("game").firstChild;
}

export function getPlayPauseButton() {
  return document.getElementById("timer-wrapper");
}

export function getPauseOverlay() {
  return document.getElementById("pause-overlay");
}

/**
 *
 * @param {ImageData} image
 * @param {number} x
 * @param {number} y
 * @returns
 */
export function getPixel(image, x, y) {
  const index = (y * image.width + x) * 4;
  return image.data.subarray(index, index + 4);
}

/**
 *
 * @param {ImageData} image
 * @param {number} x
 * @param {number} y
 * @returns
 */
export function getRGB(image, x, y) {
  return getPixel(image, x, y).slice(0, 3);
}

/**
 *
 * @param {ImageData} imageData
 * @returns identified digit and 0 for empty cell
 */
export function identifyNumber(imageData) {
  // 128 is magic number used to differentiate between dark and light
  const isDark = (chan) => chan < 128;
  if (getRGB(imageData, 800, 680).every(isDark)) {
    return 1;
  }
  if (getRGB(imageData, 700, 540).every(isDark)) {
    return 7;
  }
  if (getRGB(imageData, 700, 1430).every(isDark)) {
    return 2;
  }
  if (
    getRGB(imageData, 1310, 1190).every(isDark) &&
    getRGB(imageData, 850, 1190).every(isDark)
  ) {
    return 4;
  }
  if (getRGB(imageData, 980, 1080).every(isDark)) {
    return 9;
  }
  if (getRGB(imageData, 660, 1050).every(isDark)) {
    return 6;
  }
  // order of conditions below matters
  // these three must be checked last
  if (getRGB(imageData, 770, 1040).every(isDark)) {
    return 8;
  }
  if (getRGB(imageData, 700, 1000).every(isDark)) {
    return 5;
  }
  if (getRGB(imageData, 880, 950).every(isDark)) {
    return 3;
  }
  return 0;
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 */
export function drawCrosshair(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(ctx.canvas.width, y);
  ctx.moveTo(x, 0);
  ctx.lineTo(x, ctx.canvas.height);
  ctx.stroke();
}
