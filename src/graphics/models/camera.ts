import { Point } from './point';
import { Vector } from './vector';
import { RectQuad } from './rect-quad';

export class Camera {
	perspective: boolean = true;

	origin: Point;
	lookAt: Vector;
	up: Vector;

	top: number;
	left: number;
	bottom: number;
	right: number;
	near: number;
	far: number;

	/** Vertical field of view in degrees*/
	fieldOfView:number=45;

	constructor(
		origin = new Point(0, 0, 0),
		lookAt = new Vector(0, 0, -1),
		up = new Vector(0, 1, 0)
	) {
		this.origin = origin;
		this.lookAt = lookAt;
		this.up = up;
	}

	getNearPlane(): RectQuad {

		let normal = this.lookAt.opposite().unitVector();
		let center = this.lookAt.pointAt(this.near, this.origin);
		let nearPlane = new RectQuad();
		nearPlane.width = this.right - this.left;
		nearPlane.height = this.bottom - this.top;
		nearPlane.normal=normal;
		nearPlane.position=center;
		return nearPlane;
	}

	aspectRatio():number{//=1 step
		return (this.right - this.left) / (this.top - this.bottom);
	}

	/**Returns field of view in radians */
	fieldOfViewInRadians(): number {//=1 step
		return this.fieldOfView * (Math.PI / 180);//45 degrees
	}
}