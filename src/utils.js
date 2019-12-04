export const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getRandomDateTime = () => {
  const targetDate = new Date;
  const sing = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sing * getRandomInteger(0, 2);
  const hours = getRandomInteger(0, 23);
  const minutes = getRandomInteger(0, 59);
  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

export const getRandomTime = () => {
  const hours = castTimeFormat(getRandomInteger(0, 24));
  const minuts = castTimeFormat(getRandomInteger(0, 59));
  return `${hours}:${minuts}`;
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

export const createElement = (template) => {
  const newElement =  document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    default:
      container.append(element)
  }
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREBEGIN: `beforebegin`
};
