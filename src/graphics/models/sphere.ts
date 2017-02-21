import { Geometry } from './geometry';
import { Vector } from './vector';
import { Point } from './point';

export class Sphere extends Geometry {
	radius: number

	constructor(radius:number){
		super();
		this.radius=radius;
	}

	intersection(ray:Vector):Point[]{
		return null;//TODO
	}
}