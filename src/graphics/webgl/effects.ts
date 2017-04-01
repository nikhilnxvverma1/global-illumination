import { Behavior } from './behavior';
import { GLDrawable } from './gl-drawable';
import { InterpolationCurve,EaseInCubic,EaseOutCubic } from './interpolation-curve';

/**
 * Animation effect that oscillates a property back and forth for any drawable.
 */
export abstract class AnimationEffect implements Behavior{

	loop:boolean;
	variance:number;
	duration:number;
	delay:number;

	/** Change in value as a function of time. Default is EaseInCubic */
	interpolation:InterpolationCurve=new EaseInCubic();
	/** For a loopy animation, backward change in value as a function of time. Default is EaseOutCubic */
	reverseInterpolation:InterpolationCurve=new EaseOutCubic();

	private countdown:number;
	private elapsed:number;

	constructor(variance=0.1,cycleDuration=400,delay=0){
		this.variance=variance;
		this.duration=cycleDuration;
		this.delay=delay;
	}

	initAction(drawable:GLDrawable,GL:WebGLRenderingContext){
		this.countdown=this.delay;
	}

	updateAction(dTime:number,drawable:GLDrawable,GL:WebGLRenderingContext){
		if(this.countdown<=0){
			let fractionProgressed=this.valueAt(dTime);
			let changeFraction=this.interpolation.interpolationAt(fractionProgressed);
			let dValue=changeFraction*this.variance;
			this.addValueToProperty(dValue);
		}else{
			this.countdown-=dTime;
		}
	}

	private valueAt(dTime:number):number{
		this.elapsed=(this.elapsed+dTime)%this.duration;
		return this.elapsed/this.duration;
	}

	/**
	 * Handles changes in property that affect the visual appearance of a drawable.
	 * @param dValue delta amount by which a given property must change
	 */
	protected abstract addValueToProperty(dValue:number);
}