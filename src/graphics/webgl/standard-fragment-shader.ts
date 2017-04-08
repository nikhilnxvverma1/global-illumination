import { GLDrawable } from './gl-drawable';
import { FragmentShader } from './shader';
import { Camera } from '../models/camera';
import { Light } from '../models/light';
import { World } from '../models/world';
import { removeFromEnd } from '../../util';

/** Raw shader code in string  */
let code=
`
precision mediump float;

#define MAX_LIGHTS 12

varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 diffuseColor;

struct Light{
	vec3 position;
	vec3 color;
};
uniform Light lightList[MAX_LIGHTS];
uniform int totalLights;
uniform vec4 ambientLight;

uniform vec3 cameraPosition;
uniform float ka;
uniform float kd;
uniform float ks;
uniform float ke;
void main(){

	vec3 ambient=vec3( ka * ambientLight);
	vec3 diffuse;
	vec3 specular;

	vec3 N = normalize(interpolatedNormal);
	vec3 V = normalize(vertexPosition-cameraPosition);

	//compute diffuse and specular component from each light
	for(int i=0; i<MAX_LIGHTS; i++){

		//unfortunately, GLSL does not support variable upper limits
		if(i>=totalLights){
			break;
		}

		vec3 L = normalize(lightList[i].position-vertexPosition);
		vec3 R = reflect(-L,N); // L was already inverted, so to have reflected ray also point outwards, L had to be negated

		float lambertian = max(dot(N,L),0.0); 
		diffuse += lambertian * diffuseColor;

		specular += pow( max(dot(R,V),0.0), ke ) * lightList[i].color;

	}

	gl_FragColor=vec4(ambient + kd * diffuse + ks * specular,1);
	// gl_FragColor=vec4( specular,1);
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
		GL.uniform1f(kdLocation,glDrawable.material.kd);

		let ksLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ks");
		GL.uniform1f(ksLocation,glDrawable.material.ks);

		let keLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ke");
		GL.uniform1f(keLocation,glDrawable.material.ke);

		//material color
		let fixedColorLocation=GL.getUniformLocation(glDrawable.webGLProgram,"fixedColor");
		GL.uniform4fv(fixedColorLocation,glDrawable.material.fixedColor.toFractionalValues().asArray());
	}

	private sendDownLightInfo(GL:WebGLRenderingContext,glDrawable:GLDrawable,world:World){
	
		//camera position
		let cameraPositionLocation=GL.getUniformLocation(glDrawable.webGLProgram,"cameraPosition");
		GL.uniform3fv(cameraPositionLocation,world.camera.origin.asVec3());

		//ambient light
		let ambientLightLocation=GL.getUniformLocation(glDrawable.webGLProgram,"ambientLight");
		GL.uniform4fv(ambientLightLocation,world.ambientLight.toFractionalValues().asArray());

		//number of lights in scene
		let totalLightsLocation=GL.getUniformLocation(glDrawable.webGLProgram,"totalLights");
		GL.uniform1i(totalLightsLocation,world.lightList.length);

		//lights in the world
		for(let i=0;i<world.lightList.length;i++){

			//position
			let lightPositionLocation=GL.getUniformLocation(glDrawable.webGLProgram,`lightList[${i}].position`);
			let xyz=world.lightList[i].position.asArrayNonHomogenous();
			GL.uniform3fv(lightPositionLocation,xyz);

			//color
			let lightColorLocation=GL.getUniformLocation(glDrawable.webGLProgram,`lightList[${i}].color`);
			GL.uniform3fv(lightColorLocation,world.lightList[i].color.toFractionalValues().asVec3());
		}
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