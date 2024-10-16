import fetchJson from './utils/fetch-json.js';
import {default as SortableTableV2} from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false,
  } = {}) {
    super(headersConfig, {data, sorted});

    this._destroyEventListners();
    this._varDocumentOnScrollHandler = this._documentOnScrollHandler.bind(this);
    this._createEventListners();

    this.dataFrameBorder = 0;
    this.dataFrameSize = 15;
    this.isSortLocally = isSortLocally;

    this.firstSortableFieldObj = this.headerConfig.filter((obj)=>obj.sortable == true)[0];

    this._currentSortingFieldElement = this.subElements.header.querySelector(`[data-id=${this.firstSortableFieldObj.id}]`);

    this._createApiUrls(url);

    this._initLoadData();
    
  }

  async _initLoadData() {
    
    this._setURLParams(this.firstSortableFieldObj.id, this.sortingDirection, 
      this.dataFrameBorder, this.dataFrameBorder + this.dataFrameSize);
    this.data = await fetchJson(this.url);
    super.render();
  }

  async _documentOnScrollHandler(event) {

    const windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {

      await this.render(this._currentSortingFieldElement.dataset.id, 
        this.sortingDirection, 0, this.dataFrameBorder + this.dataFrameSize);   

      this.dataFrameBorder += this.dataFrameSize;
    }
  }

  _showLoadingLine() {
    this.subElements.loading.style.display = "block";
  }

  _hideLoadingLine() {
    this.subElements.loading.style.display = "none";
  }

  _showEmptyPlaceholder() {
    this.subElements.emptyPlaceholder = "block";
  }

  _hideEmptyPlaceholder() {
    this.subElements.emptyPlaceholder.style.display = "none";
  }

  _createEventListners() {
    super._createEventListners();
    window.addEventListener("scroll", this._varDocumentOnScrollHandler);
  }

  _createApiUrls(pn) {
    this.url = new URL(BACKEND_URL);    
    this.url.pathname = pn;
  }

  _headerOnMouseDownHandler(event) {
    this._getCurrentSortFieldAndArrow(event);
    if (this.isSortLocally == true) {
      this.sortOnClient(this._currentSortingFieldElement.dataset.id, this.sortingDirection);
    } else {
      this.sortOnServer(this._currentSortingFieldElement.dataset.id, this.sortingDirection);
    }
  }

  sortOnClient (id, order) {
    super.sort(id, order);
  }

  sortOnServer (id, order) {
    this.dataFrameBorder = 0;
    this._getDataFromServer(id, order, this.dataFrameBorder, 
      this.dataFrameBorder + this.dataFrameSize).then(this._updateFields.bind(this));   
    
  }

  _setURLParams(sortField, order, start, end) {

    this.url.searchParams.set('_sort', sortField);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);
  }

  async _getDataFromServer(sortField, order, start, end) {
    this._setURLParams(sortField, order, start, end);
    this.data = await fetchJson(this.url);
    if (this.data.length == 0) {
      this._showEmptyPlaceholder();
    }
  }

  async render(sortField = this.firstSortableFieldObj, order = this.sortingDirection,
    start = this.dataFrameBorder, end = this.dataFrameBorder + this.dataFrameSize)
  {
    this._hideEmptyPlaceholder();
    this._showLoadingLine();
    await this._getDataFromServer(sortField, order, start, end);
    this._hideLoadingLine();
    super.render();
  }
}