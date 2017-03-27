import { StandardVertexShader } from './standard-vertex-shader';
import { StandardFragmentShader } from './standard-fragment-shader';
import * as Promise from 'bluebird';
import { VertexShader,FragmentShader } from './shader';

export abstract class GLDrawable{
	positionBufferId:number;
	textureBufferIds:number[]=[];
	shaderProgram:WebGLProgram;
	vertexShader:VertexShader;
	fragmentShader:FragmentShader;

	constructor(){

		//standard shaders
		this.vertexShader=new StandardVertexShader();
		this.fragmentShader=new StandardFragmentShader();

	}

	init(GL:WebGLRenderingContext):boolean{//=7 steps

		//build shaders from their source code
		this.vertexShader.init(GL,this);
		this.fragmentShader.init(GL,this);

		//create a shader program to house the two shaders
		this.shaderProgram=GL.createProgram();

		//attach the two shaders
		GL.attachShader(this.shaderProgram,this.vertexShader);
		GL.attachShader(this.shaderProgram,this.fragmentShader);

		//link program 
		GL.linkProgram(this.shaderProgram);

		//check linking status:
		if(GL.getProgramParameter(this.shaderProgram,GL.LINK_STATUS)){

			//successful linking
			return true;
		}else{

			//failed linking
			console.error(GL.getProgramInfoLog(this.shaderProgram));
			GL.deleteProgram(this.shaderProgram);
			return false;
		}
	}

	draw(GL:WebGLRenderingContext){

	}
}