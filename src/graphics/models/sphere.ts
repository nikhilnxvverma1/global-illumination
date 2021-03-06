import { Geometry } from './geometry';
import { Vector } from './vector';
import { Point } from './point';
import { Ray } from './ray';
import { PointOnModel } from './point-on-model';
import { Color } from './color';

export class Sphere extends Geometry {//=8 units
	radius: number

	constructor(radius: number) {
		super();
		this.radius = radius;
	}

	intersection(ray: Ray): Point {//=7 units
		//COMPUTE intersection variables needed for calculation
		let d = ray.direction;
		let o = ray.origin;
		let p = this.position;
		let b = 2 * (d.x * (o.x - p.x) + d.y * (o.y - p.y) + d.z * (o.z - p.z));
		let c = (o.x - p.x) * (o.x - p.x) + (o.y - p.y) * (o.y - p.y) + (o.z - p.z) * (o.z - p.z) - this.radius * this.radius;
		let b24c=b*b-4*c;

		//CHECK various possiblities of interesctions:
		if(b24c<0){
			//no intersection
			return null;
		}else{
			//COMPUTE intersection points
			let w1=-(b-Math.sqrt(b24c))/2
			let w2=-(b+Math.sqrt(b24c))/2
			if(w1<0){
				if(w2<0){
					//no intersection
					return null;
				}else{
					//one intersection
					return ray.pointAt(w2);
				}
			}else{
				if(w2<0){
					//one intersection
					return ray.pointAt(w1);
				}else{
					//both positive, use least positive
					return ray.pointAt(w1<w2?w1:w2);
				}
			}
		}
	}

	normalExtrudingTo(point:Point):Vector{//=1 units
		return Vector.between(this.position,point);
	}

	pointOnModelAfterIntersectionWith(ray:Ray):PointOnModel{
		let pointOnModel=new PointOnModel();
		pointOnModel.intersection=this.intersection(ray);
		//TODO uv point of sphere
		return pointOnModel;
	}

}