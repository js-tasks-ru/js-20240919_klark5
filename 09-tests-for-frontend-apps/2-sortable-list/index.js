export default class SortableList {

  constructor(props) {
    const { items } = props;
    this.items = items;
    this.draggingElement = null;
    this.element = this._createElement();
    this._createEventListeners();
    this._placeholder = null;
  }

  _createEventListeners() {
    this.element.addEventListener('pointerdown', this._onPointerdownDragHandler);
    this.element.addEventListener('pointerdown', this._onPointerdownDeleteHandler);
  }

  _removeEventListeners() {
    this.element.removeEventListener('pointerdown', this._onPointerdownDragHandler);
    this.element.removeEventListener('pointerdown', this._onPointerdownDeleteHandler);
  }

  _onPointerdownDeleteHandler = (e) => {
    if (!e.target.hasAttribute("data-delete-handle")) {
      return;
    }
    e.target.closest("li").remove();
  }

  _onPointerMove = (e) => {

    const prevSib = this._placeholder == this.draggingElement.previousElementSibling ?
      (this.draggingElement.previousElementSibling).previousElementSibling : this.draggingElement.previousElementSibling;
    const nextSib = this._placeholder == this.draggingElement.nextElementSibling ?
      (this.draggingElement.nextElementSibling).nextElementSibling : this.draggingElement.nextElementSibling;


    if (prevSib != null) {
      if (e.clientY < prevSib.getBoundingClientRect().bottom) {
        this.draggingElement.after(prevSib);
        this.draggingElement.after(this._placeholder);
      }
    }
    if (nextSib != null) {
      if (e.clientY > nextSib.getBoundingClientRect().top) {
        this.draggingElement.before(nextSib);
        this.draggingElement.before(this._placeholder);
      }
    }

    this.draggingElement.style.left = e.clientX - this._shiftX - window.scrollX + "px";
    this.draggingElement.style.top = e.clientY - this._shiftY - window.scrollY + "px";
  };


  _onPointerupDragHandler = (e) => {
    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerupDragHandler);
    this.draggingElement.classList.remove("sortable-list__placeholder");
    this.draggingElement.style.zIndex = 1;
    
    this.draggingElement.style.position = "relative";
    this.draggingElement.style.left = 0;
    this.draggingElement.style.top = 0;

    this._placeholder.remove();
    this._placeholder = null;
  }

  _createPlaceHolder(element) {
    const placeholder = document.createElement("li");
    placeholder.className = "sortable-list__item sortable-list__placeholder";
    placeholder.style = element.style;
    placeholder.style.height = 30;
    element.before(placeholder);
    return placeholder;
  }

  _onPointerdownDragHandler = (e) => {

    if (!e.target.hasAttribute("data-grab-handle")) {
      return;
    }

    this.draggingElement = e.target.closest("li");
    this.draggingElement.classList.add("sortable-list__placeholder");
    this.draggingElement.style.zIndex = 2;

    this._shiftX = e.clientX - this.draggingElement.getBoundingClientRect().left;
    this._shiftY = e.clientY - this.draggingElement.getBoundingClientRect().top;

    this.draggingElement.style.position = "absolute";
    this.draggingElement.style.left = e.clientX - this._shiftX - window.scrollX + "px";
    this.draggingElement.style.top = e.clientY - this._shiftY - window.scrollY + "px";
    
    this._placeholder = this._createPlaceHolder(this.draggingElement);

    document.addEventListener("pointermove", this._onPointerMove);
    document.addEventListener("pointerup", this._onPointerupDragHandler);
  }

  _createElement() {
    const element = document.createElement('div');
    element.className = "form-group form-group__wide";
    element.setAttribute("data-element", "sortable-list-container");
    for (const item of this.items) {
      item.classList.add("sortable-list__item");
      item.style.zIndex = 1;
      element.appendChild(item);
    }
    return element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeEventListeners();
    this.remove();
  }
}