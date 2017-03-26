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

export class StandardVertexShader implements VertexShader{

	/** commmon vertex shader id shader across all shaders */
	static readonly vertexShaderId:number=-1;

	static loadFromDirectory(url:string){
		// load up the text resource for the standard vertex shader

	}

	getShaderId():number{
		return StandardVertexShader.vertexShaderId;
	}

	init(GLDrawable:GLDrawable,gl:WebGLRenderingContext){
		
	}

	draw(GLDrawable:GLDrawable,gl:WebGLRenderingContext){
		
	}

}