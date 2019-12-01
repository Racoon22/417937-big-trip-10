import {createTripInfoTemplate} from './components/trip-info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createAddEventnTemplate} from "./components/add-event";
import {createTripDaysTemplate} from './components/trip-days';

import {generateEvents} from "./mock/event";

const TASK_COUNT = 3;
let events = generateEvents(TASK_COUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfo = document.querySelector(`.trip-main__trip-info`);
render(tripInfo, createTripInfoTemplate(events), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls, createMenuTemplate());
render(tripControls, createFilterTemplate());

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, createSortTemplate());
render(tripEvents, createAddEventnTemplate());
render(tripEvents, createTripDaysTemplate(events));

const totalElement = tripInfo.querySelector(`.trip-info__cost-value`);
const totalCost = events.reduce((reducer, event) => reducer + event.price, 0);
totalElement.textContent = totalCost.toString();
