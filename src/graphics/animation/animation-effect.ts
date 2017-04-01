import { Behavior } from '../webgl/lifecycle';
import { InterpolationCurve,EaseInCubic,EaseOutCubic } from './interpolation-curve';

/**
 * Animation effect that oscillates a property back and forth for any drawable.
 */
export abstract class AnimationEffect implements Behavior{

	loop:boolean;
	/** For a loopy animation, this flag ensures interpolation occurs in both direction  */
	yoyo:boolean;
	duration:number;
	delay:number;

	/** Change in value as a function of time. Default is EaseInCubic */
	interpolation:InterpolationCurve=new EaseInCubic();
	/** For a loopy animation with yoyo, backward change in value as a function of time. Default is EaseOutCubic */
	reverseInterpolation:InterpolationCurve=new EaseOutCubic();

	private countdown:number;
	private elapsed:number;
	private hasFinished:boolean;
	protected goingForward:boolean;

	constructor(duration=400,delay=0){
		this.duration=duration;
		this.delay=delay;
		this.countdown=this.delay;
		this.goingForward=true;
		this.elapsed=0;
		this.loop=true;
		this.yoyo=true;
		this.hasFinished=false;
	}

	start(){
		//readily overridable by the subclasses if needed
	}

	update(dTime:number){
		if(this.hasFinished){
			return ;
		}

		if (this.countdown <= 0) {

			let fractionProgressed = this.valueAt(dTime);
			let changeFraction:number;
			if(this.goingForward){
				changeFraction = this.interpolation.interpolationAt(fractionProgressed);
			}else{
				changeFraction = 1 - this.reverseInterpolation.interpolationAt(fractionProgressed);
			}
			this.changeBy(changeFraction);
		} else {
			this.countdown -= dTime;
		}
	}

	private valueAt(dTime: number): number {

		if (this.elapsed + dTime < this.duration) {
			this.elapsed += dTime;
		} else {

			//indicate the end of animation, 
			if(!this.loop){

				//so that no further updates are made to the drawable
				this.hasFinished=true;
				return 1;
			}

			//go back and forth between starting and ending value
			if(this.yoyo){
				//toggle direction of animation
				this.goingForward = !this.goingForward;
			}

			//round back to 0, so next time it will go back to the first case
			this.elapsed = (this.elapsed + dTime) % this.duration;
		}

		return this.elapsed/this.duration;
	}

	/**
	 * Handles changes in property that affect the visual appearance of a drawable.
	 * @param fraction amount (between 0 and 1) by which a given property changed 
	 * from its very original value (at start)
	 */
	protected abstract changeBy(fraction:number);
}
