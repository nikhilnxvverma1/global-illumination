import { GLDrawable } from './gl-drawable';
import { GLScene } from "../models/scene";

export abstract class Shader{
	private _shaderId:WebGLShader;

	get shaderId():WebGLShader{
		return this._shaderId;
	}
	/** Returns GL.VERTEX_SHADER or GL.FRAGMENT_SHADER depending on whose extending this */
	abstract getShaderType():number;

	/** Returns the shader's raw source code as a string */
	abstract getSourceCode():string;

	/** Sets up the shader by compiling its sources */
	init(GL:WebGLRenderingContext,glDrawable:GLDrawable){//=5 units

		//make shader id 
		this._shaderId=GL.createShader(this.getShaderType());

		//compile shader
		GL.shaderSource(this.shaderId,this.getSourceCode());
		GL.compileShader(this.shaderId);

		//check compilation status:
		let compileStatus=GL.getShaderParameter(this.shaderId,GL.COMPILE_STATUS);
		if(compileStatus){

			//successful compilation
			return this.shaderId;
		}else{

			//error in compilation
			console.error(GL.getShaderInfoLog(this.shaderId));
			GL.deleteShader(this.shaderId);
			return null;//something went wrong
		}
	}

	/** Responsible for setting up any data that needs to be passed down to the shaders */
	abstract drawSetup(GL:WebGLRenderingContext,glDrawable:GLDrawable,scene:GLScene);
}

export abstract class VertexShader extends Shader{
	getShaderType():number{
		return WebGLRenderingContext.VERTEX_SHADER;
	}
}

export abstract class FragmentShader extends Shader{
	getShaderType():number{
		return WebGLRenderingContext.FRAGMENT_SHADER;
	}
}