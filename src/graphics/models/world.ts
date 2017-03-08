import { Geometry } from './geometry';
import { Color } from './color';
import { Light } from './light';
import { Camera } from './camera';

export class World{
	camera:Camera;
	geometryList:Geometry[]=[];
	ambientLight:Color=new Color(255,255,255,255);
	lightList:Light[]=[];
	
}