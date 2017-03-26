import { VertexShader,FragmentShader } from './shader';

export abstract class GLDrawable{
	positionBufferId:number;
	textureBufferIds:number[]=[];
	shaderProgramId:number;
	vertexShader:VertexShader;
	fragmentShader:FragmentShader;

	init(gl:WebGLRenderingContext){

	}

	draw(gl:WebGLRenderingContext){

	}
}