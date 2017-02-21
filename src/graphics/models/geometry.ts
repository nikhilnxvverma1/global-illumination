import { Point } from './point';
import { Vector } from './vector';
import { Color } from './color';
import { Ray } from './ray';

export abstract class Geometry{
	position:Point;
	normal:Vector;
	color:Color;

	abstract intersection(ray:Ray):Point;
}