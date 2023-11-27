class SearchBarComponent extends HTMLElement {
	shadow: ShadowRoot;
	showXButton: boolean;
	delimitation: string;

	constructor() {
		super();
		this.showXButton = false;
		this.delimitation = '';
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = SEARCH_COMPONENT_TEMPLATE + SEARCH_COMPONMENT_STYLES;

		const searchQueryInputField: HTMLInputElement | null = this.shadow.querySelector('#focusSearchInput');
		if (searchQueryInputField) {
			if (location.search) {
				this.updateSearchQuery(searchQueryInputField);
			}
			searchQueryInputField.addEventListener('input', () => {
				this.dispatchUpdate(searchQueryInputField.value);
			});
		}
		const searchButton: HTMLButtonElement | null = this.shadow.querySelector('#searchButton');
		searchButton
			? searchButton.addEventListener('click', (e) => {
					this.dispatchSearch(e);
			  })
			: null;

		const resetButton: HTMLButtonElement | null = this.shadow.querySelector('#resetButton');
		resetButton
			? resetButton.addEventListener('click', (e) => {
					this.resetSearch(e);
			  })
			: null;

		// de values are subject to change here
		//they're what the backenders have told us work for now.

		const limitAll: HTMLInputElement | null = this.shadow.querySelector('.selectAll');
		limitAll
			? limitAll.addEventListener('click', () => {
					this.setDelimitationAndDispatch(this.getPresetFilter('all'));
			  })
			: null;

		const limitTv: HTMLInputElement | null = this.shadow.querySelector('.selectTv');
		limitTv
			? limitTv.addEventListener('click', () => {
					this.setDelimitationAndDispatch(this.getPresetFilter('tv'));
			  })
			: null;

		const limitRadio: HTMLInputElement | null = this.shadow.querySelector('.selectRadio');
		limitRadio
			? limitRadio.addEventListener('click', () => {
					this.setDelimitationAndDispatch(this.getPresetFilter('radio'));
			  })
			: null;
		this.setResetVisibility(false);
	}

	static get observedAttributes() {
		return ['reset-value', 'q', 'lang'];
	}

	private getPresetFilter(key: string): string {
		const filters = {
			all: '',
			tv: 'resource_description:"VideoObject"',
			radio: 'resource_description:"AudioObject"',
		};
		return filters[key as keyof typeof filters] || '';
	}

	connectedCallback() {
		const resetVal = this.getAttribute('reset-value');
		const backgroundImage = this.getAttribute('background-img-url');

		const bgContainer = this.shadow.querySelector('.search-container') as HTMLElement;
		if (bgContainer && backgroundImage) {
			bgContainer.style.backgroundImage = `url(${backgroundImage})`;
		}
		if (resetVal) {
			this.showXButton = JSON.parse(resetVal.toLowerCase());
			this.setResetVisibility(this.showXButton);
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'reset-value') {
			this.showXButton = JSON.parse(newValue.toLowerCase());
			this.setResetVisibility(this.showXButton);
		}
		if (name === 'q') {
			const searchQueryInputField: HTMLInputElement | null = this.shadow.querySelector('#focusSearchInput');
			if (searchQueryInputField) {
				searchQueryInputField.value = newValue;
			}
		}
		if (name === 'lang') {
			if (newValue === 'da') {
				const sr = this.shadow.querySelector('.sr-only');
				sr && (sr.textContent = 'Søg på KB.dk');

				const all = this.shadow.querySelector('.selectAllSpan');
				all && (all.textContent = 'Alt');

				const tv = this.shadow.querySelector('.selectTvSpan');
				tv && (tv.textContent = 'TV');

				const radio = this.shadow.querySelector('.selectRadioSpan');
				radio && (radio.textContent = 'Radio');

				const input = this.shadow.querySelector('#focusSearchInput') as HTMLInputElement;
				input && (input.placeholder = 'Søg på KB.dk');

				const searchSpan = this.shadow.querySelector('searchSpan');
				searchSpan && (searchSpan.textContent = 'Søg');

				const searchHereSpan = this.shadow.querySelector('searchHereSpan');
				searchHereSpan && (searchHereSpan.textContent = 'Søg her');
			} else {
				const sr = this.shadow.querySelector('.sr-only');
				sr && (sr.textContent = 'Search on KB.dk');

				const all = this.shadow.querySelector('.selectAllSpan');
				all && (all.textContent = 'All');

				const tv = this.shadow.querySelector('.selectTvSpan');
				tv && (tv.textContent = 'TV');

				const radio = this.shadow.querySelector('.selectRadioSpan');
				radio && (radio.textContent = 'Radio');

				const input = this.shadow.querySelector('#focusSearchInput') as HTMLInputElement;
				input && (input.placeholder = 'Search at KB.dk');

				const searchSpan = this.shadow.querySelector('searchSpan');
				searchSpan && (searchSpan.textContent = 'Search');

				const searchHereSpan = this.shadow.querySelector('searchHereSpan');
				searchHereSpan && (searchHereSpan.textContent = 'Search here');
			}
		}
	}

	private setDelimitationAndDispatch(value: string) {
		this.delimitation = value;
		const searchQueryInputField: HTMLInputElement | null = this.shadow.querySelector('#focusSearchInput');
		if (searchQueryInputField) {
			this.dispatchUpdate(searchQueryInputField.value);
			this.dispatchSearch();
		}
	}

	private updateSearchQuery(searchQuery: HTMLInputElement) {
		//Note - this does not handle arrays
		try {
			const q = new URL(location.href).searchParams.get('q');
			if (q !== null) {
				searchQuery.value = decodeURIComponent(q.toString());
			}
		} catch (error) {
			if (error instanceof URIError) {
				/**
				 * Specific error: MalformedURI - aka you messsed up the query
				 * and even worse you did it by manipulating the url directly
				 * in the URL bar
				 * */
				window.dispatchEvent(
					new CustomEvent('component-error', {
						detail: { customError: true, message: 'malformeduri', systemError: error.message },
					}),
				);
			} else {
				// General search error happened here so message to user should be generel
				window.dispatchEvent(
					new CustomEvent('component-error', {
						detail: { customError: true, message: 'searchfailed', systemError: null },
					}),
				);
			}
		}
	}

	setResetVisibility(value: boolean) {
		if (value) {
			const reset = this.shadow.querySelector('#resetButton') as HTMLElement;
			reset && (reset.style.display = 'inline-flex');
		} else {
			const reset = this.shadow.querySelector('#resetButton') as HTMLElement;
			reset && (reset.style.display = 'none');
		}
	}

	dispatchUpdate(query: string) {
		//this.setResetVisibility(query.length !== 0);
		window.dispatchEvent(new CustomEvent('query-update', { detail: { query: query, filter: this.delimitation } }));
	}

	dispatchSearch(e?: Event) {
		window.dispatchEvent(new Event('query-search'));
		e?.preventDefault();
	}

	resetSearch(e: Event) {
		const input = this.shadow.querySelector('#focusSearchInput') as HTMLInputElement;
		input && (input.value = '');

		const limitAll: HTMLInputElement | null = this.shadow.querySelector('.selectAll');
		limitAll && (limitAll.checked = true);
		this.delimitation = '';

		this.showXButton = false;
		this.setResetVisibility(this.showXButton);

		window.dispatchEvent(new Event('reset-search'));
		e.preventDefault();
	}
}

