import {getRandomInteger, getRandomArrayItem, getRandomDateTime} from "../utils";
import {CitiesName, Offers} from "../const";

const PHOTO_MAX_COUNT = 8;
const PHOTO_MIN_COUNT = 3;

const PRICE_MAX = 1000;
const PRICE_MIN = 100;

const OFFERS_MIN_COUNT = 0;
const OFFERS_MAX_COUNT = 2;

const eventTypes = [
  `bus`, `check-in`, `check-in`, `flight`, `restaurant`, `ship`, `sightseeing`, `taxi`, `train`, `transport`, `trip`
];

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateDescription = () => {
  return lorem.split(/\.\s/).sort(() => Math.random() - 0.5).join(`.`);
};

const generateOffers = () => {
  return Offers
    .sort(() => Math.random() - 0.5)
    .slice(0, getRandomInteger(OFFERS_MIN_COUNT, OFFERS_MAX_COUNT));
};

const generatePhotos = (count) => {
  return Array(count).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateEvent = () => {
  return {
    type: getRandomArrayItem(eventTypes),
    title: `random title`,
    city: getRandomArrayItem(CitiesName),
    description: generateDescription(),
    photos: generatePhotos(getRandomInteger(PHOTO_MIN_COUNT, PHOTO_MAX_COUNT)),
    dateStart: getRandomDateTime(),
    dateEnd: getRandomDateTime(),
    price: getRandomInteger(PRICE_MIN, PRICE_MAX),
    offers: generateOffers(),
  };
};

const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};

export {generateEvent, generateEvents};
