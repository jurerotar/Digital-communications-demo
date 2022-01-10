export type UnitBoxReturnValues = 0 | 1;

declare global {
  interface Math {
    unitBox: (n: number) => UnitBoxReturnValues;
  }
}

// Returns 1 if n is between [-0.5, 0.5] or 0 if not
Math.unitBox = function(n: number): UnitBoxReturnValues {
  return this.abs(n) <= 1 / 2 ? 1 : 0;
}

export {};