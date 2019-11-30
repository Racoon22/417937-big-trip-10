import {createTripInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createEditTemplate} from './components/edit';
import {createTripDaysTemplate} from './components/trip-days';
import {createTripDayTemplate} from './components/trip-day';
import {createTripEventTemplate} from './components/trip-event';

import {generateEvents} from "./mock/event";

const TASK_COUNT = 10;
let events = generateEvents(TASK_COUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfo = document.querySelector(`.trip-main__trip-info`);
render(tripInfo, createTripInfoTemplate(), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls, createMenuTemplate());
render(tripControls, createFilterTemplate());

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, createSortTemplate());
render(tripEvents, createEditTemplate());
render(tripEvents, createTripDaysTemplate());

const tripDays = document.querySelector(`.trip-days`);
render(tripDays, createTripDayTemplate());

const tripDay = document.querySelector(`.trip-events__list`);

events.forEach((event) => {
  render(tripDay, createTripEventTemplate(event));
});
