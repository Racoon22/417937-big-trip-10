import TripDay from "../components/trip-day";
import TripInfo from "../components/trip-info";
import Sort, {SORT_TYPES} from "../components/sort";
import TripDays from "../components/trip-days";
import NoEvent from "../components/no-events";
import {castDateKebabFormat} from "../utils/common";
import {render, RenderPosition} from "../utils/render";
import TripDayInfo from "../components/trip-day-info";
import PointController from "./point";

const renderTripDay = (events, onDataChange, date = null) => {
  const tripDay = new TripDay();
  if (date) {
    const infoContainer = tripDay.getElement().querySelector(`.day__info`);
    render(infoContainer, new TripDayInfo(date), RenderPosition.AFTERBEGIN);
  }
  const eventListElement = tripDay.getElement().querySelector(`.trip-events__list`);

  events.forEach((point) => {
    const pointController = new PointController(eventListElement, onDataChange);
    pointController.render(point);
  });
  return tripDay;
};

const renderDays = (container, events, onDataChange) => {
  const days = {};
  events.forEach((event) => {
    const date = castDateKebabFormat(event.dateStart);
    if (days.hasOwnProperty(date)) {
      days[date].push(event);
    } else {
      days[date] = [event];
    }
  });
  const keys = Object.keys(days);
  for (const day of keys) {
    const tripDay = renderTripDay(days[day], onDataChange, day);
    render(container, tripDay, RenderPosition.BEFOREBEGIN);
  }
};

const renderSortedTrip = (container, events, onDataChange) => {
  const tripDay = renderTripDay(events, onDataChange);
  render(container, tripDay, RenderPosition.BEFOREBEGIN);
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._tripDays = new TripDays();
    this._noEvent = new NoEvent();
    this._sort = new Sort();

    this._points = [];
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(events) {
    this._points = events;
    if (events.length > 0) {
      this._tripInfo = new TripInfo(events);
      const tripInfo = document.querySelector(`.trip-main__trip-info`);
      render(tripInfo, this._tripInfo, RenderPosition.AFTERBEGIN);

      const totalElement = tripInfo.querySelector(`.trip-info__cost-value`);
      const totalCost = events.reduce((reducer, event) => reducer + event.price, 0);
      totalElement.textContent = totalCost.toString();

      render(this._container, this._sort, RenderPosition.BEFOREBEGIN);
      render(this._container, this._tripDays, RenderPosition.BEFOREBEGIN);

      const tripDaysList = this._tripDays.getElement();

      this._sort.setSortTypeClickHandler((sortType) => {
        let sortedEvents = [];

        switch (sortType) {
          case SORT_TYPES.PRICE:
            sortedEvents = events.sort((a, b) => b.price - a.price);
            break;
          case SORT_TYPES.TIME:
            sortedEvents = events.sort((a, b) => (b.duration) - (a.duration));
            break;
          case SORT_TYPES.EVENT:
            sortedEvents = events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
            break;
        }

        tripDaysList.innerHTML = ``;
        const dateSortLabel = this._sort.getElement().querySelector(`.trip-sort__item--day`);

        if (sortType === SORT_TYPES.EVENT) {
          renderDays(tripDaysList, sortedEvents, this._onDataChange());
          dateSortLabel.textContent = `Date`;
        } else {
          renderSortedTrip(tripDaysList, sortedEvents);
          dateSortLabel.textContent = ``;
        }
      });

      renderDays(tripDaysList, events, this._onDataChange);
    } else {
      render(this._container, this._noEvent, RenderPosition.BEFOREBEGIN);
    }
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));
    pointController.render(this._points[index]);
  }


}
