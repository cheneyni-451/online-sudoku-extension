async function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getCanvas() {
  return document.getElementById("game").firstChild;
}

function getPlayPauseButton() {
  return document.getElementById("timer-wrapper");
}

function getPauseOverlay() {
  return document.getElementById("pause-overlay");
}

function getIndex(imageWidth, x, y) {
  return (y * imageWidth + x) * 4;
}

function getPixel(image, x, y) {
  const index = getIndex(image.width, x, y);
  return image.data.subarray(index, index + 4);
}

function getRGB(image, x, y) {
  return getPixel(image, x, y).slice(0, 3);
}

function trace(x) {
  console.debug(x);
  return x;
}

function identifyNumber(imageData) {
  const isDark = (chan) => chan < 128;
  if (
    // 128 is magic number used to differentiate between dark and light
    getRGB(imageData, 800, 680).every(isDark)
  ) {
    return 1;
  }
  if (getRGB(imageData, 700, 540).every(isDark)) {
    return 7;
  }
  return 0;
}

function drawCrosshair(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(ctx.canvas.width, y);
  ctx.moveTo(x, 0);
  ctx.lineTo(x, ctx.canvas.height);
  ctx.stroke();
}

(async () => {
  await sleep(1000);
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  const BORDER_OFFSET = 8;
  const LINE_OFFSET = 2;
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

  getPlayPauseButton().click();
  getPauseOverlay().style.display = "none";

  const CELL_SIZE = 219;
  let numCount = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const ibm = await window.createImageBitmap(
        image,
        BORDER_OFFSET +
          (Math.trunc(col / 3) * 2 + (col % 3)) * LINE_OFFSET +
          col * CELL_SIZE,
        BORDER_OFFSET +
          (Math.trunc(row / 3) * 2 + (row % 3)) * LINE_OFFSET +
          row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
        {
          resizeWidth: canvas.width,
          resizeHeight: canvas.height,
        }
      );

      ctx.drawImage(ibm, 0, 0);
      const newImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const cellValue = identifyNumber(newImage);
      if (cellValue === 7) {
        numCount++;
      }
      // await sleep(1000);
    }
  }
  console.debug(`# of 7s: ${numCount}`);
  drawCrosshair(ctx, 700, 540);
})();
