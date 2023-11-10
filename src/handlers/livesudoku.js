import { Cell, Solver } from "../solver";

function selectCell(row, col) {
  document
    .getElementById(`td${row * 9 + col}`)
    .dispatchEvent(new MouseEvent("mousedown"));
}

function inputValue(value) {
  document.body.dispatchEvent(
    new KeyboardEvent("keydown", { keyCode: value + 48 })
  );
}

export class HandleLiveSudoku extends Solver {
  async parsePuzzle() {
    const cells = Array(81);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const index = row * 9 + col;
        const valueStr = document.getElementById(`td${index}`).innerText;
        const value = parseInt(valueStr);

        cells[index] = new Cell(row, col, isNaN(value) ? 0 : value);
      }
    }

    return cells;
  }

  async submitSolution(solution) {
    for (const cell of solution) {
      const { row, col, value } = cell;
      selectCell(row, col);
      inputValue(value);
    }
  }
}
