import { FAIL, NULL_KEY, WRONG_KEY } from "./constants";

export const isWrongKey = (target: string) => WRONG_KEY === target
export const isNull = (target: string) => NULL_KEY === target
export const isFail = (target: string) => FAIL === target