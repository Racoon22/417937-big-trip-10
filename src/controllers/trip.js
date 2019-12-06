import TripDay from "../components/trip-day";
import TripEvent from "../components/trip-event";
import EventEdit from "../components/event-edit";
import TripInfo from "../components/trip-info";
import Sort from "../components/sort";
import TripDays from "../components/trip-days";
import NoEvent from "../components/no-events";
import {castDateKebabFormat} from "../utils/common";
import {render, RenderPosition, replace} from "../utils/render";

const renderTripDay = (day, events) => {
  const tripDay = new TripDay(day);
  const eventListElement = tripDay.getElement().querySelector(`.trip-events__list`);
  events.forEach((event) => {
    const replaceEventToEdit = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceEditToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    const onEscPressDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        replaceEditToEvent();
      }
      document.removeEventListener(`keydown`, onEscPressDown);
    };

    const eventComponent = new TripEvent(event);
    const eventEditComponent = new EventEdit(event);

    eventComponent.setEditButtonClickHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscPressDown);
    });

    eventEditComponent.setSubmitHandler(() => {
      replaceEditToEvent();
    });

    render(eventListElement, eventComponent, RenderPosition.BEFOREBEGIN);
  });
  return tripDay;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._tripDays = new TripDays();
    this._noEvent = new NoEvent();
    this._sort = new Sort();
  }

  render(events) {
    if (events.length > 0) {
      this._tripInfo = new TripInfo(events);
      const tripInfo = document.querySelector(`.trip-main__trip-info`);
      render(tripInfo, this._tripInfo, RenderPosition.AFTERBEGIN);

      const totalElement = tripInfo.querySelector(`.trip-info__cost-value`);
      const totalCost = events.reduce((reducer, event) => reducer + event.price, 0);
      totalElement.textContent = totalCost.toString();

      render(this._container, this._sort, RenderPosition.BEFOREBEGIN);
      render(this._container, this._tripDays, RenderPosition.BEFOREBEGIN);

      const days = {};
      events.forEach((event) => {
        const date = castDateKebabFormat(event.dateStart);
        if (days.hasOwnProperty(date)) {
          days[date].push(event);
        } else {
          days[date] = [event];
        }
      });

      const tripDaysList = this._tripDays.getElement();
      const keys = Object.keys(days);
      for (const day of keys) {
        const tripDay = renderTripDay(day, days[day]);
        render(tripDaysList, tripDay, RenderPosition.BEFOREBEGIN);
      }
    } else {
      render(this._container, this._noEvent, RenderPosition.BEFOREBEGIN);
    }
  }
}
