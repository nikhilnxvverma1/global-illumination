import { GLDrawable } from './gl-drawable';
import { toRadians } from '../../util';
import { Point } from '../models/point';
import { Vector } from '../models/vector';


export class CustomVertexDrawable extends GLDrawable{
	vertices:number[];
	elements:number[];

	constructor(){
		super();
	}

	vertexData():Float32Array{
		return new Float32Array(this.vertices);
	}

	elementIndices():Uint16Array{
		return new Uint16Array(this.elements);
	}

	triangle():CustomVertexDrawable{//=3 steps

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

	cube(side=2):CustomVertexDrawable{//=3 steps

		//half side
		let h=side/2;

		//vertex : position(3) + normal(3) + tex coords(2)
		//TODO tex coords are currently dummy
		this.vertices = [
			// Front face
			-h, -h,  h, 0,0,1,0,0,
			h, -h,  h, 0,0,1,0,0,
			h,  h,  h, 0,0,1,0,0,
			-h,  h,  h, 0,0,1,0,0,
			
			// Back face
			-h, -h, -h, 0,0,-1,0,0,
			-h,  h, -h, 0,0,-1,0,0,
			h,  h, -h, 0,0,-1,0,0,
			h, -h, -h, 0,0,-1,0,0,
			
			// Top face
			-h,  h, -h, 0,1,0,0,0,
			-h,  h,  h, 0,1,0,0,0,
			h,  h,  h, 0,1,0,0,0,
			h,  h, -h, 0,1,0,0,0,
			
			// Bottom face
			-h, -h, -h, 0,-1,0,0,0,
			h, -h, -h, 0,-1,0,0,0,
			h, -h,  h, 0,-1,0,0,0,
			-h, -h,  h, 0,-1,0,0,0,
			
			// Right face
			h, -h, -h, 1,0,0,0,0,
			h,  h, -h, 1,0,0,0,0,
			h,  h,  h, 1,0,0,0,0,
			h, -h,  h, 1,0,0,0,0,
			
			// Left face
			-h, -h, -h, -1,0,0,0,0,
			-h, -h,  h, -1,0,0,0,0,
			-h,  h,  h, -1,0,0,0,0,
			-h,  h, -h, -1,0,0,0,0
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


	sphere(diameter:number=2):CustomVertexDrawable{
		let radius=diameter/2;
		let center=new Point(0,0,0);

		// IMP: these steps must divide 180 evenly
		let vStep=5;
		let hStep=5;

		const verticesInACircle = 360 / hStep;
		const verticesInSphere = 1 + (180 / vStep - 2 + 1) * verticesInACircle + 1;

		let verticesSoFar=0;
		this.vertices=[];
		this.elements=[];

		//vertical down (top to bottom in y)
		for (let i = 0; i <= 180; i += vStep) {

			let y = radius * Math.sin(toRadians(90 - i));
			if(i==0){

				let pointOnSphere = new Point(0, y, 0);
				let normalOnPoint = Vector.between(center,pointOnSphere);
				this.addVertex(pointOnSphere,normalOnPoint);
				verticesSoFar++;
				
			}else if(i==180){


				let pointOnSphere = new Point(0, y, 0);
				let normalOnPoint = Vector.between(center,pointOnSphere);
				this.addVertex(pointOnSphere,normalOnPoint);
				verticesSoFar++;

			}else{

				//disk (circle in the xz plane)
				let armAngle = (90 - Math.abs(90 - i)) 
				let diskRadius= Math.sin(toRadians(armAngle)) * radius;//the more you move away from center, the smaller the disk radius
				const startingCircleElement = verticesSoFar;
				for (let j = 0; j < 360; j += hStep) {

					let x = diskRadius * Math.cos(toRadians(j));
					let z = diskRadius * Math.sin(toRadians(j));

					let pointOnSphere = new Point(x, y, z);
					let normalOnPoint = Vector.between(center,pointOnSphere);
					this.addVertex(pointOnSphere,normalOnPoint);
					verticesSoFar++;

					//element index for this vertex and the next(in possible future)
					const thisElement = verticesSoFar - 1;
					const nextElement = j == 360-hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

					if (i - vStep == 0) {// previous height was the top polar point

						//top polar point
						const polarPointElement = 0;

						//make a triangle using these 3 vertices (counter clockwise)
						this.elements.push(thisElement);
						this.elements.push(nextElement);
						this.elements.push(polarPointElement);

					}else if (i + vStep == 180) {// next height is the bottom polar point(last vertex)

						//top polar point (will always be last)
						const polarPointElement = verticesInSphere -1;

						//make a triangle using these 3 vertices (counter clockwise)
						this.elements.push(polarPointElement);
						this.elements.push(nextElement);
						this.elements.push(thisElement);
					}
					else{// previous height was a circle, connect to vertices of the circle of previous height

						//corresponding vertex elements of previous height
						const thisElementCorresponding = thisElement - verticesInACircle;
						const nextElementCorresponding = nextElement - verticesInACircle;

						//make a quad using these 4 vertices (counter clockwise)
						this.elements.push(thisElement);
						this.elements.push(nextElement);
						this.elements.push(thisElementCorresponding);

						this.elements.push(nextElement);
						this.elements.push(nextElementCorresponding);
						this.elements.push(thisElementCorresponding);
					}
				}
			}
		}
		return this;
	}

	/** Adds vertex data and returns the element index for this position */
	protected addVertex(position:Point,normal:Vector,texCoords=new Point(0,0)):number{

		//only for first index return 0
		let elementIndexForThisVertex = this.vertices.length == 0 ? 0 : this.vertices.length / 8 + 1;

		//vertices
		this.vertices.push(position.x);
		this.vertices.push(position.y);
		this.vertices.push(position.z);
		
		//normal
		normal.normalize();
		this.vertices.push(normal.x);
		this.vertices.push(normal.y);
		this.vertices.push(normal.z);

		//texture coordinates
		this.vertices.push(texCoords.x);
		this.vertices.push(texCoords.y);

		return elementIndexForThisVertex;
	}
}