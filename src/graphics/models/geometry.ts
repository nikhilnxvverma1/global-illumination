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

	refract(point:Point,incoming:Ray,normal:Vector):Ray{
		let refractedRay=new Ray(point,null);
		refractedRay.indexOfRefraction=this.indexOfRefraction;
		return refractedRay;
	}

}