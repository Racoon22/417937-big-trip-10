import {MONTH_NAMES} from "../const";
import AbstractComponent from "./abstract-component";

const createTripDayInfoTemplate = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = MONTH_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString().substr(1);

  return (
    `<span class="day__counter">${day}</span>
     <time class="day__date" datetime="2019-03-18">${month} ${year}</time>`
  );
};

export default class TripDayInfo extends AbstractComponent {
  constructor(date) {
    super();
    this._date = date;
  }

  getTemplate() {
    return createTripDayInfoTemplate(this._date);
  }
}
