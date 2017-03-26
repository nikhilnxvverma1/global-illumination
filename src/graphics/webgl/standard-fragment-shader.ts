import { GLDrawable } from './gl-drawable';
import { FragmentShader } from './shader';

/** Raw shader code in string  */
let code=
`
void main(){
	gl_FragColor=vec4(0.4,0.3,0.8,1);
}
`
;

//commmon vertex shader id shader across all shaders
let fragmentShaderId:number;
export class StandardFragmentShader implements FragmentShader{

	getShaderId():number{
		return fragmentShaderId;
	}

	init(GLDrawable:GLDrawable,gl:WebGLRenderingContext){
		
	}

	draw(GLDrawable:GLDrawable,gl:WebGLRenderingContext){
		
	}

}