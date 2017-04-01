import { AnimationEffect } from './animation-effect';
import { GLDrawable } from '../webgl/gl-drawable';
import { Vector } from '../models/vector';

export class ScaleDrawable extends AnimationEffect{

	drawable:GLDrawable;
	alongX=true;
	alongY=true;
	alongZ=true;

	/** The amount by which the drawable would be scaled */
	variance:number;

	private original:Vector;

	constructor(drawable,variance=0.5,duration=400,delay=0){
		super(duration,delay);
		this.drawable=drawable;
		this.variance=variance;
		this.original=this.drawable.scale.clone();
	}

	protected changeBy(fraction:number){
		
		let valueToAdd = this.variance * fraction;

		if (this.alongX) {
			this.drawable.scale.x = this.original.x + valueToAdd;
		}

		if (this.alongY) {
			this.drawable.scale.y = this.original.y + valueToAdd;
		}

		if (this.alongZ) {
			this.drawable.scale.z = this.original.z + valueToAdd;
		}
	}
}