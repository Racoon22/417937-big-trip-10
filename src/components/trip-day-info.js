import AbstractComponent from "./abstract-component";
import moment from "moment";

const generateInfo = (counter, date) => {
  const dateObj = moment(date);
  const day = dateObj.format(`DD`);
  const month = dateObj.format(`MMM`);
  const year = dateObj.format(`YY`);
  return (
    `<span class="day__counter">${counter}</span><time class="day__date" datetime="${year}-${month}-${day}">${month} ${day}</time>`
  );
};

const createTripDayInfoTemplate = (counter, date) => {
  const infoMarkup = date ? generateInfo(counter, date) : ``;
  return (
    `<div class="day__info">
      ${infoMarkup}
     </div>`
  );
};

export default class TripDayInfo extends AbstractComponent {
  constructor(counter = null, date = null) {
    super();
    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createTripDayInfoTemplate(this._counter, this._date);
  }
}
