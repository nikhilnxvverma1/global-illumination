import { Renderer } from './renderer';

export class WebGLRenderer implements Renderer{
	gl:WebGLRenderingContext;

	constructor(gl:WebGLRenderingContext){
		this.gl=gl;
	}

	draw(){

	}
}