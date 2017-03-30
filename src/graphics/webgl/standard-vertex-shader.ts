import { GLDrawable } from './gl-drawable';
import { VertexShader } from './shader';
import { loadTextResource } from '../../file-util';
import * as Promise from 'bluebird';
import * as path from 'path';
import { Camera } from '../models/camera';
import { Light } from '../models/light';
import { mat4 } from 'gl-matrix';
import * as util from '../../util';

/** Raw shader code in string  */
let code=
`
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
uniform mat4 compositeMatrix;
void main(){

	// if you don't use these vectors, you can't get their location in the application code
	vec3 n=normal;
	vec2 t=texCoord;
	
	gl_Position=compositeMatrix * vec4(position,1.0);
}
`
;

const FLOAT_SIZE=4;

/** Expects 8 floats per vertex : position(3) + normal(3) + texture coordinates(3) */
export class StandardVertexShader extends VertexShader{

	getSourceCode():string{
		return code;
	}

	drawSetup(GL:WebGLRenderingContext,glDrawable:GLDrawable,camera:Camera,lights:Light[]){//=5 steps

		//composite matrix
		this.buildAndSendCompositeMatrix(GL,glDrawable,camera);

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

	buildAndSendCompositeMatrix(GL:WebGLRenderingContext,glDrawable:GLDrawable,camera:Camera){//=5 steps

		//model transformation to world space
		let worldMatrix=mat4.create();
		mat4.scale(worldMatrix,worldMatrix,glDrawable.scale.asArray());
		mat4.rotateX(worldMatrix,worldMatrix,util.toRadians(glDrawable.rotation.x));
		mat4.rotateY(worldMatrix,worldMatrix,util.toRadians(glDrawable.rotation.y));
		mat4.rotateZ(worldMatrix,worldMatrix,util.toRadians(glDrawable.rotation.z));
		mat4.translate(worldMatrix,worldMatrix,glDrawable.translation.asArray());

		//view matrix
		let viewMatrix=mat4.create();
		mat4.lookAt(viewMatrix,camera.origin.asVec3(),camera.lookAt.asVec3(),camera.up.asVec3());

		//perspective
		let projectionMatrix=mat4.create();
		// mat4.perspective(projectionMatrix, camera.fieldOfViewInRadians(),camera.aspectRatio(),0.1,100);//doesn't work
		mat4.frustum(projectionMatrix,camera.left,camera.right,camera.bottom,camera.top,camera.near,camera.far);//uses traditional formula

		//composite matrix
		let compositeMatrix=mat4.create();
		mat4.multiply(compositeMatrix,viewMatrix,worldMatrix);
		mat4.multiply(compositeMatrix,projectionMatrix,compositeMatrix);

		//send it down to the shader
		let compositeMatrixLocation=GL.getUniformLocation(glDrawable.webGLProgram,"compositeMatrix");
		GL.uniformMatrix4fv(compositeMatrixLocation,false,compositeMatrix);
	}

}