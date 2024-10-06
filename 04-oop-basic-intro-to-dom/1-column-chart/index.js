export default class ColumnChart {

  element;
  chartHeight = 50;

  constructor(props = {}) {

    const {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = (val) => val,
    } = props;

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    
    this.element = this._createElement();

  }
  
  _createElement() {
    const element = document.createElement('div');
    element.innerHTML = this._createTemplate();

    if (this.data.length == 0) {
      const firstElementChild = element.firstElementChild;
      firstElementChild.classList.add('column-chart_loading');
      return firstElementChild;
    }
    
    return element;
  }
  _createTemplate() {
    return `
    <div class="column-chart" style="--chart-height: 50">
      <div class="column-chart__title">
        Total ${this.label}
        ${this._createLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
        ${this.formatHeading(this.value)}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this._createChartTemplate()}
        </div>
      </div>
    </div>
    `;
  }

  _getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;
  
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  _createChartTemplate() {
    
    return this._getColumnProps(this.data).map(({value, percent}) => (
      `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
    )).join('');
  }
  _createLink() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }
    return '';
  }

  update(newData) {
    this.data = newData;
    this.element.innerHTML = this._createTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
