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
			y: 100 - ((point.y - minY) / rangeY) * 100, // Invert y to flip the axis
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

	path.setAttribute('d', d);

	svg.appendChild(path);
	return svg;
}

export { createSVGCurvedLine };
