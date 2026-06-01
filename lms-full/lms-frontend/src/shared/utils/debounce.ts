/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce } from "@tanstack/pacer";

export const createDebounce = <T extends (...args: any[]) => any>(fn: T, wait = 500) => {
  return debounce(fn, {
    wait,
  });
};
