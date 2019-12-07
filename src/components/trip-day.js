import {MONTH_NAMES} from "../const";
import AbstractComponent from "./abstract-component";

const createTripDayTemplate = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = MONTH_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString().substr(1);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="2019-03-18">${month} ${year}</time>
      </div>

      <ul class="trip-events__list">

      </ul>
     </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(date) {
    super();
    this._date = date;
  }

  getTemplate() {
    return createTripDayTemplate(this._date);
  }
}
