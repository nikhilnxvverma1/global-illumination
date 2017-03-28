import { Geometry } from './models/geometry';
import { Point } from './models/point';
import { Color } from './models/color';
import { RectQuad } from './models/rect-quad';

/** Strategy for picking color at a given point. This could be used if the model has a texture. */
export interface ColorPickingStrategy{
	colorAt(point:Point):Color;
}

/** Returns the same color as the geometry */
export class SimpleColorStrategy implements ColorPickingStrategy{

	constructor(private geometry:Geometry){}

	colorAt(point:Point):Color{
		return this.geometry.color;
	}

}


/** Color in the Checker box pattern. Applicable only for rect quad */
export class CheckerBoxStrategy implements ColorPickingStrategy{

	private _evenColor:Color;
	private _oddColor:Color;
	
	constructor(private rectQuad:RectQuad){}

	colorAt(point:Point):Color{


		return null;//TODO compute the checkerbox color to send back
	}
}