import { Cell, Solver } from "../solver";
import { sleep } from "../utils";

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
  async execPre() {
    if (window.location.pathname.includes("sudoku-solved")) {
      window.location.href = document.referrer;
    }
  }

  async parsePuzzle(callback = this.solvePuzzle) {
    const parse = () => {
      const cells = Array(81);
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const index = row * 9 + col;
          const valueStr = document.getElementById(`td${index}`).innerText;
          const value = parseInt(valueStr);

          cells[index] = new Cell(row, col, isNaN(value) ? 0 : value);
        }
      }

      const startButton = document.getElementById("myStartButton");
      if (startButton !== null) {
        startButton.remove();
      }

      if (callback) {
        callback(cells);
      } else {
        return cells;
      }
    };

    if (window.location.pathname.includes("livesudoku.php")) {
      const startButton = document.createElement("button");
      startButton.innerText = "Start";
      startButton.style.position = "sticky";
      startButton.style.bottom = "0";
      startButton.id = "myStartButton";
      startButton.onclick = parse;
      document.body.appendChild(startButton);
    } else {
      return parse();
    }
  }

  async submitSolution(solution) {
    for (const cell of solution) {
      const { row, col, value } = cell;
      selectCell(row, col);
      inputValue(value);
    }
  }
}
