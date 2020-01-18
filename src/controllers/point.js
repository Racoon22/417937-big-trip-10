import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {defaultEventType} from "../mock/event";
import {slugGenerator} from "../utils/common";
import moment from "moment";
import Point from "../models/point";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  id: null,
  type: defaultEventType,
  title: `random title`,
  destination: {},
  isFavorite: false,
  dateStart: {},
  dateEnd: {},
  price: 0,
  offers: [],
};

const parseFormData = (formData) => {
  const offers = window.offers.map((offer) => offer.offers).flat()
    .filter((offer) => {
      return formData.getAll(`event-offer`).some((acceptedOffer) => {
        return slugGenerator(offer.title) === acceptedOffer;
      });
    });
  return new Point({
    'type': formData.get(`event-type`),
    'destination': window.destinations.find((destination) => destination.name === formData.get(`event-destination`)),
    'date_from': moment(formData.get(`event-start-time`)).toJSON(),
    'date_to': moment(formData.get(`event-end-time`)).toJSON(),
    'is_favorite': Boolean(formData.get(`event-favorite`)),
    'base_price': parseInt(formData.get(`event-price`), 10),
    'offers': offers
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscPressDown = this._onEscPressDown.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, mode);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = Point.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, point, newPoint);

      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._pointEditComponent.setCloseButtonClickHandler(() => {
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData);

      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

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
        document.addEventListener(`keydown`, this._onEscPressDown);
        render(this._container, this._pointEditComponent, RenderPosition.BEFOREBEGIN);
        break;
    }
  }

  _replaceEditToPoint() {
    this._pointEditComponent.reset();

    document.removeEventListener(`keydown`, this._onEscPressDown);

    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();

    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscPressDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
    }
    document.removeEventListener(`keydown`, this._onEscPressDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscPressDown);
  }
}
