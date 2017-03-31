import { StandardVertexShader } from './standard-vertex-shader';
import { StandardFragmentShader } from './standard-fragment-shader';
import * as Promise from 'bluebird';
import { VertexShader,FragmentShader } from './shader';
import { Vector } from '../models/vector';
import { Point } from '../models/point';
import { Camera } from '../models/camera';
import { Light } from '../models/light';

export abstract class GLDrawable{
	private _scale:Vector;
	private _rotation:Vector;
	private _translation:Point;

	private _webGLProgram:WebGLProgram;
	private _vertexBuffer:WebGLBuffer;
	private _elementBuffer:WebGLBuffer;
	private _textureBufferIds:number[]=[];
	private _vertexShader:VertexShader;
	private _fragmentShader:FragmentShader;

	constructor(){

		//use standard shaders
		this._vertexShader=new StandardVertexShader();
		this._fragmentShader=new StandardFragmentShader();

		//initialize with default values:
		this.scale=new Vector(1,1,1);
		this.rotation=new Vector(0,0,0);
		this.translation=new Point(0,0,0);

	}

	abstract vertexCount():number;

	/** Vertex data as an continous array of values. Must be Counter Clockwise */
	abstract vertexData():Float32Array;

	/** Index data corresponding to vertices.*/
	abstract elementIndices():Uint16Array;

	get webGLProgram():WebGLProgram{
		return this._webGLProgram;
	}

	get vertexShader():VertexShader{
		return this._vertexShader;
	}

	get fragmentShader():FragmentShader{
		return this._fragmentShader;
	}

	get vertexBuffer():WebGLBuffer{
		return this._vertexBuffer;
	}

	get elementBuffer():WebGLBuffer{
		return this._elementBuffer;
	}

	get scale():Vector{
		return this._scale;
	}

	set scale(v:Vector){
		this._scale=v;
	}

	get rotation():Vector{
		return this._rotation;
	}

	set rotation(v:Vector){
		this._rotation=v;
	}

	get translation():Point{
		return this._translation;
	}

	set translation(v:Point){
		this._translation=v;
	}

	init(GL:WebGLRenderingContext):boolean{//=2 steps

		//shader program
		let shaderSuccess = this.createShaderProgram(GL);
		
		//set vertex data if successful
		if(shaderSuccess){
			this.createVertexBuffer(GL);
		}

		return shaderSuccess;
	}

	private createShaderProgram(GL:WebGLRenderingContext):boolean{//=7 steps
		//build shaders from their source code
		this.vertexShader.init(GL,this);
		this.fragmentShader.init(GL,this);

		//create a shader program to house the two shaders
		this._webGLProgram=GL.createProgram();

		//attach the two shaders
		GL.attachShader(this.webGLProgram,this.vertexShader.shaderId);
		GL.attachShader(this.webGLProgram,this.fragmentShader.shaderId);

		//link program 
		GL.linkProgram(this.webGLProgram);

		//check linking status:
		if(GL.getProgramParameter(this.webGLProgram,GL.LINK_STATUS)){

			//successful linking
			return true;
		}else{

			//failed linking
			console.error(GL.getProgramInfoLog(this.webGLProgram));
			GL.deleteProgram(this.webGLProgram);
			return false;
		}
	}

	private createVertexBuffer(GL:WebGLRenderingContext){//=3 steps

		//create vertex buffer object
		this._vertexBuffer=GL.createBuffer();

		//bind to array buffer 
		GL.bindBuffer(GL.ARRAY_BUFFER,this.vertexBuffer);

		//supply points of this drawable
		let vertexData=this.vertexData();
		GL.bufferData(GL.ARRAY_BUFFER,vertexData,GL.STATIC_DRAW);

		//create a element buffer
		this._elementBuffer=GL.createBuffer();

		//bind to that element array buffer
		GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,this.elementBuffer);

		//supply indices for that vertex
		GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,this.elementIndices(),GL.STATIC_DRAW);

	} 

	drawSetup(GL:WebGLRenderingContext,camera:Camera,lights:Light[]){//=4 steps
		//use the shader program we setup earlier, 
		GL.useProgram(this.webGLProgram);

		//bind this drawable's vertex buffer to the array buffer(TODO later elements array buffer)
		GL.bindBuffer(GL.ARRAY_BUFFER,this.vertexBuffer);

		//vertex shader's setup
		this.vertexShader.drawSetup(GL,this,camera,lights);

		//fragment shader's setup
		this.fragmentShader.drawSetup(GL,this,camera,lights);
	}
}