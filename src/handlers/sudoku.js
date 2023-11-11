import { Solver, Cell } from "../solver";
import { Directions, move, inputDigit } from "../keyboardEvent";
import { getRGB } from "../canvas";

export class HandleSudoku extends Solver {
  async parsePuzzle(callback) {
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

    if (callback) {
      callback(cells);
    } else {
      return cells;
    }
  }

  async submitSolution(solution) {
    for (let r = 0; r < 9; r++) {
      move(Directions.UP);
      move(Directions.LEFT);
    }

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

/**
 *
 * @param {ImageData} imageData
 * @returns identified digit and 0 for empty cell
 */
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
