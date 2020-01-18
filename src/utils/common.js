import moment from "moment";

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
  return moment(date).format(`HH:mm`);
};

export const capitalizeFirstLetter = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

export const slugGenerator = (text) => {
  return text.toLowerCase().replace(/\W/g, '-');
};
