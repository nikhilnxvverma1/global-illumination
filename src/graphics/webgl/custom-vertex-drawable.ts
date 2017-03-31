import { GLDrawable } from './gl-drawable';

export class CustomVertexDrawable extends GLDrawable{
	count:number;
	vertices:number[];
	elements:number[];

	constructor(){
		super();
	}

	triangle():CustomVertexDrawable{//=3 steps
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

		return this;
	}

	cube():CustomVertexDrawable{//=3 steps
		this.count=24;

		//vertices without normal or tex coords
		// this.vertices = [
		// 	// Front face
		// 	-1.0, -1.0,  1.0,
		// 	1.0, -1.0,  1.0,
		// 	1.0,  1.0,  1.0,
		// 	-1.0,  1.0,  1.0,
			
		// 	// Back face
		// 	-1.0, -1.0, -1.0,
		// 	-1.0,  1.0, -1.0,
		// 	1.0,  1.0, -1.0,
		// 	1.0, -1.0, -1.0,
			
		// 	// Top face
		// 	-1.0,  1.0, -1.0,
		// 	-1.0,  1.0,  1.0,
		// 	1.0,  1.0,  1.0,
		// 	1.0,  1.0, -1.0,
			
		// 	// Bottom face
		// 	-1.0, -1.0, -1.0,
		// 	1.0, -1.0, -1.0,
		// 	1.0, -1.0,  1.0,
		// 	-1.0, -1.0,  1.0,
			
		// 	// Right face
		// 	1.0, -1.0, -1.0,
		// 	1.0,  1.0, -1.0,
		// 	1.0,  1.0,  1.0,
		// 	1.0, -1.0,  1.0,
			
		// 	// Left face
		// 	-1.0, -1.0, -1.0,
		// 	-1.0, -1.0,  1.0,
		// 	-1.0,  1.0,  1.0,
		// 	-1.0,  1.0, -1.0
		// ];

		//vertex : position(3) + normal(3) + tex coords(2)
		//TODO normal and tex coords are currently dummy
		this.vertices = [
			// Front face
			-1.0, -1.0,  1.0, 0,0,0,0,0,
			1.0, -1.0,  1.0, 0,0,0,0,0,
			1.0,  1.0,  1.0, 0,0,0,0,0,
			-1.0,  1.0,  1.0, 0,0,0,0,0,
			
			// Back face
			-1.0, -1.0, -1.0, 0,0,0,0,0,
			-1.0,  1.0, -1.0, 0,0,0,0,0,
			1.0,  1.0, -1.0, 0,0,0,0,0,
			1.0, -1.0, -1.0, 0,0,0,0,0,
			
			// Top face
			-1.0,  1.0, -1.0, 0,0,0,0,0,
			-1.0,  1.0,  1.0, 0,0,0,0,0,
			1.0,  1.0,  1.0, 0,0,0,0,0,
			1.0,  1.0, -1.0, 0,0,0,0,0,
			
			// Bottom face
			-1.0, -1.0, -1.0, 0,0,0,0,0,
			1.0, -1.0, -1.0, 0,0,0,0,0,
			1.0, -1.0,  1.0, 0,0,0,0,0,
			-1.0, -1.0,  1.0, 0,0,0,0,0,
			
			// Right face
			1.0, -1.0, -1.0, 0,0,0,0,0,
			1.0,  1.0, -1.0, 0,0,0,0,0,
			1.0,  1.0,  1.0, 0,0,0,0,0,
			1.0, -1.0,  1.0, 0,0,0,0,0,
			
			// Left face
			-1.0, -1.0, -1.0, 0,0,0,0,0,
			-1.0, -1.0,  1.0, 0,0,0,0,0,
			-1.0,  1.0,  1.0, 0,0,0,0,0,
			-1.0,  1.0, -1.0, 0,0,0,0,0
		];

		this.elements= [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23    // left
			];

		return this;
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