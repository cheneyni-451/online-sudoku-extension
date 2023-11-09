/**
 *
 * @param {any} x
 * @returns x
 */
export function trace(x) {
  console.log(x);
  return x;
}

/**
 *
 * @param {number} milliseconds time to sleep in milliseconds
 * @returns
 */
export async function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
