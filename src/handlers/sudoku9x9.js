import { Cell, Solver } from "../solver";
import { sleep } from "../utils";

function getStartButton() {
  return document.getElementById("fbtn");
}

function getCheckButton() {
  return document.getElementById("bdone");
}

function dailyChallengeValueShift(value, index) {
  return ((value - 1 - index + 89) % 9) + 1;
}

export class HandleSudoku9x9 extends Solver {
  async parsePuzzle(callback) {
    const isDailyChallenge = window.location.pathname === "/dailychallenge.php";

    const cells = Array(81);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const index = row * 9 + col;
        const valueStr = document.getElementById(`c${index}`).value;
        const value = parseInt(valueStr);

        cells[index] = new Cell(
          row,
          col,
          isNaN(value)
            ? 0
            : isDailyChallenge
            ? dailyChallengeValueShift(value, index)
            : value
        );
      }
    }

    if (callback) {
      callback(cells);
    } else {
      return cells;
    }
  }

  async submitSolution(solution) {
    // Daily challenge has start button to hide puzzle
    let delayBetweenInputs = 0;
    const startButton = getStartButton();
    if (startButton !== null) {
      startButton.click();

      // get second place
      const firstPlaceTD = document.getElementsByTagName("td")[4];
      let [minutes, seconds] = [4, 0];
      if (firstPlaceTD !== undefined) {
        const firstPlaceTime = firstPlaceTD.textContent;
        [minutes, seconds] = firstPlaceTime.split(":").map((s) => parseInt(s));
      }
      delayBetweenInputs = Math.floor(
        (1000 * (60 * minutes + seconds)) / solution.length
      );
    }

    for (const cell of solution) {
      const { row, col, value } = cell;
      document.getElementById(`c${row * 9 + col}`).value = value;
      if (delayBetweenInputs > 0) {
        await sleep(delayBetweenInputs);
      }
    }
    if (delayBetweenInputs > 0) {
      await sleep(1000);
    }

    getCheckButton().click();
  }
}
