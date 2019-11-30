const generateTimeInterval = (timeStart, timeEnd) => {
  const firstTime = new Date(`01/01/2000 ${timeStart}:00`);
  const secondTime = new Date(`01/01/2000 ${timeEnd}:00`);
  const hoursDiff = Math.abs(firstTime.getHours() - secondTime.getHours());
  const MinutesDiff = Math.abs(firstTime.getMinutes() - secondTime.getMinutes());
  return `${hoursDiff}H ${MinutesDiff}M`;
};

const generateOffersMarkup = (offers) => {
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
        &plus;
       &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`
    );
  }).join(`\n`);
};

export const createTripEventTemplate = (event) => {
  const {type, title, timeStart, timeEnd, price, offers} = event;
  const timeInterval = generateTimeInterval(timeStart, timeEnd);

  const offersMarkup = generateOffersMarkup(offers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeEnd}</time>
          </p>
          <p class="event__duration">${timeInterval}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
