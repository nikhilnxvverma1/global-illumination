import { Point } from './point';
import { Vector } from './vector';
import { Light } from './light';
import { Geometry } from './geometry';
import { Ray } from './ray';
import { Camera } from './camera';

export class IntersectionData{
	geometry:Geometry;
	point:Point;
	normal:Vector;
	incoming:Vector;
	reflective:Vector;
	view:Vector;
	light:Light;

	/**Populates the values of this object using intersection point on a given geomtry. Returns this same instance for chaining*/
	constructor(geometry:Geometry,point:Point,light:Light,camera:Camera){
		this.geometry=geometry;
		this.point=point;
		this.light=light;
		//compute the intersection data using the provided values
		this.normal=geometry.normalExtrudingTo(point).normalize();
		this.incoming=Vector.between(point,light.position).normalize();
		
		let towardsLight = new Ray(point, Vector.between(point, light.position))
		this.reflective=Vector.reflect(towardsLight,this.normal);

		this.view=Vector.between(point,camera.origin).normalize();
	}

}