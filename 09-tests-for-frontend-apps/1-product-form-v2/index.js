import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import {default as ProductFormV1} from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm extends ProductFormV1 {
  constructor (productId) {
    super(productId);
  }

  _createImageTemplate(imageElement) {
    return `<li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${escapeHtml(imageElement.url)}">
            <input type="hidden" name="source" value="${escapeHtml(imageElement.source)}">
            <span>
              <img src="icon-grab.svg" data-grab-handle="" alt="grab">
              <img class="sortable-table__cell-img" alt="Image" referrerpolicy="no-referrer" src="${escapeHtml(imageElement.url)}">
              <span>${escapeHtml(imageElement.source)}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle="delete" alt="delete">
            </button></li>
     `;
  }
  _uploadImageButtonClickHandler() {

    const url = new URL('https://api.imgur.com');
    url.pathname = '3/image';
    
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'image';
    input.type = 'file';
    form.append(input);

    const handler = (e) => {
      const source = e.target.files[0].name;
      const formData = new FormData(form);
      fetchJson(url, {
        method: "POST",
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,        
      }).then((response)=>{

        let toAdd = document.createElement('div');
        toAdd.innerHTML = this._createImageTemplate({
          url: response.data.link,
          source: source
        });
        toAdd = toAdd.firstElementChild;
  
        this.subElements.imageListContainer.querySelector('[data-element="sortable-list-container"]').appendChild(toAdd);
      }).finally(()=>{
        input.removeEventListener('change', handler);
      });
    };

    input.addEventListener('change', handler);
    
    input.click(); 

  }

  _setProductFields() {
    this.form.elements["title"].value = this.productObj.title;
    this.form.elements["quantity"].value = this.productObj.quantity;
    this.form.elements["price"].value = this.productObj.price;
    this.form.elements["description"].value = this.productObj.description;
    this.form.elements["discount"].value = this.productObj.discount;
    this.form.elements["subcategory"].value = this.productObj.subcategory;
    this.form.elements["status"].value = this.productObj.status;

    const imageContainer = this.element.querySelector(`[data-element="imageListContainer"]`).firstElementChild;

    const sortableList = new SortableList({
      items: this.productObj.images.map(image => {
        const element = document.createElement('div');

        element.innerHTML = this._createImageTemplate(image);

        return element.firstElementChild;
      })
    });
    imageContainer.appendChild(sortableList.element);
  }
}
