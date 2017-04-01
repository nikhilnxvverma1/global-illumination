import { GLDrawable } from './gl-drawable';

/** 
 * Objects that listen to the lifecycle events during a start ad render loop stages.
 */
export interface Behavior{
	start();
	update(dTime:number);
}

/** Action to perform at the initialization of a drawable. Use bind to enable using 'this' inside an implementing object */
export interface InitAction{
	(drawable:GLDrawable,GL:WebGLRenderingContext);
}

/** Action to perform for each frame of the drawable. Use bind to enable using 'this' inside an implementing object */
export interface UpdateAction{
	(dTime:number,drawable:GLDrawable,GL:WebGLRenderingContext);
}

/** Listens to lifecycle events of a drawable */
export interface DrawableBehavior extends Behavior{
	drawable:GLDrawable;
}