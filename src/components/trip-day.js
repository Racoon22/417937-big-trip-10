import {MONTH_NAMES} from "../const";
import {createElement} from "../utils";

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

export default class TripDay {
  constructor(date) {
    this._element = null;
    this._date = date;
  }

  getTemplate() {
    return createTripDayTemplate(this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
