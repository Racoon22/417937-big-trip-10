import {render, RenderPosition} from "./utils/render";
import {generateEvents} from "./mock/event";
import Menu from "./components/menu";
import Filter from "./components/filter";
import TripController from "./controllers/trip";

const TASK_COUNT = 3;
let events = generateEvents(TASK_COUNT);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls, new Menu(), RenderPosition.BEFOREBEGIN);
render(tripControls, new Filter(), RenderPosition.BEFOREBEGIN);

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents);
tripController.render(events);
