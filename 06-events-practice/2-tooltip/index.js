class Tooltip {

  static #instance;

  constructor() {
    if (Tooltip.#instance == undefined) {
      Tooltip.#instance = this;
    }
    
    return Tooltip.#instance;
  }

  _tooltipOnMouseMoveHandler = (event) => {
    this.element.style.left = event.clientX + 10 + 'px';
    this.element.style.top = event.clientY + 10 + 'px';
  }

  _bodyOnMouseOverHandler(event) {
    if (event.target.hasAttribute("data-tooltip")) {
      this.element.innerHTML = event.target.getAttribute("data-tooltip");
      event.target.appendChild(this.element);
      this.element.style.position = 'absolute';
      this.element.style.zIndex = 1000;
      document.addEventListener("pointermove", this._tooltipOnMouseMoveHandler);
      this.render();
    }
  }

  _bodyOnMouseOutHandler(event) {
    if (event.target.hasAttribute("data-tooltip")) {
      document.body.removeEventListener("pointermove", this._tooltipOnMouseMoveHandler);
      this.remove();
    }
  }
  _createEventListeners() {
    document.body.addEventListener("pointerover", this._varBodyOnMouseOverHandler);
    document.body.addEventListener("pointerout", this._varbodyOnMouseOutHandler);
  }

  _destroyEventListeners() {
    document.body.removeEventListener("pointerover", this._varBodyOnMouseOverHandler);
    document.body.removeEventListener("pointerout", this._varbodyOnMouseOutHandler);
  }

  initialize() {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this._varBodyOnMouseOverHandler = this._bodyOnMouseOverHandler.bind(this);
    this._varbodyOnMouseOutHandler = this._bodyOnMouseOutHandler.bind(this);
    this._createEventListeners();
  }

  render() {
    document.body.appendChild(this.element);
  }

  remove() {

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this._destroyEventListeners();
    this.remove();
    this.instance = undefined;
  }
}

export default Tooltip;
