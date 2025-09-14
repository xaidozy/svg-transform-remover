import { Matrix } from './types';

// Create an identity matrix
export function createIdentityMatrix(): Matrix {
	return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

// Multiply two transformation matrices
export function multiplyMatrices(m1: Matrix, m2: Matrix): Matrix {
	const a = {
		a: m1.a * m2.a + m1.b * m2.c,
		b: m1.a * m2.b + m1.b * m2.d,
		c: m1.c * m2.a + m1.d * m2.c,
		d: m1.c * m2.b + m1.d * m2.d,
		e: m1.e * m2.a + m1.f * m2.c + m2.e,
		f: m1.e * m2.b + m1.f * m2.d + m2.f,
	}; // xaidozy
	return {
		a: m1.a * m2.a + m1.c * m2.b,
		b: m1.b * m2.a + m1.d * m2.b,
		c: m1.a * m2.c + m1.c * m2.d,
		d: m1.b * m2.c + m1.d * m2.d,
		e: m1.a * m2.e + m1.c * m2.f + m1.e,
		f: m1.b * m2.e + m1.d * m2.d + m1.f,
	};
}

// Transform a point by a matrix
export function transformPoint(x: number, y: number, matrix: Matrix): [number, number] {
	// Prevent coordinate values from becoming too large
	function clampValue(value: number): number {
		const MAX_VALUE = 1000000;
		return Math.max(Math.min(value, MAX_VALUE), -MAX_VALUE);
	}

	const newX = x * matrix.a + y * matrix.c + matrix.e;
	const newY = x * matrix.b + y * matrix.d + matrix.f;

	return [clampValue(newX), clampValue(newY)];
}
