import { Geometry } from './geometry';
import { Point } from './point';

/** A quad with 0 thickness, rectangular in shape of some dimensions*/
export class RectQuad extends Geometry {
	width: number;
	height: number

	pointInGrid(row:number,column:number,rowLength:number,columnLength:number):Point{
		let cell=new Point();

		//to get pixel positions, find the 'step' distance needed to fill up the image plane for the given dimensions 
		let xStep=this.width/rowLength;
		let yStep=this.height/columnLength;

		return cell;//TODO
	}
}