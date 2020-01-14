import AbstractComponent from "./abstract-component";

const createButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  )
};

export default class NewPointComponent extends AbstractComponent {
  getTemplate() {
    return createButtonTemplate()
  }

  setOnClickHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      handler(M);
    });
  }
}
