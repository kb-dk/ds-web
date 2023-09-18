import gsap from 'gsap';

class AccordionComponent extends HTMLElement {
	shadow: ShadowRoot;
	icon: string | undefined;
	expanded: string | undefined;
	first: string | undefined;
	collapsed: boolean;

	constructor() {
		super();
		this.collapsed = true;
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = ACCORDION_COMPONMENT_TEMPLATE + ACCORDION_COMPONMENT_STYLES;
	}

	static get observedAttributes() {
		return ['locale'];
	}

	connectedCallback() {
		if (this.title) {
			const titleHolder = this.shadow.querySelector('.rdl-accordion-title');
			titleHolder && (titleHolder.innerHTML = this.title);
		}
		if (this.icon) {
			const iconHolder = this.shadow.querySelector('.rdl-accordion-trigger');
			iconHolder && (iconHolder.textContent = this.icon);
		}
		if (this.expanded) {
			const expandable = this.shadow.querySelector('.collapsable');
			expandable && (expandable.textContent = this.expanded);
		}
		if (this.first && this.first === 'true') {
			const container = this.shadow.querySelector('.rdl-accordion-item');
			container && container.classList.add('first');
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'locale') {
			this.lang = newValue;
		}
	}

	toggle = () => {
		this.shadow.querySelector('.rdl-accordion-trigger')?.classList.toggle('collapsed');
		const expand = this.shadow.querySelector('.rdl-accordion-panel');
		if (this.collapsed) {
			expand?.classList.toggle('collapse');
			expand?.classList.toggle('show');
			gsap.to(expand, {
				height: 'auto',
				duration: 0.25,
				onComplete: () => {
					this.collapsed = !this.collapsed;
				},
			});
		} else {
			gsap.to(expand, {
				height: '0px',
				duration: 0.25,
				onComplete: () => {
					this.collapsed = !this.collapsed;
					expand?.classList.toggle('collapse');
					expand?.classList.toggle('show');
				},
			});
		}
		/* expand?.classList.toggle('collapse');
		expand?.classList.toggle('show'); */
	};
}

const ACCORDION_COMPONMENT_TEMPLATE = /*html*/ `
    <div class="rdl-accordion-item">
			<button onclick="this.getRootNode().host.toggle()" id="accordionButton" aria-expanded="false" class="rdl-accordion-trigger collapsed" aria-controls="accordionPanel" data-toggle="collapse" data-target="#accordionPanel" aria-label="">
				<i class="material-icons " aria-hidden="true"></i>

				<span class="rdl-accordion-title">
				</span>
				<i class="material-icons toggle" aria-hidden="true">expand_more</i>
			</button>

			<div 
            role="region" aria-labelledby="accordionButton" class="rdl-accordion-panel collapse" data-parent="#accordionGroup" style="">
			    <span class="collapsable"></span>
			</div>
		</div>

`;

const ACCORDION_COMPONMENT_STYLES = /*css*/ `
	<style>
    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 16px;
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

    .first {
        border-top: 1px solid #d6d6d6;
    }

    button {
        margin: 0;
        padding: 12px 0;
        position: relative;
        display: inline-flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        color: #002E70;
        background-color: transparent;
        border: none;
    }

    .rdl-accordion-item {
        border-bottom: 1px solid #D6D6D6;
        overflow: hidden;
    }
    .collapse:not(.show) {
        display: none;
    }

    .toggle {
        transition: all 0.25s linear 0s;
        transform: rotateZ(180deg);
    }

    .rdl-accordion-trigger.collapsed .toggle {
        transform: rotateZ(0deg);
    }

    .rdl-accordion-panel {
        height:0px;
    }
    
    .rdl-accordion-title {
        margin-bottom: 0;
        margin-right: auto;
        padding-right: 4px;
        text-align: left;
        font-size: 1.125rem;
        color: #002e70;
        text-transform: none;
        font-weight: 700;
        letter-spacing: -.01125rem;
        line-height: 1.5rem;
        font-family: noway,sans-serif;

    }

    .collapsable {
        white-space: pre-wrap;
        padding-bottom: 10px;
        display: inline-block;
    }
	</style>`;

customElements.define('kb-accordion', AccordionComponent);
