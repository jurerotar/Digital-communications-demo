declare global {
  interface Array<T> {
    random(): Array<T>;
  }
}
// Returns a random element from an array
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}


export {};