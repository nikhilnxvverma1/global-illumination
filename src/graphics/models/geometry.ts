import { Point } from './point';
import { Vector } from './vector';
import { Color } from './color';
import { Ray } from './ray';
import { IlluminationModel } from './illumination-model';
import { PhongIlluminationModel } from './phong-illumination';
import { World } from './world';
import { PointOnModel } from './point-on-model';

export abstract class Geometry{
	position:Point;
	normal:Vector;
	color:Color;
	illuminationModel:IlluminationModel=new PhongIlluminationModel();

	abstract intersection(ray:Ray):Point;

	abstract normalExtrudingTo(point:Point):Vector;

	abstract pointOnModelAfterIntersectionWith(ray:Ray):PointOnModel;

}