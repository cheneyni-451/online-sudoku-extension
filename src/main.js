import { sleep } from "./utils";
import { getHandler } from "./handlers/handler";

(async () => {
  await sleep(500);

  const handler = getHandler(window.location);
  if (handler === undefined) {
    throw new Error("invalid");
  }

  await handler.execPre();
  await handler.parsePuzzle((cells) =>
    handler.solvePuzzle(cells, handler.submitSolution)
  );
})();
