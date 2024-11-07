export default class DoubleSlider {

  constructor(options = {}) {

    const { min = 10,
      max = 1000,
      formatValue = value => value,
      selected = {}} = options;
    
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    const {from = min, to = max} = selected;
    this.from = from;
    this.to = to;

    this.leftThumbIsMoving = false;
    this.rightThumbIsMoving = false;
    this.leftX = 0;
    this.rightX = 0;

    this.element = this._createElement();
    this.subElements = this._getSubElements();
    this._createEventListeners();
  }

  _createElement() {
    const elem = document.createElement('div');
    elem.innerHTML = this._createElementTemplate();

    return elem.firstElementChild;
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

  _onPointerDownLeftThumbHandler = (e) => {
    this.leftThumbIsMoving = true;
    this.rightThumbIsMoving = false;
  }
  _onPointerUpThumbsHandler = (e) => {
    this.leftThumbIsMoving = false;
    this.rightThumbIsMoving = false;
  }

  _onPointerDownRightThumbHandler = (e) => {
    this.rightThumbIsMoving = true;
    this.leftThumbIsMoving = false;
  }

  _getCurrentSliderValue(thumbPosition) {
    const norm = thumbPosition / 100;
    return this.min + Math.round((this.max - this.min) * norm);
  }

  _onPointerMoveHandler = (e) => {
    const {left, right} = this.subElements.innerSlider.getBoundingClientRect();
    let x = Math.round(((e.clientX - left) / (right - left)) * 100);
    if (x < 0) { x = 0; }
    if (x > 100) { x = 100; } 

    if (this.leftThumbIsMoving == true && (this.rightX + x <= 100)) {
      this.leftX = x;
      this.subElements.leftThumb.style = `left: ${this.leftX}%`;
      this.from = this._getCurrentSliderValue(x);
      this.subElements.from.textContent = `${this.formatValue(this.from)}`;
    } else if (this.rightThumbIsMoving == true && (this.leftX + (100 - x) <= 100)) {
      this.rightX = 100 - x;
      this.subElements.rightThumb.style = `right: ${this.rightX}%`;
      this.to = this._getCurrentSliderValue(x);
      this.subElements.to.textContent = `${this.formatValue(this.to)}`;
    }

    if ((this.leftThumbIsMoving == true || this.rightThumbIsMoving == true) && (this.leftX + this.rightX <= 100)) {
      this.subElements.progress.style = `left: ${this.leftX}%; right: ${this.rightX}%`;
    }

    const custEvent = new Event("range-select");
    custEvent.detail = {from: this.from, to: this.to};
    this.element.dispatchEvent(custEvent);
  }

  _createEventListeners() {
    this.subElements.leftThumb.addEventListener("pointerdown", this._onPointerDownLeftThumbHandler);
    this.subElements.rightThumb.addEventListener("pointerdown", this._onPointerDownRightThumbHandler);
    document.addEventListener("pointerup", this._onPointerUpThumbsHandler);
    document.addEventListener("pointermove", this._onPointerMoveHandler);  
  }

  _destroyEventListeners() {
    this.subElements.leftThumb.removeEventListener("pointerdown", this._onPointerDownLeftThumbHandler);
    this.subElements.rightThumb.removeEventListener("pointerdown", this._onPointerDownRightThumbHandler);
    document.removeEventListener("pointermove", this._onPointerMoveHandler);
    document.removeEventListener("pointerup", this._onPointerUpThumbsHandler);
  }

  _createElementTemplate() {
    return `
        <div class="range-slider">
          <span data-element="from">${this.formatValue(this.from)}</span>
            <div class="range-slider__inner" data-element="innerSlider">
              <span class="range-slider__progress" style="left: 0%; right: 0%" data-element="progress"></span>
              <span class="range-slider__thumb-left" style="left: 0%" data-element="leftThumb"></span>
              <span class="range-slider__thumb-right" style="right: 0%" data-element="rightThumb"></span>
            </div>
          <span data-element="to">${this.formatValue(this.to)}</span>
        </div>`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._destroyEventListeners();
    this.remove();
  }
}
