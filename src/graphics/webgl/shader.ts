import { GLDrawable } from './gl-drawable';

export interface VertexShader{
	getShaderId():number; 
	init(glDrawable:GLDrawable,gl:WebGLRenderingContext);
	draw(glDrawable:GLDrawable,gl:WebGLRenderingContext);
}

export interface FragmentShader{
	getShaderId():number; 
	init(glDrawable:GLDrawable,gl:WebGLRenderingContext);
	draw(glDrawable:GLDrawable,gl:WebGLRenderingContext);
}