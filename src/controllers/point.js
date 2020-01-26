import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {slugGenerator} from "../utils/common";
import moment from "moment";
import Point from "../models/point";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const emptyPoint = {
  id: null,
  type: `flight`,
  destination: {},
  isFavorite: false,
  dateStart: new Date(),
  dateEnd: new Date(),
  price: 0,
  offers: [],
};

const parseFormData = (formData, offers, destinations) => {
  const type = formData.get(`event-type`);
  const typeOffers = offers.filter((offer) => offer.type === type).map((offer) => offer.offers).flat()
    .filter((offer) => {
      return formData.getAll(`event-offer`).some((acceptedOffer) => {
        return slugGenerator(offer.title) === acceptedOffer;
      });
    });
  return new Point({
    'type': type,
    'destination': destinations.find((destination) => destination.name === formData.get(`event-destination`)),
    'date_from': moment(formData.get(`event-start-time`)).toJSON(),
    'date_to': moment(formData.get(`event-end-time`)).toJSON(),
    'is_favorite': Boolean(formData.get(`event-favorite`)),
    'base_price': parseInt(formData.get(`event-price`), 10),
    'offers': typeOffers
  });
};

export default class PointController {
  constructor(container, config, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._config = config;

    this._escPressDownHandler = this._escPressDownHandler.bind(this);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  setError() {
    this._pointEditComponent.setError();
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, this._config, mode);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escPressDownHandler);
    });

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      if (this._pointEditComponent.isLocked()) {
        return;
      }
      const newPoint = Point.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._dataChangeHandler(this, point, newPoint);

      document.addEventListener(`keydown`, this._escPressDownHandler);
    });

    this._pointEditComponent.setCloseButtonClickHandler(() => {
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      if (this._pointEditComponent.isLocked()) {
        return;
      }

      if (this._pointEditComponent.isValid()) {
        return;
      }

      if (this._pointEditComponent.getError()) {
        this._pointEditComponent.clearError();
      }

      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, this._config.offers, this._config.destinations);

      this._pointEditComponent.lock();
      this._pointEditComponent.setData({
        SAVE: `Saving...`
      });

      this._dataChangeHandler(this, point, data);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      if (this._pointEditComponent.isLocked()) {
        return;
      }

      if (this._pointEditComponent.getError()) {
        this._pointEditComponent.clearError();
      }

      this._pointEditComponent.lock();
      this._pointEditComponent.setData({
        DELETE: `Deleting...`
      });

      this._dataChangeHandler(this, point, null);
    });

    switch (mode) {
      case Mode.DEFAULT :
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREBEGIN);
        }
        break;
      case Mode.ADDING :
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._escPressDownHandler);
        render(this._container, this._pointEditComponent, RenderPosition.BEFOREBEGIN);
        break;
    }
  }

  shake() {
    this._pointEditComponent.shake();
  }


  lock() {
    this._pointEditComponent.lock();
  }

  unlock() {
    this._pointEditComponent.unlock();
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escPressDownHandler);
  }

  _replaceEditToPoint() {
    this._pointEditComponent.reset();

    document.removeEventListener(`keydown`, this._escPressDownHandler);

    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._viewChangeHandler();

    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _escPressDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, emptyPoint, null);
      }
      this._replaceEditToPoint();
    }
    document.removeEventListener(`keydown`, this._escPressDownHandler);
  }
}
