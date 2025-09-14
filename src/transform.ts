import { Matrix, Transform } from './types';
import { createIdentityMatrix, multiplyMatrices } from './matrix';
import { parseTransform } from './parser';
import { transformPath } from './path';

// Create a transformation matrix from SVG transform operations
export function createTransformMatrix(transforms: Transform[]): Matrix {
	// 反转变换数组，因为SVG变换是从右到左应用的
	const reversedTransforms = [...transforms].reverse();
	// xaidozy
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
					e: tx,
					f: ty,
				};
				break;
			case 'scale':
				const sx = transform.values[0] || 1;
				const sy = transform.values[1] || sx;
				transformMatrix = {
					a: sx,
					b: 0,
					c: 0,
					d: sy,
					e: 0,
					f: 0,
				};
				break;
			case 'matrix':
				if (transform.values.length === 6) {
					transformMatrix = {
						a: transform.values[0],
						b: transform.values[1],
						c: transform.values[2],
						d: transform.values[3],
						e: transform.values[4],
						f: transform.values[5],
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
	// Get current element's transform
	const transformAttr = element.getAttribute('transform');
	const transforms = parseTransform(transformAttr || '');

	// Create matrix for this element's transform
	const elementMatrix = createTransformMatrix(transforms);

	// Combine with parent matrix
	const currentMatrix = multiplyMatrices(parentMatrix, elementMatrix);

	// Remove the transform attribute
	element.removeAttribute('transform');

	// Transform path data if present
	if (element.tagName.toLowerCase() === 'path' && element.getAttribute('d')) {
		const pathData = element.getAttribute('d') || '';
		element.setAttribute('d', transformPath(pathData, currentMatrix));
	}

	// Process child elements
	Array.from(element.children).forEach((child) => {
		processElement(child as Element, currentMatrix);
	});
}
