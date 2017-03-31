import { Renderer } from '../renderer';
import { World } from '../models/world';
import { loadTextResource } from '../../file-util';
import { readFileSync } from 'fs';
import * as Promise from 'bluebird';
import { GLDrawable } from './gl-drawable';
import { StandardFragmentShader } from './standard-fragment-shader';
import { StandardVertexShader } from './standard-vertex-shader';
import { CustomVertexDrawable } from './custom-vertex-drawable';
import { Vector } from '../models/vector';
import { InitAction,UpdateAction } from './behavior';

export class WebGLRenderer implements Renderer{
	gl:WebGLRenderingContext;
	projectLocation:string
	world:World;
	private lastTime;

	private drawableList:GLDrawable[];//TODO temporary

	constructor(gl:WebGLRenderingContext,projectLocaiton:string){
		this.gl=gl;
		this.projectLocation=projectLocaiton;
	}

	collectAllDrawables():GLDrawable[]{
		let cube=new CustomVertexDrawable().cube();
		cube.translation.z=-1.1;
		cube.updateActions.push((dTime:number,drawable:GLDrawable,GL:WebGLRenderingContext)=>{
			
		});

		return [cube];
	}

	draw(){//=4 steps

		//alias to this.gl
		let GL=this.gl;

		//all the drawables in a list
		this.drawableList=this.collectAllDrawables();

		//initialize drawables
		for(let drawable of this.drawableList){
			drawable.init(GL);
		}

		//rendering:
		this.lastTime=-1;
		requestAnimationFrame(this.step.bind(this));

	}

	step(time:number):void{//=7 steps

		//delta time
		let dTime = this.computeDeltaTime(time);

		//alias to this.gl
		let GL=this.gl;

		//set the viewport
		GL.viewport(0,0,GL.canvas.width,GL.canvas.height);

		//clear background to a black color
		GL.clearColor(0,0,0,0);
		GL.clear(GL.COLOR_BUFFER_BIT);

		//setup depth testing and culling
		GL.enable(GL.DEPTH_TEST);
		GL.enable(GL.CULL_FACE);
		GL.frontFace(GL.CCW);
		GL.cullFace(GL.BACK);

		//draw each after setting up vertex shaders and fragment shaders
		for(let drawable of this.drawableList){
			drawable.drawSetup(GL,this.world.camera,this.world.lightList,dTime);
			GL.drawElements(GL.TRIANGLES,drawable.vertexCount(),GL.UNSIGNED_SHORT,<number>drawable.elementBuffer);
		}

		//request another animation frame to play this in a loop
		requestAnimationFrame(this.step.bind(this));
	}

	/** compute delta time by comparing with last time */
	private computeDeltaTime(time:number){
		let dTime=0;
		if(this.lastTime!=-1){
			dTime=time-this.lastTime;
		}
		this.lastTime=time;
		return dTime;
	}
}