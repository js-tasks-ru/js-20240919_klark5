import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {

  prevSortingFieldId;
  sortingDirection = 'desc';

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    super(headersConfig, data);
    this.sorted = sorted;
    this.arrowElement = this._createArrow();
    this._setDefaultArrowElement();
    this._createSortEventListners();    
  }

  _createArrow() {
    const arrowElement = document.createElement('span');
    arrowElement.className = "sortable-table__sort-arrow";
    arrowElement.setAttribute('data-element', "arrow");
    arrowElement.innerHTML = this._createArrowTemplate();
    return arrowElement;
  }

  _createArrowTemplate() {
    return `    
      <span class="sort-arrow"></span>
    `;
  }

  _setArrowElement(target) {
    this.prevSortingFieldId = target;
    [...this.element.querySelectorAll(`[data-id]`)].filter((ele)=>ele.getAttribute('data-id') == target)[0].appendChild(this.arrowElement);
  }

  _setDefaultArrowElement() {
    this._setArrowElement("images");
  }

  _headerOnMouseDownHandler(event) {
    
    if (event.target.getAttribute('data-sortable') == 'false') {
      return;
    }

    const currentSortingFieldId = event.target.closest('[class]', 'sortable-table__cell').getAttribute('data-id');

    if (this.sortingDirection == 'desc' && this.prevSortingFieldId == currentSortingFieldId) {
      this.sortingDirection = 'asc';
    } else {
      this.sortingDirection = 'desc';
    }
    this.prevSortingFieldId = currentSortingFieldId;

    this.sort(currentSortingFieldId, this.sortingDirection);
    
    this._setArrowElement(currentSortingFieldId);   
  }

  _createSortEventListners() {
  
    this._header = [...this.element.querySelectorAll('[data-element]')].filter((ele)=>ele.getAttribute('data-element') == 'header')[0];
    this._header.addEventListener("pointerdown", this._headerOnMouseDownHandler.bind(this));
  }

  destroy() {
    super.destroy();
    this._header.removeEventListener("pointerdown", this._headerOnMouseDownHandler.bind(this));
  }
}
