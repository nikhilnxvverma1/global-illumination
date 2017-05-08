import { Camera } from "./camera";
import { GLDrawable } from '../webgl/gl-drawable';
import { Behavior } from '../webgl/lifecycle';
import { Light } from './light';
import { Color } from './color';

export class GLScene{
	camera:Camera;
	behaviourList:Behavior[]=[];
	drawableList:GLDrawable[]=[];
	lightList:Light[]=[];
	ambientLight:Color=new Color(200,200,200,255);
}