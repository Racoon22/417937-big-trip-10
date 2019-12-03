import {createEditTemplate} from "./edit";
import {createTripEventTemplate} from "./trip-event";
import {castDateKebabFormat} from "../utils";
import {MonthNames} from "../const";

let isEdit = true;

const createTripDayTemplate = (date, events) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = MonthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString().substr(1);
  let editMarkup = ``;
  let eventsMarkup = ``;
  if (isEdit) {
    editMarkup = createEditTemplate(events[0]);
    eventsMarkup = events.slice(1).map((event) => createTripEventTemplate(event)).join(`\n`);
    isEdit = false;
  } else {
    editMarkup = ``;
    eventsMarkup = events.map((event) => createTripEventTemplate(event)).join(`\n`);
  }
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="2019-03-18">${month} ${year}</time>
      </div>

      <ul class="trip-events__list">
        ${editMarkup}
        ${eventsMarkup}
      </ul>
     </li>`
  );
};

const generateDaysMarkup = (days, events) => {
  return Array.from(days).map((day) => {
    const dayEvents = events.filter((event) => castDateKebabFormat(event.dateStart) === day);
    return createTripDayTemplate(day, dayEvents);
  }).join(`\n`);
};

export const createTripDaysTemplate = (events) => {
  events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const days = new Set(events.map((event) => castDateKebabFormat(event.dateStart)));
  const daysMarkup = generateDaysMarkup(days, events);

  return (
    `<ul class="trip-days">
      ${daysMarkup}
    </ul>`
  );
};
