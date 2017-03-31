import { GLDrawable } from './gl-drawable';

export class FixedVertexDrawable extends GLDrawable{
	count:number;
	vertices:number[];
	elements:number[];

	constructor(){
		super();
		this.simpleTriangle();
	}

	simpleTriangle(){
		this.count=3;

		//counter clockwise vertices
		this.vertices=[
			0,0,-1,0,0,1,0,0,
			20,0,-1,0,0,1,1,0,
			0,20,-1,0,0,1,0,1
		];

		this.elements=[
			0,1,2
		];
	}

	vertexCount():number{
		return this.count;
	}

	vertexData():Float32Array{
		return new Float32Array(this.vertices);
	}

	elementIndices():Uint16Array{
		return new Uint16Array(this.elements);
	}
}