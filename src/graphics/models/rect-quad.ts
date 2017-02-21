import { Geometry } from './geometry';
import { Point } from './point';
import { Vector } from './vector';

/** A quad with 0 thickness, rectangular in shape of some dimensions*/
export class RectQuad extends Geometry {
	width: number;
	height: number;

	intersection(ray:Vector):Point[]{
		return null;//TODO
	}

	pointInGrid(row: number, column: number, rowLength: number, columnLength: number): Point {

		//to get pixel positions, find the 'step' distance needed to fill up the image plane for the given dimensions 
		let xStep = this.width / columnLength;
		let yStep = this.height / rowLength;

		//simple case: flat plane parallel to xy plane
		let topLeft = this.position.onLeft(-this.width / 2).onTop(this.height / 2);
		return topLeft.add(new Point(column * xStep + xStep/2, row * yStep + yStep/2));
	}
}