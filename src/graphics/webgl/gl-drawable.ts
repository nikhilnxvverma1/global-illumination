import { VertexShader,FragmentShader } from './shader';
import { StandardVertexShader } from './standard-vertex-shader';
import { StandardFragmentShader } from './standard-fragment-shader';
import * as Promise from 'bluebird';

export abstract class GLDrawable{
	positionBufferId:number;
	textureBufferIds:number[]=[];
	shaderProgramId:number;
	vertexShader:VertexShader;
	fragmentShader:FragmentShader;

	constructor(){
		this.vertexShader=new StandardVertexShader();
		this.fragmentShader=new StandardFragmentShader();
	}

	init(gl:WebGLRenderingContext):Promise<any>{//=1 step

		//load up any vertex and texture resources that may be needed

		this.vertexShader.init(this,gl);
		this.fragmentShader.init(this,gl);
		return null;
	}

	draw(gl:WebGLRenderingContext){

	}
}