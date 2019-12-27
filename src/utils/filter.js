import {FilterType} from "../const";
import {isOneDay} from "./common";

const getPastPoints = (points, date) => {
  return points.filter((point) => point.dateStart < date && !isOneDay(date, point.dateStart));
};

const getFuturePoints = (points, date) => {
  return points.filter((point) => point.dateStart > date && !isOneDay(date, point.dateStart));
};

export const getPointByFilter = (points, filterType) => {
  console.log(filterType);
  const nowDate = new Date();
  switch (filterType) {
    case FilterType.EVERYTHING :
      return points;
    case FilterType.PAST :
      return getPastPoints(points, nowDate);
    case FilterType.FUTURE :
      return getFuturePoints(points, nowDate)
  }
};
