import p5 from "p5";

export const binaryValues = (pool: number[], changeOn: number): () => number => {
  let counter = 0;
  let currentlyReturnsAtIndex = 0;
  const poolLength: number = pool.length;
  return (): number => {
    counter ++;
    if(counter >= changeOn) {
      counter = 0;
      currentlyReturnsAtIndex = (currentlyReturnsAtIndex === poolLength - 1) ? 0 : currentlyReturnsAtIndex + 1;
    }
    return pool[currentlyReturnsAtIndex];
  }
}

export const linearSpace = (startValue: number, stopValue: number, cardinality: number): number[] => {
  const arr: number[] = [];
  const step: number = (stopValue - startValue) / (cardinality - 1);
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

export const unitBox = (n: number, limits = [-1, 1]): 0 | 1 => {
  const [lowerLimit, upperLimit] = limits;
  // Number() trick isn't used here to get more precise Typescript hinting
  return n >= lowerLimit && n <= upperLimit ? 1 : 0;
}

export const shortenVector = (vector: p5.Vector, percentage: number): p5.Vector => {
  // Normalize the original vector
  const normalizedVector = p5.Vector.normalize(vector);
  // Calculate the desired magnitude
  const desiredMagnitude = vector.mag() * (1 - percentage);

  // Multiply the normalized vector by the desired magnitude
  const shortenedVector = normalizedVector.mult(desiredMagnitude);

  return shortenedVector;
}