const SEARCH_COMPONENT_TEMPLATE = /*html*/ `
<div class="search-box">
	<div class="search-container">
		<div class="container main-12">
			<div class="row">
				<div class="col">
					<form action=" " method=" "  role="search" >
						<div role="group" class="rdl-advanced-search ">
							<div class="rdl-advanced-search-input">
								<label for="focusSearchInput" class="sr-only">Søg på KB.dk</label>
								<input type="search" id="focusSearchInput" class="form-control" placeholder="Søg på KB.dk" name="simpleSearch">
							</div>
							<button id="resetButton" type="button" aria-label="reset" class="btn btn-primary btn-icon">
							<i class="material-icons" aria-hidden="true">close</i>
						</button>
							<div class="rdl-advanced-radio">
								<label for="radio-btn-all">
									<input class="selectAll" type="radio" id="radio-btn-all" name="delimitation" checked value="all">
									<span class="selectAllSpan">Alt</span>
								</label>
								<label for="radio-btn-tv">
									<input class="selectTv" type="radio" id="radio-btn-tv" name="delimitation" value="tv">
									<span class="selectTvSpan">TV</span>
								</label>
								<label for="radio-btn-sound">
									<input class="selectRadio" type="radio" id="radio-btn-sound" name="delimitation" value="sound">
									<span class="selectRadioSpan">Lyd</span>
								</label>
							</div>
							<button id="searchButton" type="submit" aria-label="search" class="btn btn-primary btn-icon">
								<span class="d-none d-search-inline-flex searchSpan">Søg</span>
								<span class="d-inline-flex d-search-none searchHereSpan">Søg her</span>
								<i class="material-icons" aria-hidden="true">search</i>
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	<div class="edge white"></div>
</div>
`;

