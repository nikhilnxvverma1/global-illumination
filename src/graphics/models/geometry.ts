import { GLDrawable } from '../webgl/gl-drawable';
import { Point } from './point';
import { Vector } from './vector';
import { Color } from './color';
import { Ray } from './ray';
import { IlluminationModel } from './illumination-model';
import { PhongIlluminationModel } from './phong-illumination';
import { World } from './world';
import { PointOnModel } from './point-on-model';
import { ColorPickingStrategy,SimpleColorStrategy } from '../color-picking-strategy';

export abstract class Geometry{
	position:Point;
	normal:Vector;
	color:Color;
	illuminationModel:IlluminationModel=new PhongIlluminationModel();
	colorPickingStrategy:ColorPickingStrategy=new SimpleColorStrategy(this);
	indexOfRefraction:number;

	abstract intersection(ray:Ray):Point;

	abstract normalExtrudingTo(point:Point):Vector;

	abstract pointOnModelAfterIntersectionWith(ray:Ray):PointOnModel;

	refract(point: Point, incident: Ray, normal: Vector): RefractionResult {
		//store all return related values here
		let refractedResult = new RefractionResult();
		refractedResult.incident = incident;
		refractedResult.intersection = point;
		refractedResult.normal = normal;

		//find the result to the equation
		let d = incident.direction;//D
		let cosTi = -d.dot(normal);//-D.N
		let n = incident.indexOfRefraction / this.indexOfRefraction;//nit=ni/nt
		let descriminant = 1 + (n * n * ((cosTi * cosTi) - 1));// 1 + (n^2 ((-D.N)^2-1))

		//total internal reflection condition
		if (descriminant < 0) {
			//use reflected ray for both calculations
			refractedResult.totalInternalReflection = true;
		} else {
			refractedResult.totalInternalReflection = false;
			//find the refracted(or transmitted) ray

			//first term
			let nd = d.scalerProduct(n);

			//second term of equation
			let bracket=(n*cosTi - Math.sqrt(descriminant));
			let bracketN=normal.scalerProduct(bracket);

			//transmitted vector
			let t=nd.add(bracketN);

			refractedResult.refracted=new Ray(point,t.normalize());
			refractedResult.refracted.indexOfRefraction = this.indexOfRefraction;
		}

		return refractedResult;
	}

}

export class RefractionResult{
	refracted:Ray;
	totalInternalReflection:boolean;
	intersection:Point;
	incident:Ray;
	normal:Vector;
}