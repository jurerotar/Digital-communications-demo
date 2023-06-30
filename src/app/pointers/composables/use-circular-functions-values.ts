import {linearSpace} from "@helpers/math";

export const useCircularFunctionsValues = () => {
  const degrees = linearSpace(0, 2 * Math.PI, 360);
  const sineValues: number[] = degrees.map(Math.sin);
  const cosineValues: number[] = degrees.map(Math.cos);

  return {
    sineValues,
    cosineValues
  }
}