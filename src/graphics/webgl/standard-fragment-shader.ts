import { GLDrawable } from './gl-drawable';
import { FragmentShader } from './shader';
import { Camera } from '../models/camera';
import { Light } from '../models/light';

/** Raw shader code in string  */
let code=
`
uniform 
void main(){
	gl_FragColor=vec4(0.4,0.3,0.8,1);
}
`
;

//commmon vertex shader id shader across all shaders
let fragmentShaderId:number;
export class StandardFragmentShader extends FragmentShader{

	getSourceCode():string{
		return code;
	}

	drawSetup(GL:WebGLRenderingContext,glDrawable:GLDrawable,camera:Camera,lights:Light[]){

		
	}

}