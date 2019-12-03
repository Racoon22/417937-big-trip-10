import {MonthNames} from "../const";

const getCities = (events) => {
  let cities = events.map((event) => event.city);
  return new Set(cities);
};

const getDuration = (events) => {
  const dateStart = events[0].dateStart;
  const dateFinish = events[events.length - 1].dateStart;
  let duration;
  if (dateStart.getMonth() === dateFinish.getMonth()) {
    duration = `${MonthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${dateFinish.getDate()}`;
  } else {
    duration = `${MonthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${MonthNames[dateFinish.getMonth()]} ${dateFinish.getDate()}`;
  }
  return duration;
};


export const createTripInfoTemplate = (events) => {
  events.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const cities = Array.from(getCities(events));
  const title = cities > 3 ? `${cities.shift()} &mdash; ${cities.pop()}` : cities.join(` &mdash; `);
  const duration = getDuration(events);

  return (
    `<div class="trip-info__main">
         <h1 class="trip-info__title">${title}</h1>
           <p class="trip-info__dates">${duration}</p>
     </div>`
  );
};
