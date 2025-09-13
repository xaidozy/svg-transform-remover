export function removeSvgTransform(svgContent: string): string {
	// TODO: Implement SVG transform removal logic
	return svgContent;
}

// Example usage
if (import.meta.main) {
	const exampleSvg = `<svg><g transform="translate(10,20)"></g></svg>`;
	console.log(removeSvgTransform(exampleSvg));
}
