import { Point } from './point';
import { Vector } from './vector';
import { Light } from './light';

export class IntersectionData{
	point:Point;
	normal:Vector;
	incoming:Vector;
	reflective:Vector;
	lights:Light[];
}