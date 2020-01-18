import {getRandomInteger, getRandomArrayItem, getRandomDateTime} from "../utils/common";
import {OFFERS} from "../const";

const PHOTO_MAX_COUNT = 8;
const PHOTO_MIN_COUNT = 3;

const PRICE_MAX = 1000;
const PRICE_MIN = 100;

const OFFERS_MIN_COUNT = 0;
const OFFERS_MAX_COUNT = 2;

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateDescription = () => {
  return lorem.split(/\.\s/).sort(() => Math.random() - 0.5).join(`.`);
};

const generatePhotos = (count) => {
  return Array(count).fill(``).map(() => `
  http://picsum.photos/300/150?r=${Math.random()}`);
};

export const Destinations = [
  {
    name: `Saint Petersburg`,
    description: generateDescription(),
    images: generatePhotos(getRandomInteger(PHOTO_MIN_COUNT, PHOTO_MAX_COUNT))
  },
  {
    name: `Geneva`,
    description: generateDescription(),
    images: generatePhotos(getRandomInteger(PHOTO_MIN_COUNT, PHOTO_MAX_COUNT))
  },
  {
    name: `Chamonix`,
    description: generateDescription(),
    images: generatePhotos(getRandomInteger(PHOTO_MIN_COUNT, PHOTO_MAX_COUNT))
  },
  {
    name: `Amsterdam`,
  },
];

export const eventTypes =
  [
    `bus`,
    `flight`,
    `ship`,
    `taxi`,
    `transport`,
    `train`,
    `drive`,
    `sightseeing`,
    `restaurant`,
    `check-in`,
  ]
;

export const defaultEventType = eventTypes.find((type) => type.name === `flight`);

const generateEvent = () => {
  const dates = [getRandomDateTime(), getRandomDateTime()];
  dates.sort((a, b) => a.getTime() - b.getTime());
  const pointType = getRandomArrayItem(eventTypes);
  return {
    id: String(new Date() + Math.random()),
    type: pointType,
    title: `random title`,
    destination: getRandomArrayItem(Destinations),
    isFavorite: Math.random() > 0.5,
    dateStart: dates[0],
    dateEnd: dates[1],
    price: getRandomInteger(PRICE_MIN, PRICE_MAX),
    offers: generateOffers(pointType.offers),
    duration: dates[1] - dates[0]
  };
};

const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};

export {generateEvent, generateEvents};
