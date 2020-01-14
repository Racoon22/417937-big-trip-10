import {render, RenderPosition} from "./utils/render";
import {generateEvents} from "./mock/event";
import TripComponent from "./components/trip"
import MenuComponent, {MenuItem} from "./components/menu";
import StatisticsComponent from './components/statistics.js';
import FilterController from "./controllers/filter"
import TripController from "./controllers/trip";
import PointsModel from "./models/points";
import NewPointComponent from "./components/new-point";

const POINT_COUNT = 2;
let points = generateEvents(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const siteMainElement = document.querySelector('.page-main .page-body__container');
const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const newPointComponent = new NewPointComponent();
render(siteHeaderElement, newPointComponent);

const menuComponent = new MenuComponent();
render(tripControls, menuComponent, RenderPosition.BEFOREBEGIN);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripComponent = new TripComponent();
render(siteMainElement, tripComponent);

const tripController = new TripController(tripComponent, pointsModel);
const statisticsComponent = new StatisticsComponent();
render(siteMainElement, statisticsComponent);

tripController.render();
statisticsComponent.hide();

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    menuComponent.setActiveItem(MenuItem.POINTS);
    statisticsComponent.hide();
    tripController.show();
    tripController.createPoint();
  });

menuComponent.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.POINTS:
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});
