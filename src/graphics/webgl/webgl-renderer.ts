import { Renderer } from '../renderer';
import { World } from '../models/world';

export class WebGLRenderer implements Renderer{
	gl:WebGLRenderingContext;
	world:World;

	constructor(gl:WebGLRenderingContext){
		this.gl=gl;
	}

	draw(){
		requestAnimationFrame(this.step.bind(this));
	}

	step(time: number): void{

		//request another frame on this same method
		requestAnimationFrame(this.step.bind(this));
	}
}
