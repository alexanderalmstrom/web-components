const API = 'https://fakestoreapi.com';

class ProductList extends HTMLElement {
	constructor() {
		// establish prototype chain
		super();

		// attaches shadow tree and returns shadow root reference
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
		const shadow = this.attachShadow({ mode: 'open' });

		// creating a container for the product-list component
		const productListContainer = document.createElement('div');

		// get attribute values from getters
		const title = this.title;

		// adding a class to our container for the sake of clarity
		productListContainer.classList.add('product-list');

		// creating the inner HTML of the editable list element
		productListContainer.innerHTML = `
			<style>
				.title {
					margin-top: 0;
					font-family: sans-serif;
					font-size: 3rem;
				}
			</style>
			<h3 class="title">${title}</h3>
		`;

		// appending the container to the shadow DOM
		shadow.appendChild(productListContainer);
	}

	connectedCallback() {
		console.log('conneted callback!');

		const products = fetch(`${API}/products`)
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
			});
	}

	get title() {
		return this.getAttribute('title') || '';
	}
}

// let the browser know about the custom element
customElements.define('product-list', ProductList);
