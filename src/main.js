import {render, RenderPosition} from "./utils/render";
import {castDateKebabFormat} from "./utils/common";
import {generateEvents} from "./mock/event";

import TripInfo from "./components/trip-info";
import Menu from "./components/menu";
import Filter from "./components/filter";
import Sort from "./components/sort";
import TripDays from "./components/trip-days";
import TripEvent from "./components/trip-event";
import TripDay from "./components/trip-day";
import EventEdit from "./components/event-edit";
import NoEvent from "./components/no-events";
import TripController from "./controllers/trip";

const TASK_COUNT = 3;
let events = generateEvents(TASK_COUNT);
events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls, new Menu(), RenderPosition.BEFOREBEGIN);
render(tripControls, new Filter(), RenderPosition.BEFOREBEGIN);

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents);
tripController.render(events);
