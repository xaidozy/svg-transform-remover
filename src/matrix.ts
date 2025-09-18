import { roundValue } from './h';
import { Matrix } from './types';

// Create an identity matrix
export function createIdentityMatrix(): Matrix {
	return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

// Multiply two transformation matrices
export function multiplyMatrices(m1: Matrix, m2: Matrix): Matrix {
	// 保持原来的正确矩阵乘法实现
	return {
		a: m1.a * m2.a + m1.c * m2.b,
		b: m1.b * m2.a + m1.d * m2.b,
		c: m1.a * m2.c + m1.c * m2.d,
		d: m1.b * m2.c + m1.d * m2.d,
		e: m1.a * m2.e + m1.c * m2.f + m1.e,
		f: m1.b * m2.e + m1.d * m2.f + m1.f,
	};
}

// Transform a point by a matrix
export function transformPoint(x: number, y: number, matrix: Matrix): [number, number] {
	// 更精确的数值处理

	console.log(`Transforming point (${x}, ${y}) with matrix:`, matrix);
	const newX = roundValue(x * matrix.a + y * matrix.c + matrix.e);
	const newY = roundValue(x * matrix.b + y * matrix.d + matrix.f);

	console.log(`Transformed point: (${newX}, ${newY})`);
	return [newX, newY] as [number, number];
}
