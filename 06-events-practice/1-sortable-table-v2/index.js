import {default as SortableTableV1} from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {

  prevSortingFieldId;
  sortingDirection = 'asc';

  constructor (headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    super(headersConfig, data);
    this._header = this.element.firstElementChild;
    this.sorted = sorted;

    this._prevSortingFieldElement = {dataset: {"sortable": "false", "id": null}};
    
    this.arrowElement = this._createArrowElement();
    this._setDefaultArrowElement();

    this._varHeaderOnMouseDownHandler = this._headerOnMouseDownHandler.bind(this);
    this._createEventListners();
  }

  _createArrowElement() {
    const arrowElement = document.createElement('span');
    arrowElement.className = "sortable-table__sort-arrow";
    arrowElement.setAttribute('data-element', "arrow");
    arrowElement.innerHTML = this._createArrowTemplate();
    return arrowElement;
  }

  _createArrowTemplate() {
    return `<span class="sort-arrow"></span>`;
  }

  _setDefaultArrowElement() {
    this._header.firstElementChild.appendChild(this.arrowElement);
  }

  _getCurrentSortFieldAndArrow(event) {
    this._currentSortingFieldElement = event.target.closest('[class]', 'sortable-table__cell');

    if (this._currentSortingFieldElement.getAttribute('data-sortable') == 'false') {
      this._prevSortingFieldElement = this._currentSortingFieldElement;
      return;
    }

    const isPrevFieldWasUnsortable = this._prevSortingFieldElement.dataset.sortable == "false" ? true : false;
           
    if (this.sortingDirection == 'asc' && 
       (this._prevSortingFieldElement.dataset.id == this._currentSortingFieldElement.dataset.id || 
        isPrevFieldWasUnsortable)) 
    {
      this.sortingDirection = 'desc';
    } else {
      this.sortingDirection = 'asc';
    }
    this._currentSortingFieldElement.appendChild(this.arrowElement);
    this._prevSortingFieldElement = this._currentSortingFieldElement;
  }

  _headerOnMouseDownHandler(event) {

    this._getCurrentSortFieldAndArrow(event);
    super.sort(this._currentSortingFieldElement.dataset.id, this.sortingDirection);

  }

  _createEventListners() {
    this._header.addEventListener("pointerdown", this._varHeaderOnMouseDownHandler);
  }

  _destroyEventListners() {
    this._header.removeEventListener("pointerdown", this._varHeaderOnMouseDownHandler);
  }

  destroy() {
    this._destroyEventListners();
    super.destroy();
  }
}