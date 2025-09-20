// import { Matrix } from './types';
// import { transformPoint } from './matrix';
// import { transformPath as commanderTransformPath } from 'svg-path-commander';

// // 验证命令参数的数量和格式
// function validateCommandParams(command: string, numbers: number[]): void {
// 	const paramCounts: { [key: string]: number[] } = {
// 		m: [2], // moveto (followed by optional lineto pairs)
// 		l: [2], // lineto
// 		h: [1], // horizontal lineto
// 		v: [1], // vertical lineto
// 		c: [6], // cubic Bézier
// 		s: [4], // smooth cubic Bézier
// 		q: [4], // quadratic Bézier
// 		t: [2], // smooth quadratic Bézier
// 		a: [7], // elliptical arc
// 		z: [0], // closepath
// 	};

// 	const cmd = command.toLowerCase();
// 	const expectedCounts = paramCounts[cmd];
// 	if (!expectedCounts) {
// 		throw new Error(`Unknown command: ${command}`);
// 	}

// 	if (cmd === 'z' && numbers.length > 0) {
// 		throw new Error(`Command 'z' doesn't accept parameters`);
// 	}

// 	if (cmd === 'm' && numbers.length > 2) {
// 		// 对于 moveto 命令后面的额外参数，每对都被当作 lineto
// 		if (numbers.length % 2 !== 0) {
// 			throw new Error(
// 				`Invalid parameter count for '${command}': ${numbers.length} (should be multiple of 2)`,
// 			);
// 		}
// 		return;
// 	}

// 	const expectedCount = expectedCounts[0];
// 	if (expectedCount === 0) {
// 		if (numbers.length > 0) {
// 			throw new Error(`Command '${command}' doesn't accept parameters`);
// 		}
// 	} else if (numbers.length % expectedCount !== 0) {
// 		throw new Error(
// 			`Invalid parameter count for '${command}': ${numbers.length} (should be multiple of ${expectedCount})`,
// 		);
// 	}

// 	if (cmd === 'a') {
// 		// 检查弧形命令的特殊参数
// 		for (let i = 0; i < numbers.length; i += 7) {
// 			if (numbers[i] < 0 || numbers[i + 1] < 0) {
// 				throw new Error(`Arc radii cannot be negative`);
// 			}
// 			if (![0, 1].includes(numbers[i + 3]) || ![0, 1].includes(numbers[i + 4])) {
// 				throw new Error(`Arc flags must be 0 or 1`);
// 			}
// 		}
// 	}
// }

// // Store current position while processing path data
// interface PathContext {
// 	currentX: number;
// 	currentY: number;
// 	startX: number;
// 	startY: number;
// 	lastControlX: number;
// 	lastControlY: number;
// 	lastCommand: string;
// }

// // Transform an SVG path data string
// import { transformPath } from 'svg-path-commander';

// // matrix: { a, b, c, d, e, f }
// export function mytransformPath(d: string, matrix: Matrix): string {
// 	return '';
// 	// commanderTransformPath 支持直接应用 SVG 矩阵
// 	// return commanderTransformPath(d, [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]);
// }

// // Process a single path command
// function processCommand(cmd: string, matrix: Matrix, ctx: PathContext): string {
// 	const type = cmd[0];
// 	// 改进数字解析，支持更多格式
// 	const numbers =
// 		cmd
// 			.slice(1)
// 			.trim()
// 			// 支持科学计数法，负数，小数点开头等格式
// 			.match(/[+-]?(?:\d*\.\d+|\d+\.?(?:[eE][+-]?\d+)?)/g)
// 			?.map(Number) || [];
// 	const isRelative = type.toLowerCase() === type;
// 	const command = type.toLowerCase();

// 	// 验证参数
// 	validateCommandParams(command, numbers);

// 	// Convert relative coordinates to absolute
// 	const coords = convertToAbsolute(command, numbers, ctx, isRelative);

// 	// Transform coordinates
// 	const transformed = transformCoordinates(command, coords, matrix, ctx);

// 	// Convert back to relative if needed
// 	// const final = isRelative ? convertToRelative(command, transformed, ctx) : transformed;
// 	// xaidozy
// 	const final = transformed; // 只输出绝对坐标

// 	// Format the command
// 	// return type + final.map((n) => n.toFixed(6)).join(' ');
// 	return type.toUpperCase() + final.map((n) => n.toFixed(6)).join(' ');
// }

// // Convert relative coordinates to absolute
// function convertToAbsolute(
// 	command: string,
// 	coords: number[],
// 	ctx: PathContext,
// 	isRelative: boolean,
// ): number[] {
// 	if (!isRelative) return [...coords];

// 	const result = [...coords];

