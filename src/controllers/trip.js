import TripDay from "../components/trip-day";
import TripInfo from "../components/trip-info";
import Sort, {SORT_TYPES} from "../components/sort";
import TripDays from "../components/trip-days";
import NoEvent from "../components/no-points";
import {render, RenderPosition} from "../utils/render";
import TripDayInfo from "../components/trip-day-info";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point";

const renderTripDay = (daysElement, events, onDataChange, onViewChange, date = null) => {
  const tripDay = new TripDay();
  const infoContainer = tripDay.getElement();
  render(infoContainer, new TripDayInfo(date), RenderPosition.AFTERBEGIN);
  const eventListElement = tripDay.getElement().querySelector(`.trip-events__list`);

  const points = events.map((point) => {
    const pointController = new PointController(eventListElement, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
  render(daysElement, tripDay, RenderPosition.BEFOREBEGIN);
  return points;
};

const renderDays = (container, events, onDataChange, onViewChange) => {
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
  keys.forEach((key) => {
    let daysPoints = renderTripDay(container, days[key], onDataChange, onViewChange, key);
    daysPoints.forEach((point) => {
      pointControllers.push(point);
    });
  });
  return pointControllers;
};

const renderSortedTrip = (container, events, onDataChange, onViewChange) => {
  return renderTripDay(container, events, onDataChange, onViewChange);
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._tripDays = new TripDays();
    this._noEvent = new NoEvent();
    this._sort = new Sort();
    this._pointControllers = [];
    this._creatingPoint = null;

    this._points = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._creatingPoint = new PointController(this._container.getElement(), this._onDataChange, this._onViewChange);
    this._updatePoints();
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  _renderPoints() {
    this._points = this._pointsModel.getPoints();
    const points = this._pointsModel.getPointsAll();
    if (points === 0) {
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

      const tripDaysList = this._tripDays.getElement();

      this._sort.setSortTypeClickHandler((sortType) => {
        let sortedEvents = [];

        switch (sortType) {
          case SORT_TYPES.PRICE:
            sortedEvents = this._points.sort((a, b) => b.price - a.price);
            break;
          case SORT_TYPES.TIME:
            sortedEvents = this._points.sort((a, b) => (b.duration) - (a.duration));
            break;
          case SORT_TYPES.EVENT:
            sortedEvents = this._points.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
            break;
        }

        tripDaysList.innerHTML = ``;
        const dateSortLabel = this._sort.getElement().querySelector(`.trip-sort__item--day`);

        if (sortType === SORT_TYPES.EVENT) {
          this._pointControllers = renderDays(tripDaysList, sortedEvents, this._onDataChange, this._onViewChange);
          dateSortLabel.textContent = `Day`;
        } else {
          this._pointControllers = renderSortedTrip(tripDaysList, sortedEvents, this._onDataChange, this._onViewChange);
          dateSortLabel.textContent = ``;
        }
      });

      this._points.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
      this._pointControllers = renderDays(tripDaysList, this._points, this._onDataChange, this._onViewChange);
    }
  }

  _renderInfo() {
    const points = this._pointsModel.getPointsAll();
    this._tripInfo = new TripInfo(points);
    const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
    render(tripInfoContainer, this._tripInfo, RenderPosition.AFTERBEGIN);
  }

  _removeInfo() {
    this._tripInfo.removeElement();
    document.querySelector(`.trip-main__trip-info`).textContent = ``;
  }

  render() {
    this._renderInfo();
    this._renderPoints();
  }

  _onDataChange(pointController, oldData, newData) {
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

  _onViewChange() {
    this._pointControllers.forEach((it) => {
      it.setDefaultView();
    });
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
    }
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _removePoints() {
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
    this._removePoints();
    this._removeInfo();
    this._removeTripDays();
    this._createTripDays();
    this._clearContainer();
    this._renderInfo();
    this._renderPoints();
  }
}
