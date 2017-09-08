const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((a, b) => a + b);

const foo = () => {
  return new Promise((resolve, reject) => {
    resolve();
  });
}
