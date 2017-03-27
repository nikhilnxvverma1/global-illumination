import { GLDrawable } from './gl-drawable';
import { VertexShader } from './shader';
import { loadTextResource } from '../../file-util';
import * as Promise from 'bluebird';
import * as path from 'path';

/** Raw shader code in string  */
let code=
`
attribute vec4 position;
void main(){
	gl_Position=position;
}
`
;

export class StandardVertexShader extends VertexShader{

	getSourceCode():string{
		return code;
	}

	drawSetup(GL:WebGLRenderingContext,glDrawable:GLDrawable){//=3 steps

		//position location
		let positionLocation=GL.getAttribLocation(glDrawable.webGLProgram,"position");

		//enable array for this position attribute
		GL.enableVertexAttribArray(positionLocation);

		//supply position location to shader
		GL.vertexAttribPointer(positionLocation,2,GL.FLOAT,false,0,0);
	}

}