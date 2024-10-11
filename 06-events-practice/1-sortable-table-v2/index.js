import {default as SortableTableV1} from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {

  prevSortingFieldId;
  sortingDirection = 'asc';

  constructor (headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    super(headersConfig, data);
    this.sorted = sorted;
    this.arrowElement = this._createArrowElement();
    this._setDefaultArrowElement();
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

  _headerOnMouseDownHandler(event) {

    const currentSortingFieldElement = event.target.closest('[class]', 'sortable-table__cell');

    if (currentSortingFieldElement.getAttribute('data-sortable') == 'false') {
      this._prevSortingFieldElement = currentSortingFieldElement;
      return;
    }

    const isPrevFieldWasUnsortable = this._prevSortingFieldElement.dataset.sortable == "false" ? true : false;
           
    if (this.sortingDirection == 'asc' && 
       (this._prevSortingFieldElement.dataset.id == currentSortingFieldElement.dataset.id || 
        isPrevFieldWasUnsortable)) 
    {
      this.sortingDirection = 'desc';
    } else {
      this.sortingDirection = 'asc';
    }

    this._prevSortingFieldElement = currentSortingFieldElement;
    this.sort(currentSortingFieldElement.dataset.id, this.sortingDirection);
    currentSortingFieldElement.appendChild(this.arrowElement);
  }

  _createSortEventListners() {
    this._header.addEventListener("pointerdown", this._varHeaderOnMouseDownHandler);
  }

  render() {
    if (this._header) {
      this._destroyEventListners();
    }
    super.render();
    this._header = this.element.firstElementChild;
    this._prevSortingFieldElement = {dataset: {"sortable": "false", "id": null}};
    this._varHeaderOnMouseDownHandler = this._headerOnMouseDownHandler.bind(this);
    this._createSortEventListners();
  }

  _destroyEventListners() {
    this._header.removeEventListener("pointerdown", this._varHeaderOnMouseDownHandler);
  }

  destroy() {
    this._destroyEventListners();
    super.destroy();
  }
}