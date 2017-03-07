import { IlluminationModel } from './illumination-model';
import { IntersectionData } from './intersection-data';

export class PhongIlluminationModel implements IlluminationModel{
	/**Ambient coefficient */
	ka:number;
	/**Diffuse coefficient */
	kd:number;
	/**Specular coefficient */
	ks:number;
	
	illuminate(intersectionData:IntersectionData):any{

	}
}