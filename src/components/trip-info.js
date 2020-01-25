import AbstractComponent from "./abstract-component";
import moment from "moment";

const getCities = (points) => {
  let cities = points.map((event) => event.destination);
  return new Set(cities);
};

const getDuration = (points) => {
  const dateStart = moment(points[0].dateStart);
  const dateFinish = moment(points[points.length - 1].dateStart);
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
  const title = destinations.length > 3 ? `${destinations.shift().name} &mdash; ...  &mdash; ${destinations.pop().name}` : destinations.map((destination) => destination.name).join(` &mdash; `);
  const duration = getDuration(points);

  return (
    `<div class="trip-info__main">
         <h1 class="trip-info__title">${title}</h1>
           <p class="trip-info__dates">${duration}</p>
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
