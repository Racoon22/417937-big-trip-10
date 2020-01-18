import AbstractComponent from "./abstract-component";
import moment from "moment";

const getCities = (events) => {
  let cities = events.map((event) => event.destination);
  return new Set(cities);
};

const getDuration = (events) => {
  const dateStart = moment(events[0].dateStart);
  const dateFinish = moment(events[events.length - 1].dateStart);
  let duration;
  if (dateStart.format(`M`) === dateFinish.format(`M`)) {
    duration = `${dateStart.format(`MMM`)} ${dateStart.format(`DD`)} &mdash; ${dateFinish.format(`DD`)}`;
  } else {
    duration = `${dateStart.format(`MMM`)} ${dateStart.format(`DD`)} &mdash; ${dateFinish.format(`MMM`)} ${dateFinish.format(`DD`)}`;
  }
  return duration;
};

const createTripInfoTemplate = (events) => {
  events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const destinations = Array.from(getCities(events));
  const title = destinations.length > 3 ? `${destinations.shift().name} &mdash; ${destinations.pop().name}` : destinations.map((destination) => destination.name).join(` &mdash; `);
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
