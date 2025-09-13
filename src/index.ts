import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { JSDOM } from 'jsdom';
import { processElement } from './transform';

export function removeSvgTransform(svgContent: string): string {
	// Parse the SVG content using JSDOM
	const dom = new JSDOM(svgContent, { contentType: 'image/svg+xml' });
	const doc = dom.window.document;

	// Start processing from root elements
	Array.from(doc.documentElement.children).forEach((child) => {
		processElement(child as Element);
	});

	// Convert back to string
	return doc.documentElement.outerHTML;
}

// Main function to process SVG files
async function main() {
	try {
		console.log('Starting SVG processing...');
		const inputPath = join(process.cwd(), 'svg_folder', 'input.svg');
		const outputPath = join(process.cwd(), 'svg_folder', 'output.svg');

		console.log('Reading input file from:', inputPath);
		// Read input SVG
		const svgContent = await readFile(inputPath, 'utf-8');
		console.log('Successfully read input SVG file');

		console.log('Processing SVG transformations...');
		// Process SVG
		const processedSvg = removeSvgTransform(svgContent);
		console.log('SVG transformations processed successfully');

		console.log('Writing output file to:', outputPath);
		// Write output SVG
		await writeFile(outputPath, processedSvg, 'utf-8');
		console.log('SVG processing completed successfully!');
	} catch (error) {
		console.error('Error processing SVG:', error);
		// 打印更详细的错误信息
		if (error instanceof Error) {
			console.error('Error details:', error.stack);
		}
		process.exit(1); // 添加错误退出码
	}
}

// Run main function
main().catch((error) => {
	console.error('Unhandled error:', error);
	process.exit(1);
});
