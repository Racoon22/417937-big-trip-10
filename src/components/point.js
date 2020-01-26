import {castTimeFormat, placeholderGenerator} from "../utils/common";
import AbstractComponent from "./abstract-component";
import moment from "moment";

const MAX_SHOWED_OFFERS = 3;

const generateTimeInterval = (dateStart, dateEnd) => {
  const timeDiff = moment(dateEnd).diff(moment(dateStart));
  const daysDiff = moment.utc(timeDiff).format(`DD`);
  const hoursDiff = moment.utc(timeDiff).format(`HH`);
  const minutesDiff = moment.utc(timeDiff).format(`mm`);

  let formattedInterval = daysDiff > 0 ? castDateInterval(daysDiff) : ``;
  if (daysDiff > 0 || hoursDiff > 0) {
    formattedInterval += ` ${castHoursInterval(hoursDiff)}`;
  }
  return formattedInterval + ` ${castMinutesInterval(minutesDiff)}`;
};

const castDateInterval = (days) => {
  return `${days}D`;
};

const castHoursInterval = (hours) => {
  return `${hours}H`;
};

const castMinutesInterval = (minutes) => {
  return `${minutes}M`;
};

const generateOffersMarkup = (offers) => {
  return offers.slice(0, MAX_SHOWED_OFFERS).map((offer) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
        &plus;
       &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`
    );
  }).join(`\n`);
};

const createTripEventTemplate = (event) => {
  const {type, destination, dateStart, dateEnd, price, offers} = event;
  const timeInterval = generateTimeInterval(dateStart, dateEnd);

  const timeStart = castTimeFormat(dateStart);
  const timeEnd = castTimeFormat(dateEnd);
  const offersMarkup = generateOffersMarkup(offers);

  const placeholder = placeholderGenerator(type);
  const title = placeholder + destination.name;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeEnd}</time>
          </p>
          <p class="event__duration">${timeInterval}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Point extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
