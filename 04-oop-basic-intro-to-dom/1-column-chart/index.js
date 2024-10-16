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
    this.subElements = this._getSubElements();

  }
  
  _createElement() {
    const element = document.createElement('div');
    element.innerHTML = this._createTemplate();

    if (this.data.length == 0) {
      const firstElementChild = element.firstElementChild;
      firstElementChild.classList.add('column-chart_loading');
      return firstElementChild;
    }
    
    return element.firstElementChild;
  }

  _createTemplate() {
    return `
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
     ${this._createInnerTemplate()}
    </div>
    `;
  }

  _createInnerTemplate() {
    return `
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

  _getSubElements() {

    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  update(newData) {

    this.data = newData;
    this.value = newData.reduce((a, b)=>a + b, 0);
    
    this.subElements.header.innerHTML = this.formatHeading(this.value);
    this.subElements.body.innerHTML = this._createChartTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
