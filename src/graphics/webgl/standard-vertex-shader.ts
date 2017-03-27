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

	draw(GLDrawable:GLDrawable,gl:WebGLRenderingContext){
		
	}

}