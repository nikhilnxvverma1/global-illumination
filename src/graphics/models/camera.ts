import { Point } from './point';
import { Vector } from './vector';

export class Camera{
	origin:Point;
	up:Vector;
	lookAt:Vector;
	perspective:boolean=true;

}