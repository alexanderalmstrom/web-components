import { createElement } from '../lib/dom';

const API = 'https://fakestoreapi.com';

const settings = {
	currency: 'USD',
};

class ProductList extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
	}

	static get observedAttributes() {
		return ['loading', 'products'];
	}

	get title() {
		return this.getAttribute('title') || ''; 
	}

	get currency() {
		return this.getAttribute('currency') || settings.currency;
	}

	get loading() {
		return JSON.parse(this.getAttribute("loading"));
	}

	set loading(value) {
		this.setAttribute('loading', JSON.stringify(value));
	}

	get products() {
		return JSON.parse(this.getAttribute('products'));
	}

	set products(value) {
		this.setAttribute('products', JSON.stringify(value));
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		this.shadowRoot.innerHTML = '';
		this.shadowRoot.appendChild(<Products {...this} />);
  }

	async connectedCallback() {
		await this.fetchProducts();
	}

	async fetchProducts() {
		this.loading = true;

		try {
			const response = await fetch(`${API}/products`);
			const json = await response.json();

			this.products = json;
		} catch (err) {
			console.error(err);
		}

		this.loading = false;
	}
}

/** @jsx createElement */

const Products = ({ loading, title, products, currency }) => {
	const style = document.createElement('style');

	const styles = `
		:host {
			font-family: sans-serif;
		}

		img {
			max-width: 100%;
			height: auto;
			border: 0;
		}

		.heading {
			margin-top: 0;
			font-size: 2rem;
		}

		.list {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-gap: 3rem;
		}

		.product {
			display: grid;
			grid-template-rows: max-content auto;
			grid-template-areas: "image" "content";
		}

		.product__image {
			grid-area: image;
		}

		.product__content {
			grid-area: content;
			padding: 1rem;
		}

		.product__title {
			font-size: 1.2rem;
		}
	`;

	style.innerHTML = styles;

	if (loading) {
		return <p>Loading...</p>
	} else {
		return (
			<div>
				{style}
				<h3 class="heading">{title}</h3>
				<div class="list">
					{products.map((product) => {
						return (
							<div class="product">
								<img class="product__image" src={product.image} alt={product.title} />
								<div class="product__content">
									<h3 class="product__title">{product.title}</h3>
									<div class="product__price">{product.price} {currency}</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		);
	}
};

customElements.define('product-list', ProductList);
