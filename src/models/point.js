import moment from "moment"

export default class Point {
  constructor(data) {
    this.price = data[`base_price`];
    this.id = data[`id`];
    this.dateStart = new Date(data[`date_from`]);
    this.dateEnd = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      'base_price': this.price,
      'id': this.id,
      'date_from': moment(this.dateStart).toJSON(),
      'date_to': moment(this.dateEnd).toJSON(),
      'destination': this.destination,
      'offers': this.offers,
      'is_favorite': this.isFavorite,
      'type': this.type,
    }
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
