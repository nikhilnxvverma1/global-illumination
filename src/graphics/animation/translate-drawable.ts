import { AnimationEffect } from './animation-effect';
import { GLDrawable } from '../webgl/gl-drawable';
import { Point } from '../models/point';

export class TranslateDrawable extends AnimationEffect{

	drawable:GLDrawable;
	alongX=true;
	alongY=true;
	alongZ=true;

	/** The amount by which the drawable would be translated */
	variance:number;

	private original:Point;

	constructor(drawable,variance=60,duration=400,delay=0){
		super(duration,delay);
		this.drawable=drawable;
		this.variance=variance;
		this.original=this.drawable.translation.clone();
	}

	protected changeBy(fraction:number){
		
		let valueToAdd = this.variance * fraction;

		if (this.alongX) {
			this.drawable.translation.x = this.original.x + valueToAdd;
		}

		if (this.alongY) {
			this.drawable.translation.y = this.original.y + valueToAdd;
		}

		if (this.alongZ) {
			this.drawable.translation.z = this.original.z + valueToAdd;
		}
	}
}