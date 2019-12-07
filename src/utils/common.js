export const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getRandomDateTime = () => {
  const targetDate = new Date();
  const sing = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sing * getRandomInteger(0, 2);
  const hours = getRandomInteger(0, 23);
  const minutes = getRandomInteger(0, 59);
  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

export const castTimeFormat = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}: ${minutes}`;
};

export const castZeroFirstFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const castDateKebabFormat = (date) => {
  let yyyy = date.getFullYear();
  let mm = castZeroFirstFormat(date.getMonth() + 1);
  let dd = castZeroFirstFormat(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};
