import { GLDrawable } from './gl-drawable';

export class FixedVertexDrawable extends GLDrawable{
	vertices:number[];

	constructor(){
		super();
		//counter clockwise vertices
		this.vertices=[
			0,0,-1,
			20,0,-1,
			0,20,-1
		];
	}

	vertexData():Float32Array{
		return new Float32Array(this.vertices);
	}
}