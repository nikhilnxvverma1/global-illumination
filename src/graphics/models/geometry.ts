import { Point } from './point';
import { Vector } from './vector';
import { Color } from './color';

export abstract class Geometry{
	position:Point;
	normal:Vector;
	color:Color;

	abstract intersection(ray:Vector):Point[];
}