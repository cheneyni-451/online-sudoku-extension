import { sleep } from "./utils";
import { getHandler } from "./handlers/handler";

(async () => {
  await sleep(500);

  const handler = getHandler(window.location);
  if (handler === undefined) {
    throw new Error("invalid");
  }
  const cells = await handler.parsePuzzle();
  const solution = handler.solvePuzzle(cells);
  await handler.submitSolution(solution);
})();
