import { Behavior } from './behavior';
import { GLDrawable } from './gl-drawable';

/**
 * Animation effect that oscillates scale back and forth for any drawable.
 */
export class ScaleOscillation implements Behavior{

	variance:number;
	cycleDuration:number;

	constructor(variance=0.1,cycleDuration=400){
		this.variance=variance;
		this.cycleDuration=cycleDuration;
	}

	initAction(drawable:GLDrawable,GL:WebGLRenderingContext){

	}

	updateAction(dTime:number,drawable:GLDrawable,GL:WebGLRenderingContext){
		
	}
}