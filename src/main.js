import API from './api.js';
import {render, RenderPosition} from "./utils/render";
import TripComponent from "./components/trip"
import MenuComponent, {MenuItem} from "./components/menu";
import StatisticsComponent from './components/statistics.js';
import FilterController from "./controllers/filter"
import TripController from "./controllers/trip";
import PointsModel from "./models/points";
import NewPointComponent from "./components/new-point";

const AUTHORIZATION = `Basic dXNlckBwYXAlexANzd29yZA2o`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();

const siteMainElement = document.querySelector('.page-main .page-body__container');
const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const newPointComponent = new NewPointComponent();

const menuComponent = new MenuComponent();
render(tripControls, menuComponent, RenderPosition.BEFOREBEGIN);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripComponent = new TripComponent();
render(siteMainElement, tripComponent);

const tripController = new TripController(tripComponent, pointsModel, api);
const statisticsComponent = new StatisticsComponent(pointsModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

newPointComponent.setOnClickHandler(() => {
  menuComponent.setActiveItem(MenuItem.POINTS);
  statisticsComponent.hide();
  tripController.show();
  tripController.createPoint();
});

menuComponent.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.POINTS:
      menuComponent.setActiveItem(MenuItem.POINTS);
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});

Promise.all([
  api.getOffers()
    .then((offers) => {
      window.offers = offers;
    }),
  api.getDestination()
    .then((destinations) => {
      window.destinations = destinations;
    }),
]).then(() => {
  api.getPoints()
    .then((points) => {
      render(siteHeaderElement, newPointComponent);
      pointsModel.setPoints(points);
      tripController.render();
    });
});
