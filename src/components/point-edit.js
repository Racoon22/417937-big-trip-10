import moment from "moment";

require(`flatpickr/dist/flatpickr.min.css`);
import flatpikr from "flatpickr";
import {OFFERS} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";
import {Destinations, eventTypes} from "../mock/event";
import {Mode} from "../controllers/point";

const generateImagesMarkup = (images) => {
  return images.map((image) => {
    return (
      `<img class="event__photo" src="${image}" alt="Event photo">`
    );
  }).join(`\n`);
};

const generateTypesMarkup = (types, acceptedType) => {
  return types.map((type) => {
    const isChecked = type.name === acceptedType.name;
    return (
      `<div class="event__type-item">
        <input id="event-type-${type.name}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name.toLowerCase()}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}">${type.name}</label>
      </div>`
    );
  }).join(`\n`);
};

const generateOffersMarkup = (offers, acceptedOffers) => {
  return offers.map((offer) => {
    const {title, type, price} = offer;
    const isChecked = acceptedOffers.some((acceptedOffer) => acceptedOffer.type === type);
    return (
      `<div class="event__offer-selector">
       <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}" type="checkbox" value="${type}" name="event-offer" ${isChecked ? `checked` : ``}>
       <label class="event__offer-label" for="event-offer-${type}">
         <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const generateCitiesMarkup = (cities) => {
  return cities.map((city) => {
    return (
      `<option value="${city.place}"></option>`
    );
  });
};

const generateDestinationsMarkup = (type, city) => {
  let placeholder = type.name.charAt(0).toUpperCase() + type.name.slice(1);
  placeholder += type.category === `transfer` ? ` to ` : ` in `;
  const citiesDatalistMarkup = generateCitiesMarkup(Destinations.filter((destination) => destination.place !== city.place));
  return (
    `<div class="event__field-group  event__field-group--destination">
       <label class="event__label  event__type-output" for="event-destination-1">
          ${placeholder}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city.place ? city.place : ``}" list="destination-list-1">
        <datalist id="destination-list-1">
            ${citiesDatalistMarkup}
        </datalist>
     </div>`
  );
};

const generateDetailsMarkup = (city) => {
  const imagesMarkup = city.images && city.images.length > 0 ? generateImagesMarkup(city.images) : ``;
  if (!imagesMarkup && !city.description) {
    return ``;
  }
  return (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${city.description}
          </p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${imagesMarkup}
            </div>
          </div>
        </section>`
  );
};

const generateControlsMarkup = (isFavorite) => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
  );
};

const createFormMarkup = (event, mode, options = {}) => {
  const {type, city, isFavorite} = event;
  const {price, dateStart, dateEnd, offers} = options;

  const formattedDateStart = moment(dateStart).format(`DD/MM/YY HH:mm`);

  const formattedDateEnd = moment(dateEnd);

  let availableOffers = [];
  if (type.offers) {
    availableOffers = OFFERS.filter((offer) => {
      return type.offers.indexOf(offer.type) !== -1;
    });
  }

  const offersMarkup = generateOffersMarkup(availableOffers, offers);
  const destinationMarkup = generateDestinationsMarkup(type, city);
  const detailsMarkup = generateDetailsMarkup(city);

  const transferTypes = generateTypesMarkup(eventTypes.filter((eventType) => eventType.category === `transfer`), type);
  const activityTypes = generateTypesMarkup(eventTypes.filter((eventType) => eventType.category === `activity`), type);

  const deleteButton = mode === Mode.ADDING ? `Cancel` : `Delete`;
  const controlsMarkup = mode === Mode.ADDING ? `` : generateControlsMarkup(isFavorite);

  return (
    `<form class="${mode === Mode.ADDING ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.name}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferTypes}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityTypes}
            </fieldset>
          </div>
        </div>

        ${destinationMarkup}

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${formattedDateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${formattedDateEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${deleteButton}</button>

        ${controlsMarkup}
      </header>
      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        ${detailsMarkup}
      </section>
    </form>`
  );
};

const createEventEditTemplate = (event, mode, options = {}) => {
  const formMarkup = createFormMarkup(event, mode, options);
  return mode === Mode.DEFAULT ? `<li class="trip-events__item">${formMarkup}</li>` : formMarkup;
};

