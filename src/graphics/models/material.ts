import { Color } from '../models/color';

/** Controls the visual properties of an object */
export class Material{
	/** Ambient Coefficient */
	ka:number;
	/** Diffuse Coefficient */
	kd:number;
	/** Specular Coefficient */
	ks:number;
	/** Shininess constant for specular hightlight. Large for surfaces that are smoother and more mirror like */
	ke:number;
	/** Weather to use the same color for the entire object */
	useFixedColor:boolean;
	/** The color to use if the entire object is to be painted using it. */
	fixedColor:Color;

	constructor(){
		this.ka=0.5;
		this.kd=0.5;
		this.ks=0.3
		this.ke=1;
		this.useFixedColor=true;
		this.fixedColor=new Color().set("#DF5853");
	}
}