import { Camera } from '../models/camera';
import { Point } from '../models/point';
import { Vector } from '../models/vector';
import { Behavior } from '../webgl/lifecycle';
import { toRadians } from '../../util';

export class OrbitalRevolution implements Behavior {
	camera: Camera;
	center: Point;
	radius: number;
	angle: number;
	frequency: number;

	constructor(camera: Camera) {
		this.camera = camera;
		this.center = new Point(0, 0, 0);
		this.radius = 6;
		this.frequency = 5000;
		this.angle = 0;
	}

	start() {
	}

	update(dTime: number) {
		const angleToIncrement = (dTime / this.frequency) * 360;
		this.angle += angleToIncrement;
		const z=Math.sin(toRadians(this.angle))*this.radius;
		const x=Math.cos(toRadians(this.angle))*this.radius;

		this.camera.origin.x=this.center.x + x;
		this.camera.origin.y=this.center.y;
		this.camera.origin.z=this.center.z + z;

		this.camera.lookAt=Vector.between(this.camera.origin,this.center);

	}

}