import { GLDrawable } from './gl-drawable';

export class FixedVertexDrawable extends GLDrawable{
	vertices:number[];

	constructor(){
		super();
		this.vertices=[
			0,0,0,
			0,0.6,0,
			0.9,0,0
		]
	}

	vertexData():Float32Array{
		return new Float32Array(this.vertices);
	}
}