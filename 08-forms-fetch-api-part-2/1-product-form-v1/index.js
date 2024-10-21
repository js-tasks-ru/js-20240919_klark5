import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor (productId) {

    this.productId = productId;
    this.element = this._createElement();
    this.subElements = this._getSubElements();
    this.productObj = {
      title: "",
      description: "",
      status: "",
      subcategory: "",
      quantity: "",
      price: "",
      discount: "",
      images: [],
    };
    this.form = this.element.firstElementChild;

    this.subcategory = this.element.querySelector('#subcategory');

    this._varSubmitButtonClickHandler = this._submitButtonClickHandler.bind(this);
    this._varDeleteImageButtonClickHandler = this._deleteImageClickHanlder.bind(this);
    this._varUploadImageButtonClickHandler = this._uploadImageButtonClickHandler.bind(this);

    this._createEventListeners();    
  }

  _createEventListeners() {
    this.element.querySelector('#save').addEventListener("click", this._varSubmitButtonClickHandler);
    this.element.querySelector('#imageListContainer').addEventListener("click", this._varDeleteImageButtonClickHandler);
    this.element.querySelector('#uploadImage').addEventListener("click", this._varUploadImageButtonClickHandler);
  }

  
  _submitButtonClickHandler(event) {
    
    event.preventDefault();
    this.save();  
  }

  _deleteImageClickHanlder(event) {
    const imageToDeleteElement = event.target.closest('[class="sortable-list"]');
    imageToDeleteElement.remove();
  }

  _uploadImageButtonClickHandler(event) {
    //TODO
    const url = new URL('https://api.imgur.com');
    url.pathname = '3/image';
    const f = event.target.files[0];

    fetchJson(url, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: f,        
    }).then(console.log);

  }

  _createElement() {
    const element = document.createElement('div');
    element.innerHTML = this._createElementTemplate();
    
    return element.firstElementChild;
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

  async _createOptionsTemplate() {
    const url = this._createApiUrls('api/rest/categories');
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');

    const respJSON = await fetchJson(url);
    const catArr = [];
    for (const category of respJSON) {
      catArr.push(category.subcategories.map((subcategory) => (
        `<option value="${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`
      )).join(''));
    }

    return catArr.join('');
  }

  _createElementTemplate() {
    return `
    <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" id="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" id="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer" id="imageListContainer">
          
        </div>
        <button type="button" name="uploadImage" id="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
          <select class="form-control" name="subcategory" id="subcategory">
         
          </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" id="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status" id="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" id="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `;
  }

  _createImageTemplate(imageElement) {
    return `<ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${imageElement.url}">
            <input type="hidden" name="source" value="${imageElement.source}">
            <span>
              <img src="icon-grab.svg" data-grab-handle="" alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${imageElement.url}">
              <span>${imageElement.source}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle="delete" alt="delete">
            </button></li></ul>
     `;
  }

  _createImagesTemplate() {
    
    return this.productObj["images"].map((image) => this._createImageTemplate(image)).join('');
  }

  _setProductFields() {
    this.form.elements["title"].value = this.productObj.title;
    this.form.elements["quantity"].value = this.productObj.quantity;
    this.form.elements["price"].value = this.productObj.price;
    this.form.elements["description"].value = this.productObj.description;
    this.form.elements["discount"].value = this.productObj.discount;
    this.form.elements["subcategory"].value = this.productObj.subcategory;
    this.form.elements["status"].value = this.productObj.status;

    const imageContainer = this.element.querySelector(`[data-element="imageListContainer"]`);
    imageContainer.innerHTML = this._createImagesTemplate();
  }

  async _getProduct() {
    const url = this._createApiUrls('api/rest/products');
    url.searchParams.set('id', this.productId);
    this.productObj = (await fetchJson(url))[0];
    this._setProductFields();
  }

  _createApiUrls(pn) {
    const url = new URL(BACKEND_URL);    
    url.pathname = pn;
    return url;
  }

  async render () {
    
    this.subcategory.innerHTML = await this._createOptionsTemplate();
    if (this.productId) {
      this._getProduct();
    }
    return this.element;
  }

  _getFormFields() {
    const formData = new FormData(this.form);
    const resultObj = {
      id: this.productId,
      title: formData.get('title'),
      description: formData.get('description'),
      status: +formData.get('status'),
      subcategory: formData.get('subcategory'),
      quantity: +formData.get('quantity'),
      price: +formData.get('price'),
      discount: +formData.get('discount'),
      images: [],
    };

    for (const i in formData.getAll('url')) {
      resultObj.images.push({
        url: formData.getAll('url')[i],
        source: formData.getAll('source')[i]
      });
    }
    return resultObj;
  }

  async save() {
    this.element.dispatchEvent(new Event("product-updated"));

    if (this.form.elements["title"].value != "" && this.form.elements["description"].value != "") {    

      await fetchJson(this._createApiUrls('api/rest/products'), {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this._getFormFields()),        
      });
    }
    else { alert("Название и описание должны быть заполнены."); }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
