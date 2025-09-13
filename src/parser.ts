import { Transform } from './types';

// Parse transform attribute string into an array of transformations
export function parseTransform(transformStr: string): Transform[] {
	if (!transformStr) return [];

	const transforms: Transform[] = [];
	const regex = /(translate|scale|matrix)\(([-\d.,\s]+)\)/g;
	let match;

	while ((match = regex.exec(transformStr)) !== null) {
		const type = match[1] as Transform['type'];
		const values = match[2].split(/[\s,]+/).map(Number);
		transforms.push({ type, values });
	}

	return transforms;
}

// Parse path command string into a more structured format
export function parsePathCommand(command: string): { type: string; numbers: number[] } {
	const type = command[0];
	const numbers = command
		.slice(1)
		.trim()
		.split(/[\s,]+/)
		.map(Number);

	return { type, numbers };
}
