import { Geometry } from './geometry';
import { Point } from './point';
import { Vector } from './vector';
import { Ray } from './ray';

/** A quad with 0 thickness, rectangular in shape of some dimensions*/
export class RectQuad extends Geometry {
	width: number;
	height: number;

	intersection(ray: Ray): Point {
		let d = ray.direction;
		let o = ray.origin;
		let p = this.position;
		let n = this.normal;
		let f = p.distance(new Point());//distance from origin
		let w = -(n.x * o.x + n.y * o.y + n.z * o.z + f) / (n.x * d.x + n.y * d.y + n.z * d.z);
		if(w>0){
			let inside = ray.pointAt(w);
			if (
				(inside.x < p.x - this.width / 2 || inside.x > p.x + this.width / 2)||
				(inside.z < p.z - this.height / 2 || inside.z > p.z + this.height / 2) ){
			// if (inside.z < p.z - this.height / 2 || inside.z > p.z + this.height / 2){
				return null;
			}else{
				return inside;
			}
		}
		return null;
	}

	pointInGrid(row: number, column: number, rowLength: number, columnLength: number): Point {

		//to get pixel positions, find the 'step' distance needed to fill up the image plane for the given dimensions 
		let xStep = this.width / columnLength;
		let yStep = this.height / rowLength;

		//simple case: flat plane parallel to xy plane
		let topLeft = this.position.onLeft(this.width / 2).onTop(this.height / 2);
		return topLeft.add(new Point(column * xStep + xStep / 2, row * yStep + yStep / 2));
	}

	normalExtrudingTo(point:Point):Vector{
		let projection:Point=new Point(point.x,this.position.y,point.z);//TODO what if the plane is rotated
		if(point.y>this.position.y){
			return Vector.between(projection,point);
		}else{
			return Vector.between(point,projection);
		}
	}
}