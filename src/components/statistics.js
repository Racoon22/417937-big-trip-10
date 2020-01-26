import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const getUniqItems = (item, index, items) => {
  return items.indexOf(item) === index;
};

const renderMoneyChart = (moneyCtx, points) => {
  const types = points.map((point) => point.type).filter(getUniqItems);
  const moneyCountByTypes = types.map((type) => {
    return points.filter((point) => point.type === type)
      .reduce((acc, point) => {
        return acc + point.price;
      }, 0);
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: moneyCountByTypes,
        backgroundColor: `#ffffff`,
        borderColor: `#ffffff`,
        barPercentage: 0.5,
        barThickness: 50,
        maxBarThickness: 50,
        minBarLength: 2,
        pointBackgroundColor: `#000000`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value}€`;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          anchor: `end`,
          align: `left`,
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            fontColor: `#000000`,
            fontSize: 14,
            display: true,
            callback: (value) => {
              return value.toUpperCase();
            }
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: `left`,
        text: `MONEY`,
        fontSize: 16,
        fontColor: `#000000`,
      },
    },
  });
};

const renderTransportChart = (transportCtx, points) => {
  const transportCountByTypes = points.reduce((obj, p) => {
    if (obj[p.type]) {
      obj[p.type]++;
    } else {
      obj[p.type] = 1;
    }
    return obj;
  }, {});

  return new Chart(transportCtx, {
    plugins: [Object.keys(transportCountByTypes)],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(transportCountByTypes),
      datasets: [{
        data: Object.values(transportCountByTypes),
        backgroundColor: `#ffffff`,
        borderColor: `#ffffff`,
        barPercentage: 0.5,
        barThickness: 50,
        maxBarThickness: 50,
        minBarLength: 2,
        pointBackgroundColor: `#000000`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value}x`;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          anchor: `end`,
          align: `left`,
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            fontColor: `#000000`,
            fontSize: 14,
            display: true,
            callback: (value) => {
              return value.toUpperCase();
            }
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: `left`,
        text: `TRANSPORT`,
        fontSize: 16,
        fontColor: `#000000`,
      },
    },
  });
};

const renderTimeChart = (transportCtx, points) => {
  const types = points.map((point) => point.type).filter(getUniqItems);
  const transportCountByTypes = types.map((type) => {
    return Math.ceil(points.filter((point) => point.type === type).reduce((acc, point) => {
      return acc + (point.dateEnd - point.dateStart);
    }, 0) / 3600000);
  });

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: transportCountByTypes,
        backgroundColor: `#ffffff`,
        borderColor: `#ffffff`,
        barPercentage: 0.5,
        barThickness: 50,
        maxBarThickness: 50,
        minBarLength: 2,
        pointBackgroundColor: `#000000`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value}H`;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          anchor: `end`,
          align: `left`,
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            fontColor: `#000000`,
            fontSize: 14,
            display: true,
            callback: (value) => {
              return value.toUpperCase();
            }
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: `left`,
        text: `TIME SPENT`,
        fontSize: 16,
        fontColor: `#000000`,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2>Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas> 
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._transportChart = null;
    this._timeChart = null;

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points.getPointsAll());
    this._transportChart = renderTransportChart(transportCtx, this._points.getPointsAll());
    this._timeChart = renderTimeChart(timeCtx, this._points.getPointsAll());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }

  recoveryListeners() {
  }

}
