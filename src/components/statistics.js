import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const renderMoneyChart = (moneyCtx, points) => {

  const types = points.map((point) => point.type.name).filter(getUniqItems);
  const moneyCountByTypes = types.map((type) => {
    return points.filter((point) => point.type.name === type)
      .reduce((acc, point) => {
        return acc + point.price;
      }, 0);
  });

  console.log(types);

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
            return '€' + value;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          align: `end`,
          textAlign: `end`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 18,
          },
          gridLines: {
            display: false,
            drawBorder: false
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
        text: `MONEY`,
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
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>      </div>
    </section>`
  )
};

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
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

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points.getPoints());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
  }

  recoveryListeners() {
  }

}
