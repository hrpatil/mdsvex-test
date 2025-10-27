declare global {
	interface Window {
		headingObserver?: IntersectionObserver;
		scrollCleanup?: () => void;
	}
}

export {};
