import AbstractComponent from "./abstract-component";
import {capitalizeFirstLetter} from "../utils/common";

export const sortTypes = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const createSortTemplate = (sortType) => {
  const isEventSort = sortType === sortTypes.EVENT;
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${isEventSort ? `Day` : ``}</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
        <label class="trip-sort__btn" for="sort-event" data-sort-type="${(sortTypes.EVENT)}">${capitalizeFirstLetter(sortTypes.EVENT)}</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
        <label class="trip-sort__btn" for="sort-time" data-sort-type="${(sortTypes.TIME)}">${capitalizeFirstLetter(sortTypes.TIME)}</div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
        <label class="trip-sort__btn" for="sort-price" data-sort-type="${(sortTypes.PRICE)}">${capitalizeFirstLetter(sortTypes.PRICE)}</label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = sortTypes.EVENT;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType !== sortType) {
        this._currentSortType = sortType;
      }

      handler(this._currentSortType);
    });
  }
}
