import moment from "moment";
import flatpikr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import AbstractSmartComponent from "./abstract-smart-component";
import {Mode} from "../controllers/point";
import {slugGenerator} from "../utils/common";
import {pointTypes} from "../const";

const DefaultData = {
  DeleteButtonText: `Delete`,
  SaveButtonText: `Save`,
  CancelButtonText: `Cancel`
};

const generateImagesMarkup = (images) => {
  return images.map((image) => {
    return (
      `<img class="event__photo" src="${image.src}" alt="${image.description}">`
    );
  }).join(`\n`);
};

const generateTypesMarkup = (types, acceptedType) => {
  return types.map((type) => {
    const isChecked = type === acceptedType;
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type}</label>
      </div>`
    );
  }).join(`\n`);
};

const generateOffersMarkup = (availableOffers, offers) => {
  return availableOffers.map((it) => {
    const {title, price} = it;
    const slug = slugGenerator(title);
    const checkedOffers = offers.find((offer) => offer.title === title);
    return (
      `<div class="event__offer-selector">
       <input class="event__offer-checkbox  visually-hidden" id="event-offer-${slug}" type="checkbox" value="${slug}" name="event-offer" ${checkedOffers ? `checked` : ``}>
       <label class="event__offer-label" for="event-offer-${slug}">
         <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${checkedOffers ? checkedOffers.price : price}</span>
          </label>
        </div>`
    );
  }).join(`\n`);
};

const generateCitiesMarkup = (destinations) => {
  return destinations.map((destination) => {
    return (
      `<option value="${destination.name}"></option>`
    );
  });
};

const generateDestinationsMarkup = (type, destination, isLocked, validation) => {
  let placeholder = type.charAt(0).toUpperCase() + type.slice(1);
  placeholder += pointTypes.transfer.indexOf(type) > -1 ? ` to ` : ` in `;
  const destinationsDatalistMarkup = generateCitiesMarkup(window.destinations.filter((it) => it.name !== destination.name));
  return (
    `<div class="event__field-group  event__field-group--destination">
       <label class="event__label  event__type-output" for="event-destination-1">
          ${placeholder}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name ? destination.name : ``}" list="destination-list" ${isLocked ? `disabled` : ``}> 
        <datalist id="destination-list">
            ${destinationsDatalistMarkup}
        </datalist>
        <span class="event__error-message ${validation.destination ? `` : `visually-hidden`}">Destination incorrect</span>
     </div>`
  );
};

const generateDetailsMarkup = (destination) => {
  const picturesMarkup = destination.pictures && destination.pictures.length > 0 ? generateImagesMarkup(destination.pictures) : ``;
  if (!picturesMarkup && !destination.description) {
    return ``;
  }
  return (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination.description}
          </p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesMarkup}
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

const createFormMarkup = (point, mode, options = {}) => {
  const {type, destination, isFavorite} = point;
  const {price, dateStart, dateEnd, offers, externalData, isLocked, hasError, validation} = options;

  const formattedDateStart = moment(dateStart).format(`DD/MM/YY HH:mm`);

  const formattedDateEnd = moment(dateEnd);

  let availableOffers = window.offers.find((offer) => offer.type === type);

  const offersMarkup = generateOffersMarkup(availableOffers.offers, offers);
  const destinationMarkup = generateDestinationsMarkup(type, destination, isLocked, validation);
  const detailsMarkup = generateDetailsMarkup(destination);

  const transferTypes = generateTypesMarkup(pointTypes.transfer, type);
  const activityTypes = generateTypesMarkup(pointTypes.activity, type);

  const controlsMarkup = mode === Mode.ADDING ? `` : generateControlsMarkup(isFavorite);

  const deleteButtonText = mode === Mode.ADDING ? externalData.CancelButtonText : externalData.DeleteButtonText;
  const saveButtonText = externalData.SaveButtonText;


  return (
    `<form class="${mode === Mode.ADDING ? `trip-events__item` : ``} ${hasError ? `event--error` : ``} event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

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
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${formattedDateStart}" ${isLocked ? `disabled` : ``}>
          &mdash;
          <label class="visually-hidden" for="event-end-time">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${formattedDateEnd}" ${isLocked ? `disabled` : ``}>
          <span class="event__error-message ${validation.time ? `` : `visually-hidden`}">Date incorrect</span>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" ${isLocked ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

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

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, mode = Mode.DEFAULT) {
    super();
    this._mode = mode;
    this._point = point;
    this._price = point.price;
    this._dateStart = point.dateStart;
    this._dateEnd = point.dateEnd;
    this._offers = point.offers;
    this._externalData = DefaultData;

    this._isLocked = false;
    this._hasError = false;

    this._errorTime = false;
    this._errorDestination = false;

    this._subscribeOnEvents();
    this._flatpikrDayStart = null;
    this._flatpikrDayEnd = null;

    this._aplayFlatpikr();

    this._favoriteButtonClickHandler = null;
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
      externalData: this._externalData,
      isLocked: this._isLocked,
      hasError: this._hasError,
      validation: {
        time: this._errorTime,
        destination: this._errorDestination
      }
    });
  }

  getData() {
    const form = this._mode === Mode.ADDING ? this.getElement() : this.getElement().querySelector(`.event--edit`);
    return new FormData(form);
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
    this._favoriteButtonClickHandler = handler;
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

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  isLocked() {
    return this._isLocked;
  }

  isValid() {
    return !this._point.destination.name || this._errorTime || this._errorDestination;
  }

  lock() {
    this._isLocked = true;
  }

  unlock() {
    this._isLocked = false;
  }

  setError() {
    this._hasError = true;
    this.rerender();
  }

  getError() {
    return this._hasError;
  }

  clearError() {
    this._hasError = false;
    this.rerender();
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
      if (this._isLocked) {
        return;
      }
      if (!evt.target.classList.contains(`event__type-input`)) {
        return;
      }

      const type = evt.target.value;

      if (this._point.type === type) {
        return;
      }

      this._point.type = type;

      this._offers = [];

      this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._price = evt.target.value;
      this.rerender();
    });

    element.querySelector(`#event-start-time`).addEventListener(`change`, (evt) => {
      this._dateStart = new Date(evt.target.value);
      this.validateTime();
      this.rerender();
    });

    element.querySelector(`#event-end-time`).addEventListener(`change`, (evt) => {
      this._dateEnd = new Date(evt.target.value);
      this.validateTime();

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const destinationValue = evt.target.value;
      this._errorDestination = false;

      if (this._point.destination.name === destinationValue) {
        return;
      }

      const destination = window.destinations.find((it) => {
        return it.name === destinationValue;
      });

      if (!destination) {
        this._errorDestination = true;
        this._point.destination = {};
        this.rerender();
        return;
      }

      this._point.destination = destination;
      this.rerender();
    });
  }

  validateTime() {
    this._errorTime = false;
    this._errorTime = this._dateEnd <= this._dateStart;
  }

  reset() {
    this.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this._aplayFlatpikr();
  }
}

