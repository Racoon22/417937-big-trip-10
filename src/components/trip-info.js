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

const createTripInfoTemplate = (points) => {
  points.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const destinations = Array.from(getCities(points));
  const title = destinations.length > 3 ? `${destinations.shift().name} &mdash; ... &mdash; ${destinations.pop().name}` : destinations.map((destination) => destination.name).join(` &mdash; `);
  const duration = getDuration(points);
  const price = points.reduce((acc, point) => {
    return acc + point.price + point.offers.reduce((offersPrice, offer) => {
      return offersPrice + offer.price;
    }, 0);
  }, 0);

  return (
    `<div class="trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>

          <p class="trip-info__dates">${duration}</p>
        </div>

        <p class="trip-info__cost">
         Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
        </p>
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
