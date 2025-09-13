// Matrix interface represents a 2D transformation matrix
export interface Matrix {
	a: number; // scale x
	b: number; // skew y
	c: number; // skew x
	d: number; // scale y
	e: number; // translate x
	f: number; // translate y
}

// Transform interface represents an SVG transformation
export interface Transform {
	type: 'translate' | 'scale' | 'matrix';
	values: number[];
}

// PathCommand interface represents a parsed SVG path command
export interface PathCommand {
	type: string;
	isRelative: boolean;
	values: number[];
}
