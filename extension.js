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

function drawCrosshair(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(ctx.canvas.width, y);
  ctx.moveTo(x, 0);
  ctx.lineTo(x, ctx.canvas.height);
  ctx.stroke();
}

class Cell {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }
}

/**
 *
 * @param {Cell[]} cells
 * @param {Cell} cell
 * @returns {boolean}
 */
function isValidPlacement(cells, cell) {
  const { row, col } = cell;
  if (cell.value === 0) {
    return false;
  }

  let bitSet = new Uint8Array(9);

  // check row
  for (const curCell of cells.slice(row * 9, (row + 1) * 9)) {
    if (curCell.value === 0) {
      continue;
    }

    if (++bitSet[curCell.value - 1] > 1) {
      return false;
    }
  }

  bitSet = new Uint8Array(9);
  // check col
  for (let r = 0; r < 9; r++) {
    const curIndex = r * 9 + col;
    const curCell = cells[curIndex];
    if (curCell.value === 0) {
      continue;
    }

    if (++bitSet[curCell.value - 1] > 1) {
      return false;
    }
  }

  bitSet = new Uint8Array(9);
  // check box
  const boxStartRow = row - (row % 3);
  const boxStartCol = col - (col % 3);
  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      const curCell = cells[r * 9 + c];
      if (curCell.value === 0) {
        continue;
      }

      if (++bitSet[curCell.value - 1] > 1) {
        return false;
      }
    }
  }
  return true;
}

function solve(cells) {
  const emptyCells = cells.filter((cell) => cell.value === 0);
  if (emptyCells.length > 0) {
    solveHelper(0, cells, emptyCells);
  }
  return emptyCells;
}

function solveHelper(index, cells, emptyCells) {
  const lastCell = emptyCells[emptyCells.length - 1];
  if (!isValidPlacement(cells, lastCell)) {
    for (let i = 1; i <= 9; i++) {
      const curCell = emptyCells[index];
      curCell.value = i;

      if (isValidPlacement(cells, curCell)) {
        solveHelper(index + 1, cells, emptyCells);

        const lastCell = emptyCells[emptyCells.length - 1];
        if (isValidPlacement(cells, lastCell)) {
          break;
        }
      }
      curCell.value = 0;
    }
  }
}

function printGrid(cells) {
  console.debug(
    cells.reduce((prev, cur, curIdx) => {
      if (curIdx !== 0 && curIdx % 9 === 0) {
        return `${prev}\n${cur.value === 0 ? " " : cur}`;
      }
      return `${prev} ${cur.value === 0 ? " " : cur}`;
    })
  );
}

const Directions = Object.freeze({
  UP: Symbol("UP"),
  DOWN: Symbol("DOWN"),
  LEFT: Symbol("LEFT"),
  RIGHT: Symbol("RIGHT"),
});

function keydown(keyCode) {
  window.dispatchEvent(new KeyboardEvent("keydown", { keyCode }));
}

function move(direction) {
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

function inputDigit(digit) {
  if (1 <= digit && digit <= 9) {
    keydown(digit + 48);
  }
}

async function submitSolution(solution) {
  let curRow = 0;
  let curCol = 0;
  for (const cell of solution) {
    const { row, col, value } = cell;
    while (curRow < row) {
      move(Directions.DOWN);
      curRow++;
    }
    while (curRow > row) {
      move(Directions.UP);
      curRow--;
    }
    while (curCol < col) {
      move(Directions.RIGHT);
      curCol++;
    }
    while (curCol > col) {
      move(Directions.LEFT);
      curCol--;
    }
    inputDigit(value);
  }
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
  const numberCounts = new Map();
  const cells = new Array(81);

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
      cells[row * 9 + col] = new Cell(row, col, cellValue);
      numberCounts.set(cellValue, (numberCounts.get(cellValue) ?? 0) + 1);
    }
  }
  const emptyCells = solve(cells);

  console.debug(numberCounts);
  console.debug(emptyCells);

  move(Directions.LEFT); // refocus on board
  await submitSolution(emptyCells);
})();
