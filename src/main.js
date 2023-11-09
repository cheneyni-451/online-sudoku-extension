import { Directions, move, inputDigit } from "./keyboardEvent";
import {
  getCanvas,
  getPlayPauseButton,
  getPauseOverlay,
  identifyNumber,
} from "./canvas";
import { sleep } from "./utils";

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
  await sleep(500);
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
