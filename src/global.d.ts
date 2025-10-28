declare global {
	interface Window {
		headingObserver?: IntersectionObserver;
		scrollCleanup?: () => void;
		applyTheme?: (isDark: boolean) => void;
	}
}

export {};