const SEARCH_COMPONMENT_STYLES = /*css*/ `
	<style>
	/* clears the ‘X’ from Internet Explorer */
		input[type=search]::-ms-clear { display: none; width : 0; height: 0; }
		input[type=search]::-ms-reveal { display: none; width : 0; height: 0; }
		/* clears the ‘X’ from Chrome */
		input[type="search"]::-webkit-search-decoration,
		input[type="search"]::-webkit-search-cancel-button,
		input[type="search"]::-webkit-search-results-button,
		input[type="search"]::-webkit-search-results-decoration { display: none; }
	
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
			max-width:100vw;
			overflow:hidden;
			height:100%;
			display: block;
			/* opacity: 0;
			transition: opacity 0.5s; */
		}

		.search-box { 
			height:100%
		}

		.btn-icon i {
			margin-left: auto;
		}

		.edge {
			height:31px;
		}

		.edge.white {
			width:100%;
			position:absolute;
			background-color:white;
			clip-path: polygon(0 0, 0 100%, 100% 100%);
			margin-top:-30px;
		}

		.search-container {
			display: flex;
			height: 100%;
			background-image: url('https://design.kb.dk/components/assets/images/sourcesets/2/1280x560px_a.jpg');
			align-content: center;
			justify-content: center;
			align-items: center;
			background-size: cover;
			background-position:center;
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
			width: 100%;
			/* display: flex;
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
/* 			padding-right: 12px;
			padding-left: 12px; */
		}
		.row {
			display: flex;
			flex-wrap: wrap;
			width:100%;
			/* margin-right: -12px;
			margin-left: -12px;
			width: 100vw; */
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

		#resetButton {
			position: absolute;
			width: 40px;
			right: 25px;
			padding-left: 0px;
			padding-top: 7px;
			padding-bottom: 7px;
			top: 5px;
			background-color: transparent;
			color: #002E70;
		}

		.btn-icon {
			display: inline-flex;
			align-items: center;
			padding-top: 12px;
			padding-right: 8px;
			padding-bottom: 12px;
		}

		.btn-icon span {
			margin-left: auto;
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

		.rdl-advanced-radio {
			background-color: #002E70;
			display: flex;
			width: calc(100% - 1px);
			height: 48px;
			margin-top: -33px;
			margin-bottom: 22px;
			color: white;
			line-height:48px;
			justify-content: space-evenly
		}

		.rdl-advanced-radio label, .rdl-advanced-radio input {
			cursor: pointer;
		}

		.rdl-advanced-radio label {
			margin-right: 15px;
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
			.rdl-advanced-radio {
			width:50%;
			}
			/* #resetButton {
				right: calc(50% + 10px);
			} */
			.container {
				max-width: 990px;
			}
			/* .rdl-advanced-search-input {
				width: calc(50% - 12px);
				margin-bottom:0px;
			} */
		
			/* .rdl-advanced-search {
				flex-wrap: nowrap;
			} */
			/* .btn-primary {
				width: calc(50% - 12px);
			} */
		}
		/* MEDIA QUERY 800 */
		@media (min-width: 800px) {

			.rdl-advanced-radio {
				position:absolute;
				top: 73px;
				left: 0px;
				margin-top:unset;
				margin-bottom:unset;
				width:auto;
      		    padding: 5px 20px;
				height:30px;
				line-height:30px;
			}

			#resetButton {
				position:unset;
				width:unset;
				right:unset;
				padding: 0 22px;
				background: #fff;
			}

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
				height:71px;
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
				/* flex-direction: column; */
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

customElements.define('kb-searchbar', SearchBarComponent);
