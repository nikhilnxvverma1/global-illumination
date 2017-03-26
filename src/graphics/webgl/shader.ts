import { GLDrawable } from './gl-drawable';

export interface VertexShader{
	vertexShaderId:number;
	init(glDrawable:GLDrawable,gl:WebGLRenderingContext);
	draw(glDrawable:GLDrawable,gl:WebGLRenderingContext);
}

export interface FragmentShader{
	fragmentShaderId:number;
	init(glDrawable:GLDrawable,gl:WebGLRenderingContext);
	draw(glDrawable:GLDrawable,gl:WebGLRenderingContext);
}