import { Geometry } from './geometry';
import { Vector } from './vector';
import { Point } from './point';

export class Sphere extends Geometry {
	radius: number

	intersection(ray:Vector):Point[]{
		return null;//TODO
	}
}