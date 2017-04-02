import { AnimationEffect } from './animation-effect';
import { GLDrawable } from '../webgl/gl-drawable';
import { Vector } from '../models/vector';

export class RotateDrawable extends AnimationEffect{

	drawable:GLDrawable;
	alongX=true;
	alongY=true;
	alongZ=true;

	/** The amount by which the drawable would be rotated */
	variance:number;

	private original:Vector;

	constructor(drawable,variance=60,duration=400,delay=0){
		super(duration,delay);
		this.drawable=drawable;
		this.variance=variance;
		this.original=this.drawable.rotation.clone();
	}

	protected changeBy(fraction:number){
		
		let valueToAdd = this.variance * fraction;

		if (this.alongX) {
			this.drawable.rotation.x = this.original.x + valueToAdd;
		}

		if (this.alongY) {
			this.drawable.rotation.y = this.original.y + valueToAdd;
		}

		if (this.alongZ) {
			this.drawable.rotation.z = this.original.z + valueToAdd;
		}
	}
}