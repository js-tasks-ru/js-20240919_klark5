import fetchJson from './utils/fetch-json.js';
import {default as ColumnChartV1} from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {

  constructor(props = {}) {
    super(props);
    const {
      url = '',
    } = props;
    this.chartHeight = 50;
    
    this.today = new Date(Date.now());
    this._createApiUrls(url);    
  }

  _createApiUrls(pn) {
    this.url = new URL(BACKEND_URL);    
    this.url.pathname = pn;
  }

  async update(from, to) {

    this.url.searchParams.set('from', from);    
    this.url.searchParams.set('to', to);
    
    this.element.className = 'column-chart column-chart_loading';
    const newData = await fetchJson(this.url);

    const dataVal = Object.values(newData);

    super.update(dataVal);
    if (dataVal.length > 0) {
      this.element.className = 'column-chart';
    }

    return newData;
  }
}
