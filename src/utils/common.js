import moment from "moment";
import {pointTypes} from "../const";

export const castTimeFormat = (date) => {
  return moment(date).format(`HH:mm`);
};

export const capitalizeFirstLetter = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

export const slugGenerator = (text) => {
  return text.toLowerCase().replace(/\W/g, `-`);
};

export const placeholderGenerator = (type) => {
  const placeholder = type.charAt(0).toUpperCase() + type.slice(1);
  return placeholder + (pointTypes.transfer.indexOf(type) > -1 ? ` to ` : ` in `);
};
