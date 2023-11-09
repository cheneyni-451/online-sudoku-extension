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
