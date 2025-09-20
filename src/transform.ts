import { Matrix, Transform } from './types';
import { createIdentityMatrix, multiplyMatrices } from './matrix';
import { parseTransform } from './parser';
import { transformPath } from './path';
import { roundValue } from './h';

// Create a transformation matrix from SVG transform operations
export function createTransformMatrix(transforms: Transform[]): Matrix {
	let matrix = createIdentityMatrix();

	for (const transform of transforms) {
		let transformMatrix: Matrix;

		switch (transform.type) {
			case 'translate':
				const tx = transform.values[0] || 0;
				const ty = transform.values[1] || 0;
				transformMatrix = {
					a: 1,
					b: 0,
					c: 0,
					d: 1,
					e: roundValue(tx),
					f: roundValue(ty),
				};
				break;
			case 'scale':
				const sx = transform.values[0] || 1;
				const sy = transform.values[1] || sx;
				// 避免过大的缩放值
				const maxScale = 20;
				const safeSx = Math.min(Math.abs(sx), maxScale) * Math.sign(sx);
				const safeSy = Math.min(Math.abs(sy), maxScale) * Math.sign(sy);
				transformMatrix = {
					a: roundValue(safeSx),
					b: 0,
					c: 0,
					d: roundValue(safeSy),
					e: 0,
					f: 0,
				};
				break;
			case 'matrix':
				if (transform.values.length === 6) {
					transformMatrix = {
						a: roundValue(transform.values[0]),
						b: roundValue(transform.values[1]),
						c: roundValue(transform.values[2]),
						d: roundValue(transform.values[3]),
						e: roundValue(transform.values[4]),
						f: roundValue(transform.values[5]),
					};
				} else {
					continue;
				}
				break;
			default:
				continue;
		}

		matrix = multiplyMatrices(matrix, transformMatrix);
	}

	return matrix;
}

// Process an SVG element and its children
export function processElement(
	element: Element,
	parentMatrix: Matrix = createIdentityMatrix(),
): void {
	console.log(
		`Processing element: ${element.tagName}, id: ${element.getAttribute('id') || 'no-id'}`,
	);

	// Get current element's transform
	const transformAttr = element.getAttribute('transform');
	console.log(`Transform attribute: ${transformAttr || 'none'}`);

	const transforms = parseTransform(transformAttr || '');
	console.log(`Parsed transforms:`, transforms);

	// Create matrix for this element's transform
	const elementMatrix = createTransformMatrix(transforms);
	console.log(`Element matrix:`, elementMatrix);

	// Combine with parent matrix
	const currentMatrix = multiplyMatrices(parentMatrix, elementMatrix);
	console.log(`Combined matrix:`, currentMatrix);

	// Remove the transform attribute
	element.removeAttribute('transform');

	// Transform path data if present
	if (element.tagName.toLowerCase() === 'path' && element.getAttribute('d')) {
		const pathData = element.getAttribute('d') || '';
		console.log(`Original path data: ${pathData.substring(0, 100)}...`);
		const transformedPath = transformPath(pathData, currentMatrix);
		console.log(`Transformed path data: ${transformedPath.substring(0, 100)}...`);
		element.setAttribute('d', transformedPath);
	}

	// Process child elements (只处理一次)
	Array.from(element.children).forEach((child) => {
		processElement(child as Element, currentMatrix);
	});

	// // 获取当前元素的变换
	// const transformAttr = element.getAttribute('transform');
	// if (!transformAttr) {
	// 	return;
	// }

	// const transforms = parseTransform(transformAttr);
	// const elementMatrix = createTransformMatrix(transforms);

	// // 移除变换属性
	// element.removeAttribute('transform');

	// // 对路径数据应用变换
	// if (element.tagName.toLowerCase() === 'path' && element.getAttribute('d')) {
	// 	const pathData = element.getAttribute('d') || '';
	// 	element.setAttribute('d', transformPath(pathData, elementMatrix));
	// }
}
