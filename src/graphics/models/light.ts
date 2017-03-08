import { Point } from './point';
import { Color } from './color';

export class Light{
	position:Point;
	color:Color=new Color(255,255,255,255);

	constructor(position:Point){
		this.position=position;
	}

}