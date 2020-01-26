import TripDay from "../components/trip-day";
import TripInfo from "../components/trip-info";
import Sort, {sortTypes} from "../components/sort";
import TripDays from "../components/trip-days";
import NoEvent from "../components/no-points";
import {render, RenderPosition} from "../utils/render";
import TripDayInfo from "../components/trip-day-info";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point";
import moment from "moment";

const renderTripDay = (daysElement, events, configs, dataChangeHandler, viewChangeHandler, counter, date = null) => {
  const tripDay = new TripDay();
  const infoContainer = tripDay.getElement();
  render(infoContainer, new TripDayInfo(counter, date), RenderPosition.AFTERBEGIN);
  const eventListElement = tripDay.getElement().querySelector(`.trip-events__list`);

  const points = events.map((point) => {
    const pointController = new PointController(eventListElement, configs, dataChangeHandler, viewChangeHandler);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
  render(daysElement, tripDay, RenderPosition.BEFOREBEGIN);
  return points;
};

const renderDays = (container, events, configs, dataChangeHandler, viewChangeHandler) => {
  const days = {};
  const pointControllers = [];
  events.forEach((event) => {
    const date = event.dateStart.toDateString();
    if (days.hasOwnProperty(date)) {
      days[date].push(event);
    } else {
      days[date] = [event];
    }
  });
  const keys = Object.keys(days);

  keys.forEach((key, index) => {
    const daysPoints = renderTripDay(container, days[key], configs, dataChangeHandler, viewChangeHandler, ++index, key);
    daysPoints.forEach((point) => {
      pointControllers.push(point);
    });
  });
  return pointControllers;
};

const renderSortedTrip = (container, events, configs, dataChangeHandler, viewChangeHandler) => {
  return renderTripDay(container, events, configs, dataChangeHandler, viewChangeHandler);
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._tripInfoContainer = document.querySelector(`.trip-main__trip-info`);

    this._tripDays = new TripDays();
    this._noEvent = new NoEvent();
    this._sort = new Sort();
    this._pointControllers = [];
    this._creatingPoint = null;

    this._points = [];
    this._offers = [];
    this._destinations = [];

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._pointsModel.setFilterChangeHandler(this._filterChangeHandler);
    this._sortType = sortTypes.EVENT;

  }

  setOffers(offers) {
    this._offers = offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  render() {
    this._renderInfo();
    this._renderTrip();
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._creatingPoint = new PointController(this._container.getElement(), this._getConfigs(), this._dataChangeHandler, this._viewChangeHandler);
    this._updatePoints();
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  _getConfigs() {
    return {
      offers: this._offers,
      destinations: this._destinations,
    };
  }

  _renderTrip() {
    this._points = this._pointsModel.getPoints();
    const points = this._pointsModel.getPointsAll();
    if (points.length === 0) {
      if (this._creatingPoint) {
        this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
      }
      render(this._container.getElement(), this._noEvent, RenderPosition.BEFOREBEGIN);
    } else {
      render(this._container.getElement(), this._sort, RenderPosition.BEFOREBEGIN);
      if (this._creatingPoint) {
        this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
      }
      render(this._container.getElement(), this._tripDays, RenderPosition.BEFOREBEGIN);

      this._sort.setSortTypeClickHandler((sortType) => {
        this._sortType = sortType;
        this._renderPoints();
      });

      this._renderPoints(this._sort);
    }
  }

  _renderPoints() {
    const tripDaysList = this._tripDays.getElement();
    tripDaysList.innerHTML = ``;
    const dateSortLabel = this._sort.getElement().querySelector(`.trip-sort__item--day`);

    let sortedPoints = [];
    switch (this._sortType) {
      case sortTypes.PRICE:
        sortedPoints = this._points.sort((a, b) => b.price - a.price);
        break;
      case sortTypes.TIME:
        sortedPoints = this._points.sort((a, b) => {
          const diff = moment(b.dateEnd).diff(moment(b.dateStart)) - (moment(a.dateEnd).diff(moment(a.dateStart)));
          if (diff > 1) {
            return 1;
          } else if (diff === 0) {
            return 0;
          } else {
            return -1;
          }
        });
        break;
      case sortTypes.EVENT:
        sortedPoints = this._points.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
        break;
    }

    if (this._sortType === sortTypes.EVENT) {
      this._pointControllers = renderDays(tripDaysList, sortedPoints, this._getConfigs(), this._dataChangeHandler, this._viewChangeHandler);
      dateSortLabel.textContent = `Day`;
    } else {
      this._pointControllers = renderSortedTrip(tripDaysList, sortedPoints, this._getConfigs(), this._dataChangeHandler, this._viewChangeHandler);
      dateSortLabel.textContent = ``;
    }
  }

  _renderInfo() {
    const points = this._pointsModel.getPointsAll();
    if (points.length > 0) {
      this._tripInfo = new TripInfo(points);
      render(this._tripInfoContainer, this._tripInfo, RenderPosition.AFTERBEGIN);
    }
  }

  _removeInfo() {
    if (this._pointsModel.getPointsAll().length > 0) {
      this._tripInfo.removeElement();
      this._tripInfoContainer.textContent = ``;
    }
  }

  _removeTrip() {
    this._tripDays.getElement();
    this._pointControllers.forEach((pointController) => pointController.destroy());
  }

  _clearContainer() {
    this._container.getElement().innerHTML = ``;
  }

  _createTripDays() {
    this._tripDays = new TripDays();
  }

  _removeTripDays() {
    this._tripDays.removeElement();
  }

  _updatePoints() {
    this._removeTrip();
    this._removeInfo();
    this._removeTripDays();
    this._createTripDays();
    this._clearContainer();
    this._renderInfo();
    this._renderTrip();
  }

  _dataChangeHandler(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api.createPoint(newData).then((pointModel) => {
          this._pointsModel.addPoint(pointModel);
          this._updatePoints();
          pointController.unlock();
        }).catch(() => {
          pointController.setError();
          pointController.unlock();
          pointController.shake();
        });
      }
    } else {
      if (newData === null) {
        this._api.deletePoint(oldData.id).then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          pointController.unlock();
        }).catch(() => {
          pointController.setError();
          pointController.unlock();
          pointController.shake();
        });
      } else {
        this._api.updatePoint(oldData.id, newData).then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.setError();
            pointController.render(newData, PointControllerMode.DEFAULT);
            pointController.unlock();
            this._updatePoints();
          }
        }).catch(() => {
          pointController.setError();
          pointController.unlock();
          pointController.shake();
        });
      }
    }
  }

  _viewChangeHandler() {
    this._pointControllers.forEach((it) => {
      it.setDefaultView();
    });
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
    }
  }

  _filterChangeHandler() {
    this._updatePoints();
  }
}
