export const createFocusTrap = (container: HTMLElement, onEscape?: () => void) => {
	let previousFocus: HTMLElement | null = null;

	//all our selectors for focus elements
	const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

	const handleKeydown = (e: KeyboardEvent) => {
		if (!container) return;

		// we close the the entire trap on escape.
		if (e.key === 'Escape') {
			onEscape?.();
			return;
		}
		//otherwise, we only care about tap when we change focus.
		if (e.key !== 'Tab') return;

		const focusables = [...container.querySelectorAll<HTMLElement>(focusableSelector)].filter(
			(el) => el.offsetParent !== null,
		);

		if (!focusables.length) return;

		const first = focusables[0];
		const last = focusables[focusables.length - 1];

		if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		}
	};

	const activate = () => {
		previousFocus = document.activeElement as HTMLElement;
		container.addEventListener('keydown', handleKeydown);
		container.querySelector<HTMLElement>(focusableSelector)?.focus();
	};

	// When we deactivate, we retore focus to the elemet it was on before we opened.
	const deactivate = () => {
		container.removeEventListener('keydown', handleKeydown);
		previousFocus?.focus();
	};

	return {
		activate,
		deactivate,
	};
};
