export const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (array) => {
  return array[getRandomInteger(0, array.length)];
};

export const getRandomDate = () => {
  const targetDate = new Date;
  const sing = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sing * getRandomInteger(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

export const getRandomTime = () => {
  const hours = castTimeFormat(getRandomInteger(0, 24));
  const minuts = castTimeFormat(getRandomInteger(0, 59));
  return `${hours}:${minuts}`;
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const castTimeIntervalFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};
