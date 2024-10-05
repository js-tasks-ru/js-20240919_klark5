export default class NotificationMessage {

  msgText;
  static lastShownElement;

  constructor(msgText = "", props = {}) {
    const {
      duration = 1000,
      type = 'success'
    } = props;

    this.duration = duration;
    this.type = type;
    this.msgText = msgText;

    this.element = this._createElement();
  }

  _createElement() {
    const element = document.createElement('div');
    element.classList = [`notification ${this.type}`];
    element.style = "--value:20s";
    element.innerHTML = this._createTemplate();

    return element;
  }

  _createTemplate() {
    return `
     <div class="timer"></div>
     <div class="inner-wrapper">
       <div class="notification-header">${this.type}</div>
      <div class="notification-body">
      ${this.msgText}
      </div>
     </div>
   `;
  }

  show(target = document.body) {   
    target.append(this.element);
    NotificationMessage.lastShownElement = this;
    setTimeout(()=>this.destroy(), this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
