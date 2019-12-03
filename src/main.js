import {castDateKebabFormat, render, RenderPosition} from "./utils";
import {generateEvents} from "./mock/event";

import TripInfo from "./components/trip-info";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Sort from "./components/sort";
import TripDays from "./components/trip-days";
import TripEvent from "./components/trip-event";
import TripDay from "./components/trip-day";

const TASK_COUNT = 3;
let events = generateEvents(TASK_COUNT);
events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());

const renderTripDay = (day) => {
  const tripDay = new TripDay(day);
  const eventListElement = tripDay.getElement().querySelector('.trip-events__list');
  const dayEvents = events.filter((event) => castDateKebabFormat(event.dateStart) === day);
  dayEvents.forEach((event) => {
    render(eventListElement, new TripEvent(event).getElement(), RenderPosition.BEFOREBEGIN);
  });
  return tripDay;
};

const tripInfo = document.querySelector(`.trip-main__trip-info`);
render(tripInfo, new TripInfo(events).getElement(), RenderPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls, new Menu().getElement(), RenderPosition.BEFOREBEGIN);
render(tripControls, new Filter().getElement(), RenderPosition.BEFOREBEGIN);

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, new Sort().getElement(), RenderPosition.BEFOREBEGIN);

const tripDays = new TripDays();
render(tripEvents, tripDays.getElement(), RenderPosition.BEFOREBEGIN);

const days = Array.from(new Set(events.map((event) => castDateKebabFormat(event.dateStart))));
days.forEach((day) => {
  const tripDay = renderTripDay(day);
  render(tripDays.getElement(), tripDay.getElement(), RenderPosition.BEFOREBEGIN)
});

const totalElement = tripInfo.querySelector(`.trip-info__cost-value`);
const totalCost = events.reduce((reducer, event) => reducer + event.price, 0);
totalElement.textContent = totalCost.toString();
