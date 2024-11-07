export default class RangePicker {

  constructor(options = {
    from: Date(2000, 1, 1),
    to: Date(2000, 1, 2)
  }) {
    this.fromDate = options.from;
    this.toDate = options.to;
    this._nextMonthFromDate = new Date(this.fromDate);
    this._nextMonthFromDate.setDate(1);
    this._nextMonthFromDate.setMonth(this.fromDate.getMonth() + 1);
    
    this.element = this._createElement();
    this.subElements = this._getSubElements();
    this._createEventListeners();
    this._prevPickedDateElement;
  }

  _createEventListeners() {
    this.subElements.input.addEventListener('click', this._onInputClickHandler);
    this.subElements.selector.addEventListener('click', this._onDateClickHandler);
  }

  _removeEventListeners() {
    this.subElements.input.removeEventListener('click', this._onInputClickHandler);
    this.subElements.selector.removeEventListener('click', this._onDateClickHandler);
  }

  _onInputClickHandler = (e) => {

    if (this.element.classList.contains("rangepicker_open")) {
      this.element.classList.remove("rangepicker_open");
      this._hideSelector();
      if (this._prevPickedDateElement) {
        this.fromDate = this._oldFromDate;
        this.toDate = this._oldToDate;
        this._nextMonthFromDate = this._oldNextMonth;
        this._prevPickedDateElement = null;
      } else {
        this.subElements.input.innerHTML = this._createRangePickerInputTemplate();
      }
    } else {
      this.element.classList.add("rangepicker_open");
      this._showSelector();
    }
  }

  _removeSelected() {

    const selectedBetween = this.subElements.selector.querySelectorAll('.rangepicker__selected-between');
    const selectedFrom = this.subElements.selector.querySelector('.rangepicker__selected-from');
    const selectedTo = this.subElements.selector.querySelector('.rangepicker__selected-to');

    for (const sel of selectedBetween) {
      sel.classList.remove('rangepicker__selected-between');
    }
    
    if (selectedFrom) {
      selectedFrom.classList.remove('rangepicker__selected-from');
    }

    if (selectedTo) {
      selectedTo.classList.remove('rangepicker__selected-to');
    }
  }

  _onSelectorControlRightClickHandler = (e) => {
    this._nextMonthFromDate.setMonth(this._nextMonthFromDate.getMonth() + 1);
    this._hideSelector();
    this._showSelector();
  }

  _onSelectorControlLeftClickHandler = (e) => {
    this._nextMonthFromDate.setMonth(this._nextMonthFromDate.getMonth() - 1);
    this._hideSelector();
    this._showSelector();
  }

  _onDateClickHandler = (e) => {
    const _clickedDateElement = e.target.closest('.rangepicker__cell');
    if (!_clickedDateElement) {
      return;
    }
    const newDate = new Date(_clickedDateElement.dataset.value);
    newDate.setHours(0);
    newDate.setMinutes(0);
    if (this._prevPickedDateElement) {
      if (newDate >= this.fromDate) {
        this.toDate = newDate;
        _clickedDateElement.classList.add('rangepicker__selected-to');
      } else {
        this.toDate = this.fromDate;
        this.fromDate = newDate;
        _clickedDateElement.classList.add('rangepicker__selected-from');
        this._prevPickedDateElement.classList.remove('rangepicker__selected-from');
        this._prevPickedDateElement.classList.add('rangepicker__selected-to');
      }
      this._prevPickedDateElement = null;
      this._nextMonthFromDate.setDate(1);
      this._nextMonthFromDate.setFullYear(this.fromDate.getFullYear());
      this._nextMonthFromDate.setMonth(this.fromDate.getMonth() + 1);

    } else {
      this._removeSelected();
      _clickedDateElement.classList.add('rangepicker__selected-from');

      this._prevPickedDateElement = _clickedDateElement;
      this._oldFromDate = this.fromDate;
      this._oldToDate = this.toDate;
      this._oldNextMonth = this._nextMonthFromDate;

      this.fromDate = newDate;
      this.toDate = newDate;         
    }    
  }

  daysInMonths = (year, month) => (new Date(year, month + 1, 0)).getDate()

  _initDateGridTemplate(date) {

    const currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const resGrid = []; const daysInMonth = this.daysInMonths(currentDate.getFullYear(), currentDate.getMonth());
    let selection = ''; let startFrom = `style="--start-from: ${currentDate.getDay() == 0 ? "7" : currentDate.getDay()}"`;
    let zeroMonth = ''; let zeroDate = '';
    for (let day = 0; day < daysInMonth; ++day) {

      if (currentDate.getFullYear() == this.fromDate.getFullYear() &&
          currentDate.getMonth() == this.fromDate.getMonth() &&
          currentDate.getDate() == this.fromDate.getDate()) {

        selection += ' rangepicker__selected-from';

      } else if (currentDate > this.fromDate && currentDate < this.toDate) {

        selection = 'rangepicker__selected-between';
      }

      if (
        currentDate.getFullYear() == this.toDate.getFullYear() &&
        currentDate.getMonth() == this.toDate.getMonth() &&
        currentDate.getDate() == this.toDate.getDate()) {
        selection += ' rangepicker__selected-to';       
      } 
      if (currentDate < this.fromDate || this.toDate < currentDate) { selection = ''; }

      if (currentDate.getMonth() < 9) {
        zeroMonth = '0';
      }
      if (currentDate.getDate() < 10) {
        zeroDate = '0';
      }

      resGrid.push(`<button type="button" 
            class="rangepicker__cell ${selection}" 
            data-value="${currentDate.getFullYear()}-${zeroMonth}${currentDate.getMonth() + 1}-${zeroDate}${currentDate.getDate() }T00:00:00.000Z" 
            ${startFrom}}>${currentDate.getDate()}</button>`);
      startFrom = ''; zeroDate = ''; selection = '';
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return resGrid.join('');
  }

  _createCalendarTemplate(date) {
    return `    
        <div class="rangepicker__month-indicator">
          <time datetime="${date.toLocaleDateString('en-En', {month: 'long'})}">${date.toLocaleDateString('ru-Ru', {month: 'long'})}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
          ${this._initDateGridTemplate(date)}
        </div>`;
  }

  _showSelector() {

    if (this.subElements.selector.innerHTML == '') {
      this.subElements.selector.innerHTML = `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left" id="selector-control-left"></div>
      <div class="rangepicker__selector-control-right" id="selector-control-right"></div>
      <div class="rangepicker__calendar" id="calendar-left"></div>
      <div class="rangepicker__calendar" id="calendar-right"></div>`;
    }
    const currentMonthDate = new Date(this._nextMonthFromDate);
    currentMonthDate.setDate(currentMonthDate.getDate() - 1);

    this.subElements.selector.querySelector("#calendar-left").innerHTML = this._createCalendarTemplate(currentMonthDate);
    this.subElements.selector.querySelector("#calendar-right").innerHTML = this._createCalendarTemplate(this._nextMonthFromDate);

    this.subElements.selector.querySelector('#selector-control-right')
     .addEventListener('click', this._onSelectorControlRightClickHandler);
    this.subElements.selector.querySelector('#selector-control-left')
     .addEventListener('click', this._onSelectorControlLeftClickHandler); 
  }

  _hideSelector() {
    this.subElements.selector.querySelector('#selector-control-right')
     .removeEventListener('click', this._onSelectorControlRightClickHandler);
    this.subElements.selector.querySelector('#selector-control-left')
     .removeEventListener('click', this._onSelectorControlLeftClickHandler); 

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

  _createElement() {
    const element = document.createElement('div');
    element.innerHTML = this._createTemplate();

    return element.firstElementChild;
  }

  _createRangePickerInputTemplate() {
    return `
      <span data-element="from">${this.fromDate.toLocaleDateString('ru-Ru', {day: 'numeric', month: 'numeric', year: 'numeric'})}</span> -
      <span data-element="to">${this.toDate.toLocaleDateString('ru-Ru', {day: 'numeric', month: 'numeric', year: 'numeric'})}</span>
    `;
  }

  _createTemplate() {
    return `<div class="rangepicker">
    <div class="rangepicker__input" data-element="input">
      ${this._createRangePickerInputTemplate()}
    </div>
    <div class="rangepicker__selector" data-element="selector"></div>
  </div>`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeEventListeners();
    this.remove();
  }
}