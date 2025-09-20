import SVGPathCommander, { pathToString, TransformObject, transformPath } from 'svg-path-commander';

// Create a transformation matrix from SVG transform operations
// export function createTransformMatrix(transforms: Transform[]): Matrix {
// 	let matrix = createIdentityMatrix();

// 	for (const transform of transforms) {
// 		let transformMatrix: Matrix;

// 		switch (transform.type) {
// 			case 'translate':
// 				const tx = transform.values[0] || 0;
// 				const ty = transform.values[1] || 0;
// 				transformMatrix = {
// 					a: 1,
// 					b: 0,
// 					c: 0,
// 					d: 1,
// 					e: roundValue(tx),
// 					f: roundValue(ty),
// 				};
// 				break;
// 			case 'scale':
// 				const sx = transform.values[0] || 1;
// 				const sy = transform.values[1] || sx;
// 				// 避免过大的缩放值
// 				const maxScale = 20;
// 				const safeSx = Math.min(Math.abs(sx), maxScale) * Math.sign(sx);
// 				const safeSy = Math.min(Math.abs(sy), maxScale) * Math.sign(sy);
// 				transformMatrix = {
// 					a: roundValue(safeSx),
// 					b: 0,
// 					c: 0,
// 					d: roundValue(safeSy),
// 					e: 0,
// 					f: 0,
// 				};
// 				break;
// 			case 'matrix':
// 				if (transform.values.length === 6) {
// 					transformMatrix = {
// 						a: roundValue(transform.values[0]),
// 						b: roundValue(transform.values[1]),
// 						c: roundValue(transform.values[2]),
// 						d: roundValue(transform.values[3]),
// 						e: roundValue(transform.values[4]),
// 						f: roundValue(transform.values[5]),
// 					};
// 				} else {
// 					continue;
// 				}
// 				break;
// 			default:
// 				continue;
// 		}

// 		matrix = multiplyMatrices(matrix, transformMatrix);
// 	}

// 	return matrix;
// }

// Process an SVG element and its children
export function processElement(element: Element, parentTransforms: string = ''): void {
	console.log(
		`Processing element: ${element.tagName}, id: ${element.getAttribute('id') || 'no-id'}`,
	);

	// Get current element's transform
	const transformAttr = element.getAttribute('transform');
	console.log(`Transform attribute: ${transformAttr || 'none'}`);

	// const transforms = parseTransform(transformAttr || '');
	// console.log(`Parsed transforms:`, transforms);

	// Create matrix for this element's transform
	// const elementMatrix = createTransformMatrix(transforms);
	// console.log(`Element matrix:`, elementMatrix);

	// Combine with parent matrix
	// const currentMatrix = multiplyMatrices(parentMatrix, elementMatrix);
	const currentTransforms = parentTransforms + (transformAttr ? ' ' + transformAttr : '');
	console.log(`Combined transforms:`, currentTransforms);

	// Remove the transform attribute
	element.removeAttribute('transform');

	// Transform path data if present
	if (element.tagName.toLowerCase() === 'path' && element.getAttribute('d')) {
		const pathData = element.getAttribute('d') || '';
		console.log(`Original path data: ${pathData.substring(0, 100)}...`);
		// const domMatrix = new (window.DOMMatrix || SVGPathCommander.DOMMatrix)([
		// 	currentMatrix.a,
		// 	currentMatrix.b,
		// 	currentMatrix.c,
		// 	currentMatrix.d,
		// 	currentMatrix.e,
		// 	currentMatrix.f,
		// ]);

		// 应用矩阵变换
		const transformedObj =
			/* new SVGPathCommander(pathData)
			.transform({ matrix: domMatrix })
			.toString();
 */ parseTransformStringToObject(currentTransforms);
		const transformedPathArr = transformPath(pathData, transformedObj);
		const transformedPath = pathToString(transformedPathArr);
		console.log(`Transformed path data: ${transformedPath.substring(0, 100)}...`);
		element.setAttribute('d', transformedPath);
	}

	// Process child elements (只处理一次)
	Array.from(element.children).forEach((child) => {
		processElement(child as Element, currentTransforms);
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

function parseTransformStringToObject(transformStr: string): Partial<TransformObject> {
	const result: Partial<TransformObject> = {};
	const regex = /(\w+)\(([^)]+)\)/g;
	let match;
	let skewX: number[] = [];
	let skewY: number[] = [];

	while ((match = regex.exec(transformStr)) !== null) {
		const type = match[1];
		const values = match[2]
			.split(/[\s,]+/)
			.map(Number)
			.filter((v) => !isNaN(v));
		switch (type) {
			case 'translate':
				result.translate = result.translate
					? ([] as number[]).concat(result.translate as number[], values)
					: values.length === 1
					? values[0]
					: values;
				break;
			case 'scale':
				result.scale = result.scale
					? ([] as number[]).concat(result.scale as number[], values)
					: values.length === 1
					? values[0]
					: values;
				break;
			case 'rotate':
				result.rotate = result.rotate
					? ([] as number[]).concat(result.rotate as number[], values)
					: values.length === 1
					? values[0]
					: values;
				break;
			case 'skewX':
				skewX.push(values[0]);
				break;
			case 'skewY':
				skewY.push(values[0]);
				break;
			case 'origin':
				result.origin = result.origin
					? ([] as number[]).concat(result.origin as number[], values)
					: values;
				break;
		}
	}
	// 合并所有 skewX/skewY 到 skew
	if (skewX.length && skewY.length) {
		result.skew = [skewX.reduce((a, b) => a + b, 0), skewY.reduce((a, b) => a + b, 0)];
	} else if (skewX.length) {
		result.skew = skewX.length === 1 ? skewX[0] : skewX;
	} else if (skewY.length) {
		result.skew = skewY.length === 1 ? [0, skewY[0]] : [0, skewY.reduce((a, b) => a + b, 0)];
	}
	return result;
}
