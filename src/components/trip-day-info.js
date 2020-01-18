import AbstractComponent from "./abstract-component";
import moment from "moment";

const createTripDayInfoTemplate = (date) => {
  const dateObj = moment(date);
  const day = dateObj.format(`DD`);
  const month = dateObj.format(`MMM`);
  const year = dateObj.format(`YYYY`);

  return (
    `<div class="day__info">
      <span class="day__counter">${day}</span><time class="day__date" datetime="2019-03-18">${month} ${year}</time>
     </div>`
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