// 	switch (command) {
// 		case 'm':
// 		case 'l':
// 		case 't':
// 			for (let i = 0; i < result.length; i += 2) {
// 				result[i] += ctx.currentX;
// 				result[i + 1] += ctx.currentY;
// 			}
// 			break;
// 		case 'h':
// 			for (let i = 0; i < result.length; i++) {
// 				result[i] += ctx.currentX;
// 			}
// 			break;
// 		case 'v':
// 			for (let i = 0; i < result.length; i++) {
// 				result[i] += ctx.currentY;
// 			}
// 			break;
// 		case 'c':
// 		case 's':
// 			for (let i = 0; i < result.length; i += command === 'c' ? 6 : 4) {
// 				result[i] += ctx.currentX;
// 				result[i + 1] += ctx.currentY;
// 				result[i + 2] += ctx.currentX;
// 				result[i + 3] += ctx.currentY;
// 				if (command === 'c') {
// 					result[i + 4] += ctx.currentX;
// 					result[i + 5] += ctx.currentY;
// 				}
// 			}
// 			break;
// 		case 'q':
// 		case 't':
// 			for (let i = 0; i < result.length; i += command === 'q' ? 4 : 2) {
// 				result[i] += ctx.currentX;
// 				result[i + 1] += ctx.currentY;
// 				if (command === 'q') {
// 					result[i + 2] += ctx.currentX;
// 					result[i + 3] += ctx.currentY;
// 				}
// 			}
// 			break;
// 		case 'a':
// 			for (let i = 0; i < result.length; i += 7) {
// 				// rx, ry, x-axis-rotation 保持不变
// 				// large-arc-flag, sweep-flag 保持不变
// 				result[i + 5] += ctx.currentX; // x
// 				result[i + 6] += ctx.currentY; // y
// 			}
// 			break;
// 	}

// 	return result;
// }

// // Transform coordinates using the matrix
// function transformCoordinates(
// 	command: string,
// 	coords: number[],
// 	matrix: Matrix,
// 	ctx: PathContext,
// ): number[] {
// 	const result = [...coords];

// 	switch (command) {
// 		case 'm':
// 			for (let i = 0; i < coords.length; i += 2) {
// 				const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
// 				result[i] = x;
// 				result[i + 1] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 				if (i === 0) {
// 					ctx.startX = x;
// 					ctx.startY = y;
// 				}
// 			}
// 			break;
// 		case 'l':
// 			for (let i = 0; i < coords.length; i += 2) {
// 				const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
// 				result[i] = x;
// 				result[i + 1] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 			}
// 			break;
// 		case 'h':
// 			for (let i = 0; i < coords.length; i++) {
// 				const [x] = transformPoint(coords[i], ctx.currentY, matrix);
// 				result[i] = x;
// 				ctx.currentX = x;
// 			}
// 			break;
// 		case 'v':
// 			for (let i = 0; i < coords.length; i++) {
// 				const [, y] = transformPoint(ctx.currentX, coords[i], matrix);
// 				result[i] = y;
// 				ctx.currentY = y;
// 			}
// 			break;
// 		case 'c':
// 			for (let i = 0; i < coords.length; i += 6) {
// 				const [x1, y1] = transformPoint(coords[i], coords[i + 1], matrix);
// 				const [x2, y2] = transformPoint(coords[i + 2], coords[i + 3], matrix);
// 				const [x, y] = transformPoint(coords[i + 4], coords[i + 5], matrix);
// 				result[i] = x1;
// 				result[i + 1] = y1;
// 				result[i + 2] = x2;
// 				result[i + 3] = y2;
// 				result[i + 4] = x;
// 				result[i + 5] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 				ctx.lastControlX = x2;
// 				ctx.lastControlY = y2;
// 			}
// 			break;
// 		case 's':
// 			for (let i = 0; i < coords.length; i += 4) {
// 				// 计算第一个控制点(反射点)
// 				let x1, y1;
// 				if (
// 					ctx.lastCommand.toLowerCase() === 'c' ||
// 					ctx.lastCommand.toLowerCase() === 's'
// 				) {
// 					x1 = 2 * ctx.currentX - ctx.lastControlX;
// 					y1 = 2 * ctx.currentY - ctx.lastControlY;
// 				} else {
// 					x1 = ctx.currentX;
// 					y1 = ctx.currentY;
// 				}
// 				const [x2, y2] = transformPoint(coords[i], coords[i + 1], matrix);
// 				const [x, y] = transformPoint(coords[i + 2], coords[i + 3], matrix);
// 				result[i] = x2;
// 				result[i + 1] = y2;
// 				result[i + 2] = x;
// 				result[i + 3] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 				ctx.lastControlX = x2;
// 				ctx.lastControlY = y2;
// 			}
// 			break;
// 		case 'q':
// 			for (let i = 0; i < coords.length; i += 4) {
// 				const [x1, y1] = transformPoint(coords[i], coords[i + 1], matrix);
// 				const [x, y] = transformPoint(coords[i + 2], coords[i + 3], matrix);
// 				result[i] = x1;
// 				result[i + 1] = y1;
// 				result[i + 2] = x;
// 				result[i + 3] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 				ctx.lastControlX = x1;
// 				ctx.lastControlY = y1;
// 			}
// 			break;
// 		case 't':
// 			for (let i = 0; i < coords.length; i += 2) {
// 				// 计算控制点(反射点)
// 				let x1, y1;
// 				if (
// 					ctx.lastCommand.toLowerCase() === 'q' ||
// 					ctx.lastCommand.toLowerCase() === 't'
// 				) {
// 					x1 = 2 * ctx.currentX - ctx.lastControlX;
// 					y1 = 2 * ctx.currentY - ctx.lastControlY;
// 				} else {
// 					x1 = ctx.currentX;
// 					y1 = ctx.currentY;
// 				}
// 				const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
// 				result[i] = x;
// 				result[i + 1] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 				ctx.lastControlX = x1;
// 				ctx.lastControlY = y1;
// 			}
// 			break;
// 		case 'a':
// 			for (let i = 0; i < coords.length; i += 7) {
// 				const rx = coords[i];
// 				const ry = coords[i + 1];
// 				const angle = coords[i + 2];
// 				const largeArcFlag = coords[i + 3];
// 				const sweepFlag = coords[i + 4];
// 				const [x, y] = transformPoint(coords[i + 5], coords[i + 6], matrix);

