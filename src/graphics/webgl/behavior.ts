import { GLDrawable } from './gl-drawable';

/** 
 * Objects that listen to the lifecycle events of a drawable.
 * Internally they are init and update actions that are attached 
 * to the drawable but these objects are also binded so as to enable 
 * the use of 'this' in the function  handlers
 */
export interface Behavior{
	initAction:InitAction;
	updateAction:UpdateAction;
}

/** Action to perform at the initialization of a drawable. Use bind to enable using 'this' inside an implementing object */
export interface InitAction{
	(drawable:GLDrawable,GL:WebGLRenderingContext);
}

/** Action to perform for each frame of the drawable. Use bind to enable using 'this' inside an implementing object */
export interface UpdateAction{
	(dTime:number,drawable:GLDrawable,GL:WebGLRenderingContext);
}

export class ScaleUpAndDown implements Behavior{
	initAction(drawable:GLDrawable,GL:WebGLRenderingContext){

	}

	updateAction(dTime:number,drawable:GLDrawable,GL:WebGLRenderingContext){
		
	}
}