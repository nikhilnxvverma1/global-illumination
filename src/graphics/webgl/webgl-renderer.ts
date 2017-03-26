import { Renderer } from '../renderer';
import { World } from '../models/world';
import { loadTextResource } from '../../file-util';
import { readFileSync } from 'fs';
import * as Promise from 'bluebird';
import { GLDrawable } from './gl-drawable';
import { StandardFragmentShader } from './standard-fragment-shader';
import { StandardVertexShader } from './standard-vertex-shader';

export class WebGLRenderer implements Renderer{
	gl:WebGLRenderingContext;
	projectLocation:string
	world:World;

	constructor(gl:WebGLRenderingContext,projectLocaiton:string){
		this.gl=gl;
		this.projectLocation=projectLocaiton;
	}

	collectAllDrawables():GLDrawable[]{
		return this.world.geometryList;
	}

	draw(){//=? units

		//alias to this.gl
		let GL=this.gl;

		//collect up all the gldrawables that we need to render
		let drawableList=this.collectAllDrawables();

		//fire off the initialization on each drawable and collect their promises in another array
		let promisesAfterInit:Promise<any>[]=[];
		for(let drawable of drawableList){
			promisesAfterInit.push(drawable.init(GL));
		}


		//initialization:
		// load up the standard vertex shader
		// let standardVertexShader=fs.readFileSync("../standard.vert.glsl");
		// var vertexShaderId=createShader(GL,GL.VERTEX_SHADER,standardVertexShader);
		// loadTextResource("../standard.vert.glsl",(error:Error,standardVertexShader:string)=>{

		// 	//load up the standard fragment shader
		// 	loadTextResource("../standard.vert.glsl",(error:Error,standardFragmentShader:string)=>{
		// 		var fragmentShaderId=createShader(GL,GL.VERTEX_SHADER,standardFragmentShader);


		// 	});
		// });
				//rendering:
				requestAnimationFrame(this.step.bind(this));

	}

	step(time: number): void{//=1 units

		//alias to this.gl
		let GL=this.gl;

		//create the two shaders and put them in a program
		var vertexShaderId=createShader(GL,GL.VERTEX_SHADER,vertexShader);
		var fragmentShaderId=createShader(GL,GL.FRAGMENT_SHADER,fragmentShader);

		//put these two shaders in a list and create a program
		var program=createProgram(GL,[vertexShaderId,fragmentShaderId]);

		//get the location to the position attribute defined in the vertex shader
		var positionLocation=GL.getAttribLocation(program,"position");

		//create and bind a new buffer, and use the models to set positional attributes to it.
		var positionBuffer=GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER,positionBuffer);


		//------Rendering------
		GL.viewport(0,0,GL.canvas.width,GL.canvas.height);

		//clear to a black color
		GL.clearColor(0,0,0,0);
		GL.clear(GL.COLOR_BUFFER_BIT);

		//use the shader program we setup earlier, 
		GL.useProgram(program);

		//enable array for position attribute of vertex shader
		GL.enableVertexAttribArray(positionLocation);

		//to send data to the position attribute, we must first bind to that attribute's location
		GL.bindBuffer(GL.ARRAY_BUFFER,positionBuffer);

		//set buffer data based on the models
		var points=[
			0,0,
			0,0.6,
			0.9,0
		]
		GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(points),GL.STATIC_DRAW);
		GL.vertexAttribPointer(positionLocation,2,GL.FLOAT,false,0,0);

		//draw the triangles as set by the position buffers
		GL.drawArrays(GL.TRIANGLES,0,3);

		//request another frame on this same method
		requestAnimationFrame(this.step.bind(this));
	}
}


//Vertex Shader
var vertexShader=`
	attribute vec4 position;
	void main(){
		gl_Position=position;
	}
`;

//Fragment Shader
var fragmentShader=`
	void main(){
		gl_FragColor=vec4(0.4,0.3,0.8,1);
	}
`;

function createShader(gl,shaderType,sourceCode){
	var shaderId=gl.createShader(shaderType);
	gl.shaderSource(shaderId,sourceCode);
	gl.compileShader(shaderId);
	var compileStatus=gl.getShaderParameter(shaderId,gl.COMPILE_STATUS);
	if(compileStatus){
		return shaderId;
	}else{
		console.error(gl.getShaderInfoLog(shaderId));
		gl.deleteShader(shaderId);
		return null;//something went wrong
	}
}

function createProgram(GL,shaderList){
	//create a program and attach all shaders to this program
	var program=GL.createProgram();
	for(var i=0;i<shaderList.length;i++){
		GL.attachShader(program,shaderList[i]);
	}

	GL.linkProgram(program);
	if(GL.getProgramParameter(program,GL.LINK_STATUS)){
		return program;
	}else{
		console.error(GL.getProgramInfoLog(program));
		GL.deleteProgram(program);
	}
}