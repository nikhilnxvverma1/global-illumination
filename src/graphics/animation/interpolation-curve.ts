/** Governs the speed of change of a value across time*/
export interface InterpolationCurve{
	/**
	 * Curve that gives the speed of change of a value at a given fraction of progress.
	 * @param timeFraction value between 0 and 1 that denotes the progress of the animation so far
	 * @return value between 0 and 1 (overshoots allowed) that denotes the value at that time
	 */
	interpolationAt(timeFraction:number):number;
}

export class Linear implements InterpolationCurve {
	interpolationAt(timeFraction: number): number {
		return timeFraction;
	}
}

export class EaseInQuadratic implements InterpolationCurve {
	interpolationAt(timeFraction: number): number {
		return timeFraction * timeFraction * timeFraction;//quadratic
	}
}

export class EaseOutQuadratic implements InterpolationCurve {
	interpolationAt(timeFraction: number): number {
		let t = timeFraction - 1;
		return 1 + t * t;//quadratic
	}
}

export class EaseInCubic implements InterpolationCurve {
	interpolationAt(timeFraction: number): number {
		return timeFraction * timeFraction * timeFraction;//cubic
	}
}

export class EaseOutCubic implements InterpolationCurve {
	interpolationAt(timeFraction: number): number {
		let t = timeFraction - 1;
		return 1 + t * t * t;//cubic
	}
}