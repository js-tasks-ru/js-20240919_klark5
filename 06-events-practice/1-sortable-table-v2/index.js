import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {

  prevSortingFieldId;
  sortingDirection = 'asc';

  constructor (headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    super(headersConfig, data);
    this.sorted = sorted;
    this.arrowElement = this._createArrow();
    this._setDefaultArrowElement();
  }

  _createArrow() {
    const arrowElement = document.createElement('span');
    arrowElement.className = "sortable-table__sort-arrow";
    arrowElement.setAttribute('data-element', "arrow");
    arrowElement.innerHTML = this._createArrowTemplate();
    return arrowElement;
  }

  _createArrowTemplate() {
    return `<span class="sort-arrow"></span>`;
  }

  _setArrowElement(target) {    
    SortableTable.findSpecChildElements(this._header, "data-id", target)[0].appendChild(this.arrowElement);
  }

  _setDefaultArrowElement() {
    this._header.firstElementChild.appendChild(this.arrowElement);
    this.prevSortingFieldId = "";
  }

  _isPrevFieldWasUnsortable() {

    const prevSortElemArr = SortableTable.findSpecChildElements(this._header, "data-id", this.prevSortingFieldId);
    if (prevSortElemArr.length == 0) {
      return true;
    } else if (prevSortElemArr[0].hasAttribute("data-sortable")) {
      return prevSortElemArr[0].getAttribute("data-sortable") == "false" ? true : false;
    } else {return true;}
  }

  _headerOnMouseDownHandler(event) {

    const currentSortingField = event.target.closest('[class]', 'sortable-table__cell');
    const currentSortingFieldId = currentSortingField.getAttribute('data-id');

    if (currentSortingField.getAttribute('data-sortable') == 'false') {
      this.prevSortingFieldId = currentSortingFieldId;
      return;
    }
    
    const isPrevFieldWasUnsortable = this._isPrevFieldWasUnsortable();    
    
    if (this.sortingDirection == 'asc' && (this.prevSortingFieldId == currentSortingFieldId || isPrevFieldWasUnsortable)) {
      this.sortingDirection = 'desc';
    } else {
      this.sortingDirection = 'asc';
    }

    this.prevSortingFieldId = currentSortingFieldId;
    this.sort(currentSortingFieldId, this.sortingDirection);
    this._setArrowElement(currentSortingFieldId);
  }

  _createSortEventListners() {
    console.log('_createSortEventListners');

    this._header.addEventListener("pointerdown", this._headerOnMouseDownHandler.bind(this));
  }

  static findSpecChildElements(parentElement, attribute, value) {
    const outValidChildElemntsArr = [];
    for (let elem of [...parentElement.children]) {
      if (elem.matches(`[${attribute}$="${value}"]`)) {outValidChildElemntsArr.push(elem);}
    }

    return outValidChildElemntsArr;
  }

  render() {

    if (this._header) {
      this._destroyEventListners();
    }
    super.render();
    this._header = this.element.firstElementChild;
    this._createSortEventListners();
  }

  _destroyEventListners() {
    this._header.removeEventListener("pointerdown", this._headerOnMouseDownHandler.bind(this));
  }

  destroy() {
    this._destroyEventListners();
    super.destroy();
  }
}
