import AbstractComponent from "./abstract-component";

const createTripTemplate = () => {
  return (
    `<section class="trip-events">
       <h2 class="visually-hidden">Trip events</h2>
     </section>`
  )
};

export default class Trip extends AbstractComponent {
  getTemplate() {
    return createTripTemplate();
  }
}
