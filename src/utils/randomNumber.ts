export const randomNumber = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
