import { Behavior } from '../webgl/lifecycle';
import { InterpolationCurve,EaseInCubic,EaseOutCubic } from './interpolation-curve';

/**
 * Animation effect that oscillates a property back and forth for any drawable.
 */
export abstract class AnimationEffect implements Behavior{

	loop:boolean;
	duration:number;
	delay:number;

	/** Change in value as a function of time. Default is EaseInCubic */
	interpolation:InterpolationCurve=new EaseInCubic();
	/** For a loopy animation, backward change in value as a function of time. Default is EaseOutCubic */
	reverseInterpolation:InterpolationCurve=new EaseOutCubic();

	private countdown:number;
	private elapsed:number;
	protected goingForward:boolean;

	constructor(duration=400,delay=0){
		this.duration=duration;
		this.delay=delay;
		this.loop=true;
	}

	start(){
		this.countdown=this.delay;
		this.goingForward=true;
	}

	update(dTime:number){
		if (this.countdown <= 0) {
			let fractionProgressed = this.valueAt(dTime);
			let changeFraction = this.interpolation.interpolationAt(fractionProgressed);
			let sign = this.goingForward ? 1 : -1;
			let dValue = changeFraction * sign;
			this.changeBy(dValue);
		} else {
			this.countdown -= dTime;
		}
	}

	private valueAt(dTime: number): number {

		if (this.elapsed + dTime < this.duration) {
			this.elapsed += dTime;
		} else {
			//toggle direction of animation
			this.goingForward = !this.goingForward;

			//round back to 0, so next time it will go back to the first case
			this.elapsed = (this.elapsed + dTime) % this.duration;
		}

		return this.elapsed/this.duration;
	}

	/**
	 * Handles changes in property that affect the visual appearance of a drawable.
	 * @param fraction amount (between 0 and 1) by which a given property changed
	 */
	protected abstract changeBy(fraction:number);
}
