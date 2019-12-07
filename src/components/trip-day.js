import AbstractComponent from "./abstract-component";

const createTripDayTemplate = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list"></ul>
     </li>`
  );
};

export default class TripDay extends AbstractComponent {
  getTemplate() {
    return createTripDayTemplate();
  }
}
