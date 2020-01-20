import AbstractComponent from "./abstract-component";
import moment from "moment";

const generateInfo = (date) => {
  const dateObj = moment(date);
  const day = dateObj.format(`DD`);
  const month = dateObj.format(`MMM`);
  const year = dateObj.format(`YY`);
  return (
    `<span class="day__counter">${day}</span><time class="day__date" datetime="${year}-${month}-${day}">${month} ${year}</time>`
  )
};

const createTripDayInfoTemplate = (date) => {
  const infoMarkup = date ? generateInfo(date) : ``;
  return (
    `<div class="day__info">
      ${infoMarkup}
     </div>`
  );
};

export default class TripDayInfo extends AbstractComponent {
  constructor(date = null) {
    super();
    this._date = date;
  }

  getTemplate() {
    return createTripDayInfoTemplate(this._date);
  }
}
