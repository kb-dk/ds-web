import { pointItem } from '@/types/TimeSearchTypes';

function createSVGCurvedLine(points: pointItem[]) {
	const svgns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(svgns, 'svg');
	svg.setAttribute('height', '100%');
	svg.setAttribute('width', '100%');
	svg.setAttribute('viewBox', '0 0 100 100'); // Use a square viewBox for simplicity
	svg.setAttribute('preserveAspectRatio', 'none');
	const path = document.createElementNS(svgns, 'path');
	path.setAttribute('fill', '#caf0fe'); // No fill to avoid closing the path
	path.setAttribute('stroke', '#F7AE3B4D');
	path.setAttribute('stroke-width', '1');
	path.setAttribute('opacity', '1');
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