const parseFormData = (formData) => {
  const type = formData.get(`event-type`);
  const offers = OFFERS.filter((offer) => {
    return formData.getAll(`event-offer`).some((acceptedOffer) => {
      return offer.type === acceptedOffer;
    });
  });
  return {
    type: eventTypes.find((eventType) => eventType.name === type),
    city: Destinations.find((destination) => destination.place === formData.get(`event-destination`)),
    dateStart: new Date(formData.get(`event-start-time`)),
    dateEnd: new Date(formData.get(`event-end-time`)),
    isFavorite: formData.get(`event-favorite`),
    price: parseInt(formData.get(`event-price`), 10),
    offers
  };
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, mode = Mode.DEFAULT) {
    super();
    this._mode = mode;
    this._point = point;
    this._price = point.price;
    this._dateStart = point.dateStart;
    this._dateEnd = point.dateEnd;
    this._offers = point.offers;

    this._subscribeOnEvents();
    this._flatpikrDayStart = null;
    this._flatpikrDayEnd = null;

    this._aplayFlatpikr();

    this._closeButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._submitHandler = null;

  }

  getTemplate() {
    return createEventEditTemplate(this._point, this._mode, {
      price: this._price,
      dateStart: this._dateStart,
      dateEnd: this._dateEnd,
      offers: this._offers,
    });
  }

  getData() {
    const form = this._mode === Mode.ADDING ? this.getElement() : this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);
    return parseFormData(formData);
  }

  setSubmitHandler(handler) {
    const formElement = this.getElement();

    if (this._mode === Mode.ADDING) {
      formElement.addEventListener(`submit`, handler);
    } else {
      formElement.querySelector(`form`).addEventListener(`submit`, handler);
    }

    this._submitHandler = handler;
  }


  setCloseButtonClickHandler(handler) {
    if (this._mode === Mode.DEFAULT) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);

      this._closeButtonClickHandler = handler;
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    if (this._mode === Mode.DEFAULT) {
      this.getElement().querySelector(`.event__favorite-checkbox`)
        .addEventListener(`click`, handler);
    }
  }

  removeElement() {
    if (this._flatpikrDayStart) {
      this._flatpikrDayStart.destroy();
      this._flatpikrDayStart = null;
    }

    if (this._flatpikrDayEnd) {
      this._flatpikrDayEnd.destroy();
      this._flatpikrDayEnd = null;
    }

    super.removeElement();
  }

  _aplayFlatpikr() {
    if (this._flatpikrDayStart) {
      this._flatpikrDayStart.destroy();
      this._flatpikrDayStart = null;
    }
    if (this._flatpikrDayEnd) {
      this._flatpikrDayEnd.destroy();
      this._flatpikrDayEnd = null;
    }

    const dateStartElement = this.getElement().querySelector(`#event-start-time`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time`);
    this._flatpikrDayStart = flatpikr(dateStartElement, {
      altInput: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._dateStart,
    });

    this._flatpikrDayEnd = flatpikr(dateEndElement, {
      altInput: true,
      enableTime: true,
      dateFormat: `Y-m-d H:i`,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._dateEnd,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (!evt.target.classList.contains(`event__type-input`)) {
        return;
      }

      const type = evt.target.value;

      if (this._point.type.name === type) {
        return;
      }

      this._point.type = eventTypes.find((eventType) => {
        return eventType.name === type;
      });

      this._offers = [];

      this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._price = evt.target.value;
      this.rerender();
    });

    element.querySelector(`#event-start-time`).addEventListener(`change`, (evt) => {
      this._dateStart = new Date(evt.target.value);
      this.rerender();
    });

    element.querySelector(`#event-end-time`).addEventListener(`change`, (evt) => {
      this._dateEnd = new Date(evt.target.value);
      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const city = evt.target.value;

      if (city === ``) {
        return;
      }

      if (this._point.city.place === city) {
        return;
      }

      const destination = Destinations.find((it) => {
        return it.place === city;
      });

      if (!destination) {
        return;
      }

      this._point.city = destination;
      this.rerender();
    });
  }

  reset() {
    this.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this._aplayFlatpikr();
  }
}
