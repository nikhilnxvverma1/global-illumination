import { GLDrawable } from './gl-drawable';
import { FragmentShader } from './shader';
import { Camera } from '../models/camera';
import { Light } from '../models/light';

/** Raw shader code in string  */
let code=
`
precision mediump float;
uniform float ka;
uniform float kd;
uniform float ks;
uniform float ke;
uniform vec4 fixedColor;
void main(){
	gl_FragColor=fixedColor;
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

		this.sendDownMaterialInformation(GL,glDrawable);
	}

	private sendDownMaterialInformation(GL:WebGLRenderingContext,glDrawable:GLDrawable){
		
		//material light coefficients
		let kaLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ka");
		GL.uniform1f(kaLocation,glDrawable.material.ka);

		let kdLocation=GL.getUniformLocation(glDrawable.webGLProgram,"kd");
		GL.uniform1f(kaLocation,glDrawable.material.kd);

		let ksLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ks");
		GL.uniform1f(kaLocation,glDrawable.material.ks);

		let keLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ke");
		GL.uniform1f(kaLocation,glDrawable.material.ke);

		//material color
		let fixedColorLocation=GL.getUniformLocation(glDrawable.webGLProgram,"fixedColor");
		GL.uniform4fv(fixedColorLocation,glDrawable.material.fixedColor.toFractionalValues().asArray());
	}

}