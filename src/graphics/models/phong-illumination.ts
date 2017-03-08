import { IlluminationModel } from './illumination-model';
import { IntersectionData } from './intersection-data';
import { Color } from './color';
import { World } from './world';
import { Geometry } from './geometry';

export class PhongIlluminationModel implements IlluminationModel{
	/**Ambient coefficient */
	ka:number;
	/**Diffuse coefficient */
	kd:number;
	/**Specular coefficient */
	ks:number;
	/**Exponent controlling the size of specular highlight */
	ke:number;

	constructor(ka:number=0.6,kd:number=0.3,ks:number=0.4){
		this.ka=ka;
		this.kd=kd;
		this.ks=ks;
	}

	illuminate(world:World,intersectionData:IntersectionData):Color{
		return intersectionData.geometry.color;
	}
}