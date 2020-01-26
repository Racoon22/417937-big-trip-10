import moment from "moment";
import {pointTypes} from "../const";

export const castTimeFormat = (date) => {
  return moment(date).format(`HH:mm`);
};

export const capitalizeFirstLetter = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

export const isOneDay = (firstDate, secondDate) => {
  const a = moment(firstDate);
  const b = moment(secondDate);
  return a.diff(b, `days`) === 0 && firstDate.getDate() === secondDate.getDate();
};

export const slugGenerator = (text) => {
  return text.toLowerCase().replace(/\W/g, `-`);
};

export const placeholderGenerator = (type) => {
  const placeholder = type.charAt(0).toUpperCase() + type.slice(1);
  return placeholder + (pointTypes.transfer.indexOf(type) > -1 ? ` to ` : ` in `);
};
