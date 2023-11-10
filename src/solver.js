export class Solver {
  solvePuzzle(cell, callback) {
    const solution = solve(cell);
    if (callback) {
      callback(solution);
    } else {
      return solution;
    }
  }
}

export class Cell {
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

/**
 *
 * @param {Cell[]} cells
 * @returns array of `Cell` that represent the solution
 */
function solve(cells) {
  const emptyCells = cells.filter((cell) => cell.value === 0);
  if (emptyCells.length > 0) {
    solveHelper(0, cells, emptyCells);
  }
  return emptyCells;
}
