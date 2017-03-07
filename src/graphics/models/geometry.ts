import { Point } from './point';
import { Vector } from './vector';
import { Color } from './color';
import { Ray } from './ray';
import { IlluminationModel } from './illumination-model';
import { PhongIlluminationModel } from './phong-illumination';

export abstract class Geometry{
	position:Point;
	normal:Vector;
	color:Color;
	illuminationModel:IlluminationModel=new PhongIlluminationModel();


	abstract intersection(ray:Ray):Point;
}