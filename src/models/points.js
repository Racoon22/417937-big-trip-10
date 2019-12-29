import {getPointByFilter} from "../utils/filter";
import {FilterType} from "../const";

export default class Points {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  setPoints(points) {
    this._points = points;
  }

  getPointsAll() {
    return this._points;
  }

  getPoints() {
    return getPointByFilter(this._points, this._activeFilterType);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updatePoints(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    this._dataChangeHandlers.forEach((handler) => handler());	    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  removePoints(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

}
