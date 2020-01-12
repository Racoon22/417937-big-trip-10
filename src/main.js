import {render, RenderPosition} from "./utils/render";
import {generateEvents} from "./mock/event";
import Menu from "./components/menu";
import FilterController from "./controllers/filter"
import TripController from "./controllers/trip";
import PointsModel from "./models/points";

const TASK_COUNT = 2;
let points = generateEvents(TASK_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
render(tripControls, new Menu(), RenderPosition.BEFOREBEGIN);

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createPoint();
  });

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripPoints = document.querySelector(`.trip-events`);

const tripController = new TripController(tripPoints, pointsModel);
tripController.render();
