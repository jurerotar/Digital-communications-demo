export type UnitBoxReturnValues = 0 | 1;

declare global {
  interface Math {
    unitBox: (n: number, limits: number[]) => UnitBoxReturnValues;
  }
}

// Returns 1 if n is between limit values or 0 if it's not
Math.unitBox = function(n: number, limits = [-1, 1]): UnitBoxReturnValues {
  const [lowerLimit, upperLimit] = limits;
  // Number() trick isn't used here to get more precise Typescript hinting
  return n >= lowerLimit && n <= upperLimit ? 1 : 0;
}

export {};