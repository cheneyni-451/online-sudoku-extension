import { HandleSudoku } from "./sudoku";
import { HandleSudoku9x9 } from "./sudoku9x9";

/**
 *
 * @param {Location} location
 */
export function getHandler(location) {
  const { hostname } = location;
  switch (hostname) {
    case "sudoku.com":
      return new HandleSudoku();
    case "sudoku9x9.com":
      return new HandleSudoku9x9();
    default:
      return undefined;
  }
}
