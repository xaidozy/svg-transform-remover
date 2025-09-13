import { Matrix } from './types';
import { transformPoint } from './matrix';

// Store current position while processing path data
interface PathContext {
	currentX: number;
	currentY: number;
	startX: number;
	startY: number;
}

// Transform an SVG path data string
export function transformPath(d: string, matrix: Matrix): string {
	const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
	let result = '';
	const ctx: PathContext = {
		currentX: 0,
		currentY: 0,
		startX: 0,
		startY: 0,
	};

	for (const cmd of commands) {
		result += processCommand(cmd, matrix, ctx);
	}

	return result;
}

// Process a single path command
function processCommand(cmd: string, matrix: Matrix, ctx: PathContext): string {
	const type = cmd[0];
	const numbers = cmd
		.slice(1)
		.trim()
		.split(/[\s,]+/)
		.map(Number);
	const isRelative = type.toLowerCase() === type;
	const command = type.toLowerCase();

	// Convert relative coordinates to absolute
	const coords = convertToAbsolute(command, numbers, ctx, isRelative);

	// Transform coordinates
	const transformed = transformCoordinates(command, coords, matrix, ctx);

	// Convert back to relative if needed
	const final = isRelative ? convertToRelative(command, transformed, ctx) : transformed;

	// Format the command
	return type + final.map((n) => n.toFixed(6)).join(' ');
}

// Convert relative coordinates to absolute
function convertToAbsolute(
	command: string,
	coords: number[],
	ctx: PathContext,
	isRelative: boolean,
): number[] {
	if (!isRelative) return [...coords];

	const result = [...coords];

	switch (command) {
		case 'm':
		case 'l':
		case 't':
			for (let i = 0; i < result.length; i += 2) {
				result[i] += ctx.currentX;
				result[i + 1] += ctx.currentY;
			}
			break;
		case 'h':
			for (let i = 0; i < result.length; i++) {
				result[i] += ctx.currentX;
			}
			break;
		case 'v':
			for (let i = 0; i < result.length; i++) {
				result[i] += ctx.currentY;
			}
			break;
		case 'c':
			for (let i = 0; i < result.length; i += 6) {
				result[i] += ctx.currentX;
				result[i + 1] += ctx.currentY;
				result[i + 2] += ctx.currentX;
				result[i + 3] += ctx.currentY;
				result[i + 4] += ctx.currentX;
				result[i + 5] += ctx.currentY;
			}
			break;
	}

	return result;
}

// Transform coordinates using the matrix
function transformCoordinates(
	command: string,
	coords: number[],
	matrix: Matrix,
	ctx: PathContext,
): number[] {
	const result = [...coords];

	switch (command) {
		case 'm':
			for (let i = 0; i < coords.length; i += 2) {
				const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
				result[i] = x;
				result[i + 1] = y;
				ctx.currentX = x;
				ctx.currentY = y;
				if (i === 0) {
					ctx.startX = x;
					ctx.startY = y;
				}
			}
			break;
		case 'l':
		case 't':
			for (let i = 0; i < coords.length; i += 2) {
				const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
				result[i] = x;
				result[i + 1] = y;
				ctx.currentX = x;
				ctx.currentY = y;
			}
			break;
		case 'h':
			for (let i = 0; i < coords.length; i++) {
				const [x] = transformPoint(coords[i], ctx.currentY, matrix);
				result[i] = x;
				ctx.currentX = x;
			}
			break;
		case 'v':
			for (let i = 0; i < coords.length; i++) {
				const [, y] = transformPoint(ctx.currentX, coords[i], matrix);
				result[i] = y;
				ctx.currentY = y;
			}
			break;
		case 'c':
			for (let i = 0; i < coords.length; i += 6) {
				const [x1, y1] = transformPoint(coords[i], coords[i + 1], matrix);
				const [x2, y2] = transformPoint(coords[i + 2], coords[i + 3], matrix);
				const [x, y] = transformPoint(coords[i + 4], coords[i + 5], matrix);
				result[i] = x1;
				result[i + 1] = y1;
				result[i + 2] = x2;
				result[i + 3] = y2;
				result[i + 4] = x;
				result[i + 5] = y;
				ctx.currentX = x;
				ctx.currentY = y;
			}
			break;
		case 'z':
			ctx.currentX = ctx.startX;
			ctx.currentY = ctx.startY;
			break;
	}

	return result;
}

// Convert absolute coordinates back to relative
function convertToRelative(command: string, coords: number[], ctx: PathContext): number[] {
	const result = [...coords];
	const baseX = command === 'm' ? (coords.length > 2 ? coords[0] : ctx.currentX) : ctx.currentX;
	const baseY = command === 'm' ? (coords.length > 2 ? coords[1] : ctx.currentY) : ctx.currentY;

	switch (command) {
		case 'm':
		case 'l':
		case 't':
			for (let i = 0; i < result.length; i += 2) {
				result[i] -= baseX;
				result[i + 1] -= baseY;
			}
			break;
		case 'h':
			for (let i = 0; i < result.length; i++) {
				result[i] -= baseX;
			}
			break;
		case 'v':
			for (let i = 0; i < result.length; i++) {
				result[i] -= baseY;
			}
			break;
		case 'c':
			for (let i = 0; i < result.length; i += 6) {
				result[i] -= ctx.currentX;
				result[i + 1] -= ctx.currentY;
				result[i + 2] -= ctx.currentX;
				result[i + 3] -= ctx.currentY;
				result[i + 4] -= ctx.currentX;
				result[i + 5] -= ctx.currentY;
			}
			break;
	}

	return result;
}
