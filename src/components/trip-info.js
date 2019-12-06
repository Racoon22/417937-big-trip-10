import {MONTH_NAMES} from "../const";
import AbstractComponent from "./abstract-component";

const getCities = (events) => {
  let cities = events.map((event) => event.city);
  return new Set(cities);
};

const getDuration = (events) => {
  const dateStart = events[0].dateStart;
  const dateFinish = events[events.length - 1].dateStart;
  let duration;
  if (dateStart.getMonth() === dateFinish.getMonth()) {
    duration = `${MONTH_NAMES[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${dateFinish.getDate()}`;
  } else {
    duration = `${MONTH_NAMES[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${MONTH_NAMES[dateFinish.getMonth()]} ${dateFinish.getDate()}`;
  }
  return duration;
};

const createTripInfoTemplate = (events) => {
  events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const cities = Array.from(getCities(events));
  const title = cities > 3 ? `${cities.shift()} &mdash; ${cities.pop()}` : cities.join(` &mdash; `);
  const duration = getDuration(events);

  return (
    `<div class="trip-info__main">
         <h1 class="trip-info__title">${title}</h1>
           <p class="trip-info__dates">${duration}</p>
     </div>`
  );
};
export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
