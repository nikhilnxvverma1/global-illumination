import { GLDrawable } from './gl-drawable';
import { FragmentShader } from './shader';
import { Camera } from '../models/camera';
import { Light } from '../models/light';
import { World } from '../models/world';

/** Raw shader code in string  */
let code=
`
precision mediump float;

#define MAX_LIGHTS 12

struct Light{
	vec3 position;
	
}

uniform float ka;
uniform float kd;
uniform float ks;
uniform float ke;
uniform vec4 fixedColor;
uniform vec4 ambientLight;
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

	drawSetup(GL:WebGLRenderingContext,glDrawable:GLDrawable,world:World){

		this.sendDownMaterialInfo(GL,glDrawable);
		this.sendDownLightInfo(GL,glDrawable,world);
	}

	private sendDownMaterialInfo(GL:WebGLRenderingContext,glDrawable:GLDrawable){
		
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

	private sendDownLightInfo(GL:WebGLRenderingContext,glDrawable:GLDrawable,world:World){
	
		//ambient light
		let ambientLightLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ambientLight");
		GL.uniform4fv(ambientLightLocation,world.ambientLight.toFractionalValues().asArray());
	}

	private flattenedArrayForAttributeOfLights(lights:Light[],attributeAsArray:(light:Light)=>number[]):number[]{

		let flattenedArray=[];
		for(let light of lights){
			let array=attributeAsArray(light);
			
			for(let element of array){
				flattenedArray.push(element);
			}
		}
		return flattenedArray;
	}

}