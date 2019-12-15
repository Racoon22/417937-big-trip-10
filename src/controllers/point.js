import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import {render, RenderPosition, replace} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;
  }

  render(point) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {isFavorite: !point.isFavorite}));
      document.addEventListener(`keydown`, this._onEscPressDown);
    });

    this._pointEditComponent.setSubmitHandler(() => {
      this._replaceEditToPoint();
    });

    if (oldPointComponent && oldPointEditComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  _replaceEditToPoint() {
    this._pointEditComponent.reset();
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
      this._replaceEditToPoint();
    }
    document.removeEventListener(`keydown`, this._onEscPressDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }
}