// 				// 椭圆弧的变换需要考虑rx,ry的缩放
// 				const scale = Math.sqrt(Math.abs(matrix.a * matrix.d - matrix.b * matrix.c));
// 				result[i] = rx * scale;
// 				result[i + 1] = ry * scale;
// 				result[i + 2] = angle;
// 				result[i + 3] = largeArcFlag;
// 				result[i + 4] = sweepFlag;
// 				result[i + 5] = x;
// 				result[i + 6] = y;
// 				ctx.currentX = x;
// 				ctx.currentY = y;
// 			}
// 			break;
// 		case 'z':
// 			ctx.currentX = ctx.startX;
// 			ctx.currentY = ctx.startY;
// 			break;
// 	}

// 	ctx.lastCommand = command;
// 	return result;
// }

// // Convert absolute coordinates back to relative
// // function convertToRelative(command: string, coords: number[], ctx: PathContext): number[] {
// // 	const result = [...coords];
// // 	const baseX = command === 'm' ? (coords.length > 2 ? coords[0] : ctx.currentX) : ctx.currentX;
// // 	const baseY = command === 'm' ? (coords.length > 2 ? coords[1] : ctx.currentY) : ctx.currentY;

// // 	switch (command) {
// // 		case 'm':
// // 		case 'l':
// // 		case 't':
// // 			for (let i = 0; i < result.length; i += 2) {
// // 				result[i] -= baseX;
// // 				result[i + 1] -= baseY;
// // 			}
// // 			break;
// // 		case 'h':
// // 			for (let i = 0; i < result.length; i++) {
// // 				result[i] -= baseX;
// // 			}
// // 			break;
// // 		case 'v':
// // 			for (let i = 0; i < result.length; i++) {
// // 				result[i] -= baseY;
// // 			}
// // 			break;
// // 		case 'c':
// // 			for (let i = 0; i < result.length; i += 6) {
// // 				result[i] -= ctx.currentX;
// // 				result[i + 1] -= ctx.currentY;
// // 				result[i + 2] -= ctx.currentX;
// // 				result[i + 3] -= ctx.currentY;
// // 				result[i + 4] -= ctx.currentX;
// // 				result[i + 5] -= ctx.currentY;
// // 			}
// // 			break;
// // 		case 's':
// // 			for (let i = 0; i < result.length; i += 4) {
// // 				result[i] -= ctx.currentX;
// // 				result[i + 1] -= ctx.currentY;
// // 				result[i + 2] -= ctx.currentX;
// // 				result[i + 3] -= ctx.currentY;
// // 			}
// // 			break;
// // 		case 'q':
// // 			for (let i = 0; i < result.length; i += 4) {
// // 				result[i] -= ctx.currentX;
// // 				result[i + 1] -= ctx.currentY;
// // 				result[i + 2] -= ctx.currentX;
// // 				result[i + 3] -= ctx.currentY;
// // 			}
// // 			break;
// // 		case 'a':
// // 			for (let i = 0; i < result.length; i += 7) {
// // 				// rx, ry, x-axis-rotation, large-arc-flag, sweep-flag 保持不变
// // 				result[i + 5] -= ctx.currentX;
// // 				result[i + 6] -= ctx.currentY;
// // 			}
// // 			break;
// // 	}
// // 	return result;

// // 	return result;
// // }
