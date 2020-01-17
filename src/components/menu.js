import AbstractComponent from "./abstract-component";

export const MenuItem = {
  NEW_POINT: `new-point`,
  STATS: `stats`,
  POINTS: `points`,
};

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a id="points" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a id="stats" class="trip-tabs__btn" href="#">Stats</a>
     </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    this.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
    if (menuItem === MenuItem.STATS) {
      this.getElement().querySelector(`#stats`).classList.add(`trip-tabs__btn--active`);
    } else {
      this.getElement().querySelector(`#points`).classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
