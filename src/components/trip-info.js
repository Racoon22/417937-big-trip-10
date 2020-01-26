import AbstractComponent from "./abstract-component";
import moment from "moment";

const MAX_SHOWED_DESTINATIONS = 3;

const getCities = (points) => {
  const cities = points.map((event) => event.destination);
  return new Set(cities);
};

const getDuration = (points) => {
  const dateStart = moment(points[0].dateStart);
  const dateFinish = moment(points[points.length - 1].dateStart);
  return dateStart.format(`M`) === dateFinish.format(`M`) ?
    `${dateStart.format(`MMM`)} ${dateStart.format(`DD`)} &mdash; ${dateFinish.format(`DD`)}` :
    `${dateStart.format(`MMM`)} ${dateStart.format(`DD`)} &mdash; ${dateFinish.format(`MMM`)} ${dateFinish.format(`DD`)}`;
};

const createTripInfoTemplate = (points) => {
  points.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const destinations = Array.from(getCities(points));
  const title = destinations.length > MAX_SHOWED_DESTINATIONS ? `${destinations.shift().name} &mdash; ... &mdash; ${destinations.pop().name}` : destinations.map((destination) => destination.name).join(` &mdash; `);
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
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
