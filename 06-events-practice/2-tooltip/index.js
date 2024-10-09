class Tooltip {

  static #instance;

  constructor() {
    if (Tooltip.#instance == undefined) {
      Tooltip.#instance = this;
    }
    
    return Tooltip.#instance;
  }
  _bodyOnMouseOverHandler(event) {
    if (event.target.hasAttribute("data-tooltip")) {
      this.element.innerHTML = event.target.getAttribute("data-tooltip");
      event.target.appendChild(this.element);
    }
  }

  _bodyOnMouseOutHandler(event) {
    if (event.target.hasAttribute("data-tooltip")) {
      this.remove();
    }

  }
  _createEventListners() {

    document.body.addEventListener("pointerover", this._bodyOnMouseOverHandler.bind(this));
    document.body.addEventListener("pointerout", this._bodyOnMouseOutHandler.bind(this));
  }

  _destroyEventListners() {
    document.body.removeEventListener("pointerover", this._bodyOnMouseOverHandler.bind(this));
    document.body.removeEventListener("pointerout", this._bodyOnMouseOverHandler.bind(this));
  }

  initialize() {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this._createEventListners();
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
    this._destroyEventListners;
    this.remove();
    this.instance = undefined;
  }
}

export default Tooltip;
