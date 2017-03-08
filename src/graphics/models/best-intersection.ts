import { Geometry } from './geometry';
import { Point } from './point';
import { Camera } from './camera';

export class BestIntersection {
	geometry: Geometry;
	point: Point;
	origin:Point;

	constructor(origin:Point){
		this.origin=origin;
	}

	updateIfNeeded(geometry:Geometry,intersection:Point):boolean{
		if(this.isEmpty()){
			this.geometry=geometry;
			this.point=intersection;
			return true;
		}
		let distanceFromCamera=this.origin.distance(intersection);
		if(distanceFromCamera<this.origin.distance(this.point)){
			this.geometry=geometry;
			this.point=intersection;
			return true;
		}
		return false;
	}

	isEmpty():boolean{
		return this.geometry==null||this.point==null;
	}
}