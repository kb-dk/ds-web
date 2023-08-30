class SearchComponent extends HTMLElement {
	shadow: ShadowRoot;
	query: string;

	constructor() {
		super();
		this.query = '';
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = SEARCH_COMPONENT_TEMPLATE + SEARCH_COMPONMENT_STYLES;

		const searchQuery: HTMLInputElement | null = this.shadow.querySelector('#focusSearchInput');
		if (searchQuery) {
			if (location.search) {
				const q = location.search.split('&')[0].split('=')[1];
				searchQuery.value = q;
			}
			searchQuery.addEventListener('input', () => {
				this.dispatchUpdate(searchQuery.value);
			});
		}
		const searchButton: HTMLButtonElement | null = this.shadow.querySelector('#searchButton');
		searchButton
			? searchButton.addEventListener('click', (e) => {
					this.dispatchSearch(e);
			  })
			: null;
	}

	static get observedAttributes() {
		return ['q'];
	}
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'q') {
			this.query = newValue;
		}
	}

	dispatchUpdate(query: string) {
		window.dispatchEvent(new CustomEvent('query-update', { detail: { query: query } }));
	}

	dispatchSearch(e: Event) {
		window.dispatchEvent(new Event('query-search'));
		e.preventDefault();
	}
}

const SEARCH_COMPONENT_TEMPLATE = /*html*/ `
	<div class="container main-12">
		<div class="row">
			<div class="col">
				<form action=" " method=" "  role="search" >
					<div role="group" class="rdl-advanced-search ">
						<div class="rdl-advanced-search-input">
							<label for="focusSearchInput" class="sr-only">Søg på KB.dk</label>
							<input type="search" id="focusSearchInput" class="form-control" placeholder="Søg på KB.dk" name="simpleSearch">
						</div>
						<button id="searchButton" type="submit" aria-label="" class="btn btn-primary btn-icon">
							<span class="d-none d-search-inline-flex">Søg</span>
							<span class="d-inline-flex d-search-none">Søg her</span>
							<i class="material-icons " aria-hidden="true">search</i>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
`;

const SEARCH_COMPONMENT_STYLES = /*css*/ `
	<style>
	  .material-icons {
		font-family: 'Material Icons';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-feature-settings: 'liga';
		-webkit-font-smoothing: antialiased;
	  }
	  
		:host {
			display: block;
			/* opacity: 0;
			transition: opacity 0.5s; */
		}

		.btn-icon i {
			margin-left: auto;
		}
		
		.btn-icon {
			display: inline-flex;
			align-items: center;
			padding-top: 12px;
			padding-right: 8px;
			padding-bottom: 12px;
		}

		textarea:focus, input:focus{
			outline: none;
		}
		/* For .rdl-advanced-search and .rdl-spot-search .rdl-advanced-search */
		.container {
			padding-right: 12px;
			padding-left: 12px;
			margin-right: auto;
			margin-left: auto;
/* 			display: flex;
			align-content: center;
			flex-wrap: wrap; */
		}	
		
		.rdl-advanced-search {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			color: #171717;
			margin-bottom: 12px;
			border: 0px solid #F5F5F5;
			box-shadow: 0 0px 0px rgba(0, 0, 0, 0.24);
			border-radius: 0px;
		}
		.rdl-advanced-search-input {
			margin-bottom: 32px;
    		width: 100%;
		}
		.form-control {
			width: 100%;
			padding: 6px 12px;
     		border: 1px solid #757575; 
			border-radius: 2px;
			height: 3rem;
			padding: 0.375rem 0.75rem;
		}
		.col {
			flex-basis: 0;
			flex-grow: 1;
			max-width: 100%;
			position: relative;
			width: 100%;
			padding-right: 12px;
			padding-left: 12px;
		}
		.row {
			display: flex;
			flex-wrap: wrap;
			margin-right: -12px;
			margin-left: -12px;
		}

		.btn-primary {
			display: block;
			width: 100%;
			color: #fff;
			padding: 0 22px;
			background: #002E70;;
			margin-bottom: 0;
			border-radius: 2px;
			padding: 13px 2.875rem;
			font-size: 1rem;
			line-height: 1.25rem;
			border-radius: 0.25rem;
			cursor: pointer;
			border: none;
		}

		.btn-icon {
			display: inline-flex;
			align-items: center;
			padding-top: 12px;
			padding-right: 8px;
			padding-bottom: 12px;
		}

		.btn-icon span {
			margin-left: auto;<
		}
		
		.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.d-none {
			display:none;
		}
		/* MEDIA QUERY 480 */
		@media (min-width: 480px) {
			.container {
				max-width: 640px;
			}
		}
		/* MEDIA QUERY 640 */
		@media (min-width: 640px) {
			.container {
				max-width: 990px;
			}
			.rdl-advanced-search-input {
				width: calc(50% - 12px);
				margin-bottom:0px;
			}
		
			.rdl-advanced-search {
				flex-wrap: nowrap;
			}
			.btn-primary {
				width: calc(50% - 12px);
			}
		}
		/* MEDIA QUERY 800 */
		@media (min-width: 800px) {
			.d-search-none {
    			display: none;
			}

			.d-none {
				display:block;
			}

			.btn-primary {
				width: auto;
				margin-bottom: 0;
				color: #002E70;
   				background-color: #fff;
				flex-direction: column-reverse;
				align-items: center;
				justify-content: center;
				color: #002E70;
				padding: 0 22px;
				background: #fff;
				margin-bottom: 0;
				border-radius: 0;
				cursor: pointer;
				border: none;
				display:flex;
			}

			.rdl-advanced-search {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				color: #171717;
				margin-bottom: 12px;
				flex-wrap: nowrap;
				border: 1px solid #F5F5F5; 
				box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
				border-radius: 2px;
			}
			.rdl-advanced-search-input {
				width: 100%;
			}
			.form-control {
				padding: 20px 12px;
				height: 72px;
				border: none;
				display: block;
				width: 100%;
				font-size: 1rem;
				font-weight: 400;
				line-height: 1.5;
				color: #495057;
				background-color: #fff;
				background-clip: padding-box;
				border-radius: 2px;
				transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
			}
		}
		/* MEDIA QUERY 990 */
		@media (min-width: 990px) {
			.container {
				display: flex;
				flex-direction: column;
				max-width: 1150px;
			}
		}
		/* MEDIA QUERY 1150 */
		@media (min-width: 1150px) {
			.container {
				max-width: 1280px;
			}
		}
		/* MEDIA QUERY 1280 */
		@media (min-width: 1280px) {
			.container {
				/* padding-right: 0;
				padding-left: 0; */
			}
		}
	</style>`;

customElements.define('kb-searchbar', SearchComponent);
