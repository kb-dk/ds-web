import { pointItem } from '@/types/TimeSearchTypes';

function createSVGCurvedLine(points: pointItem[]) {
	const svgns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(svgns, 'svg');
	svg.setAttribute('height', '100%');
	svg.setAttribute('width', '100%');
	svg.setAttribute('viewBox', '0 0 100 100'); // Use a square viewBox for simplicity
	svg.setAttribute('preserveAspectRatio', 'none');
	const path = document.createElementNS(svgns, 'path');
	path.setAttribute('fill', '#002e70'); // No fill to avoid closing the path
	path.setAttribute('stroke', '#001c44');
	path.setAttribute('stroke-width', '2');
	path.setAttribute('fill-opacity', '1');
	path.setAttribute('vector-effect', 'non-scaling-stroke');

	// Normalize y coordinates to fit within [0, 100] range
	const yValues = points.map((point) => point.y);
	const minY = Math.min(...yValues);
	const maxY = Math.max(...yValues);
	const logBase = 1000;
	const rangeY = maxY - minY;

	let normalizedPoints;

	if (rangeY === 0) {
		// If all y values are the same, set them to the middle of the viewBox (50)
		normalizedPoints = points.map((point) => ({
			x: point.x,
			y: 50,
		}));
	} else {
		normalizedPoints = points.map((point) => ({
			x: point.x,
			y: calculateDefaultDataCurve(logBase, point.y, minY, maxY, rangeY), // Invert y to flip the axis
		}));
	}
	// Convert points to a smooth path data string using percentages
	let d = `M ${normalizedPoints[0].x} ${normalizedPoints[0].y}`;
	for (let i = 1; i < normalizedPoints.length - 1; i++) {
		const xc = (normalizedPoints[i].x + normalizedPoints[i + 1].x) / 2;
		const yc = (normalizedPoints[i].y + normalizedPoints[i + 1].y) / 2;
		d += ` Q ${normalizedPoints[i].x} ${normalizedPoints[i].y}, ${xc} ${yc}`;
	}
	const lastX = normalizedPoints[normalizedPoints.length - 1].x;
	const lastY = normalizedPoints[normalizedPoints.length - 1].y;
	d += ` Q ${lastX} ${lastY}, ${lastX} ${lastY}`; // Complete the path with the last point
	d += ` L ${lastX} 100 L 0 100 Z`; // Line to bottom-right, then bottom-left, and close

	path.setAttribute('d', d);

	svg.appendChild(path);

	const defs = document.createElementNS(svgns, 'defs');
	const clipPath = document.createElementNS(svgns, 'clipPath');
	const clipId = `clip-${Math.random().toString(36).slice(2)}`;

	clipPath.setAttribute('id', clipId);

	const clipShape = path.cloneNode(true) as SVGElement;
	clipShape.removeAttribute('fill');
	clipShape.removeAttribute('stroke');

	clipPath.appendChild(clipShape);
	defs.appendChild(clipPath);
	svg.appendChild(defs);

	for (let i = 0; i < normalizedPoints.length; i += 1) {
		const p = normalizedPoints[i];

		const line = document.createElementNS(svgns, 'line');

		line.setAttribute('x1', String(p.x));
		line.setAttribute('y1', '100');
		line.setAttribute('x2', String(p.x));
		line.setAttribute('y2', String(Number(p.y - 10)));
		line.setAttribute('class', 'line-class');
		line.setAttribute('stroke', '#ffffff27');
		line.setAttribute('stroke-width', '1');
		line.setAttribute('vector-effect', 'non-scaling-stroke');
		line.setAttribute('clip-path', `url(#${clipId})`);

		svg.appendChild(line);
	}

	return svg;
}

function calculateSmallDataCurve(logBase: number, y: number, minY: number, maxY: number): number {
	const rangeY = getBaseLog(logBase, maxY + 1) - getBaseLog(logBase, minY + 1);
	return Math.min(95 - ((getBaseLog(logBase, y + 1) - getBaseLog(logBase, minY + 1)) / rangeY) * 95, 94);
}
function calculateMediumDataCurve(logBase: number, y: number, minY: number, maxY: number) {
	logBase = logBase * 10;
	const rangeY = getBaseLog(logBase, maxY + 1) - getBaseLog(logBase, minY + 1);
	return 95 - ((getBaseLog(logBase, y + 1) - getBaseLog(logBase, minY + 1)) / rangeY) * 95;
}
function calculateDefaultDataCurve(logBase: number, y: number, minY: number, maxY: number, rangeY: number) {
	if (y === 0) {
		return 100;
	}
	let normalized = 100 - ((y - minY) / rangeY) * 100;
	if (normalized > 99) {
		normalized = calculateSmallDataCurve(logBase, y, minY, maxY);
	} else if (normalized > 94) {
		normalized = calculateMediumDataCurve(logBase, y, minY, maxY);
	}
	return normalized;
}
function getBaseLog(x: number, y: number): number {
	return Math.log(Math.log(y + x) + 1);
}
export { createSVGCurvedLine };
