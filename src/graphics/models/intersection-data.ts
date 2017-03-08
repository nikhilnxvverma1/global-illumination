import { Point } from './point';
import { Vector } from './vector';
import { Light } from './light';
import { Geometry } from './geometry';

export class IntersectionData{
	geometry:Geometry;
	point:Point;
	normal:Vector;
	incoming:Vector;
	reflective:Vector;
	lights:Light[];

	constructor(lights:Light[]){
		this.lights=lights;
	}

	/**Populates the values of this object using intersection point on a given geomtry. Returns this same instance for chaining*/
	computeUsing(geometry:Geometry,interesectionPoint:Point):IntersectionData{
		this.geometry=geometry;
		this.point=interesectionPoint;
		this.normal=geometry.normalExtrudingTo(interesectionPoint);
		//TODO compute the intersection data using the provided values
		return this;
	}
}