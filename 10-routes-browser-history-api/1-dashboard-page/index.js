import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  
  constructor() {
    this.element = this._createElement();
    this.subElements = this._getSubElements();

    this.sortableTableData = [];

    this.element.addEventListener('date-select', this._dataSelectHandler);

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

  _dataSelectHandler = async (e) => {
    this.selectedDates = e.detail;

    this.ordersChart.update(this.selectedDates.from, this.selectedDates.to);
    this.salesChart.update(this.selectedDates.from, this.selectedDates.to);
    this.customersChart.update(this.selectedDates.from, this.selectedDates.to);
  }

  _initComponents() {
    this.rangePicker = new RangePicker();

    this.ordersChart = new ColumnChart({
      url: 'api/dashboard/orders',
      range: this.selectedDates,
      label: 'orders',
      link: '#'
    });
    this.salesChart = new ColumnChart({
      url: 'api/dashboard/sales',
      range: this.selectedDates,
      label: 'sales',
      link: '#'
    });
    this.customersChart = new ColumnChart({
      url: 'api/dashboard/customers',
      range: this.selectedDates,
      label: 'customers',
      link: '#'
    });

    this.sortableTable = new SortableTable(header, {url: 'api/dashboard/bestsellers'});
  }

  _createElement() {
    const element = document.createElement('div');
    element.innerHTML = this._createElementTemplate();

    return element.firstElementChild;
  }

  _createElementTemplate() {
    return `
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>

        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">

        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">

      </div>
    </div>`;
  }

  async render() {
    this._initComponents();
    this.selectedDates = this.rangePicker.selected;
    
    this.subElements.rangePicker.appendChild(this.rangePicker.element);
    this.subElements.ordersChart.appendChild(this.ordersChart.element);
    this.subElements.salesChart.appendChild(this.salesChart.element);
    this.subElements.customersChart.appendChild(this.customersChart.element);
    this.subElements.sortableTable.appendChild(this.sortableTable.element);    

    return this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.removeEventListener('date-select', this._dataSelectHandler);
    this.remove();
  }
}