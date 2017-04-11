import { GLDrawable } from './gl-drawable';
import { VertexShader } from './shader';
import { loadTextResource } from '../../file-util';
import * as Promise from 'bluebird';
import * as path from 'path';
import { World } from '../models/world';
import { Camera } from '../models/camera';
import { mat4 } from 'gl-matrix';
import * as util from '../../util';

/** Raw shader code in string  */
let code=
`
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
uniform mat4 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 interpolatedNormal;//in model view space
varying vec3 vertexPosition;//without the prespective transform
varying vec3 diffuseColor;
void main(){

	// if you don't use these vectors, you can't get their location in the application code
	vec2 t=texCoord;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	interpolatedNormal = vec3(normalMatrix * vec4(normal,0));
	vertexPosition = vec3(modelViewMatrix * vec4(position,1.0));
	diffuseColor=vec3(0.77, 0.37, 0.61);//TODO use tex coords or material's fixed color
}
`
;

const FLOAT_SIZE=4;

/** Expects 8 floats per vertex : position(3) + normal(3) + texture coordinates(3) */
export class StandardVertexShader extends VertexShader{

	getSourceCode():string{
		return code;
	}

	drawSetup(GL:WebGLRenderingContext,glDrawable:GLDrawable,world:World){

		this.sendDownUniformData(GL,glDrawable,world.camera);
		this.sendDownPerVertexData(GL,glDrawable);
	}

	protected sendDownPerVertexData(GL:WebGLRenderingContext,glDrawable:GLDrawable){
		//8 floats per vertex
		let stride = 8 * FLOAT_SIZE;

		//get position location,enable that location(or index), and send data to that 'index'
		let positionLocation = GL.getAttribLocation(glDrawable.webGLProgram, "position");
		GL.enableVertexAttribArray(positionLocation);
		GL.vertexAttribPointer(positionLocation, 3, GL.FLOAT, false, stride, 0);//first 3 floats

		//get normal location,enable that location(or index), and send data to that 'index'
		let normalLocation = GL.getAttribLocation(glDrawable.webGLProgram, "normal");
		GL.enableVertexAttribArray(normalLocation);
		GL.vertexAttribPointer(normalLocation, 3, GL.FLOAT, false, stride, 3 * FLOAT_SIZE);//next 3 floats

		//get texCoord location,enable that location(or index), and send data to that 'index'
		let texCoordLocation = GL.getAttribLocation(glDrawable.webGLProgram, "texCoord");
		GL.enableVertexAttribArray(texCoordLocation);
		GL.vertexAttribPointer(texCoordLocation, 2, GL.FLOAT, false, stride, 6 * FLOAT_SIZE);//final 2 floats after first 6 floats
	}

	protected sendDownUniformData(GL:WebGLRenderingContext,glDrawable:GLDrawable,camera:Camera){

		//model transformation to world space
		let worldMatrix=mat4.create();
		mat4.translate(worldMatrix,worldMatrix,glDrawable.translation.asArray());
		mat4.scale(worldMatrix,worldMatrix,glDrawable.scale.asArray());
		mat4.rotateZ(worldMatrix,worldMatrix,util.toRadians(glDrawable.rotation.z));
		mat4.rotateY(worldMatrix,worldMatrix,util.toRadians(glDrawable.rotation.y));
		mat4.rotateX(worldMatrix,worldMatrix,util.toRadians(glDrawable.rotation.x));
		// util.setDiagonal(worldMatrix,glDrawable.scale);

		//view matrix
		let viewMatrix=mat4.create();
		mat4.lookAt(viewMatrix,camera.origin.asVec3(),camera.lookAt.asVec3(),camera.up.asVec3());

		//model view matrix
		let modelViewMatrix=mat4.create();
		mat4.multiply(modelViewMatrix,viewMatrix,worldMatrix);
		let modelViewMatrixLocation=GL.getUniformLocation(glDrawable.webGLProgram,"modelViewMatrix");
		GL.uniformMatrix4fv(modelViewMatrixLocation,false,modelViewMatrix);

		//normal matrix
		let normalMatrix=mat4.create();
		mat4.invert(normalMatrix,modelViewMatrix);
		mat4.transpose(normalMatrix,normalMatrix);
		let normalMatrixLocation=GL.getUniformLocation(glDrawable.webGLProgram,"normalMatrix");
		GL.uniformMatrix4fv(normalMatrixLocation,false,normalMatrix);

		//projection matrix
		let projectionMatrix=mat4.create();
		// mat4.perspective(projectionMatrix, camera.fieldOfViewInRadians(),camera.aspectRatio(),0.1,100);//doesn't work
		mat4.frustum(projectionMatrix,camera.left,camera.right,camera.bottom,camera.top,camera.near,camera.far);//uses traditional formula
		let projectionMatrixLocation=GL.getUniformLocation(glDrawable.webGLProgram,"projectionMatrix");
		GL.uniformMatrix4fv(projectionMatrixLocation,false,projectionMatrix);
	}

}