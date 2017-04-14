import { GLDrawable } from './gl-drawable';
import { toRadians,toDegrees } from '../../util';
import { Point } from '../models/point';
import { Vector } from '../models/vector';


export class CustomVertexDrawable extends GLDrawable {
	vertices: number[];
	elements: number[];

	constructor() {
		super();
	}

	vertexData(): Float32Array {
		return new Float32Array(this.vertices);
	}

	elementIndices(): Uint16Array {
		return new Uint16Array(this.elements);
	}

	triangle(): CustomVertexDrawable {//=3 steps

		//counter clockwise vertices
		this.vertices = [
			0, 0, -1, 0, 0, 1, 0, 0,
			20, 0, -1, 0, 0, 1, 1, 0,
			0, 20, -1, 0, 0, 1, 0, 1
		];

		this.elements = [
			0, 1, 2
		];

		return this;
	}

	cube(side = 2): CustomVertexDrawable {//=3 steps

		//half side
		let h = side / 2;

		//vertex : position(3) + normal(3) + tex coords(2)
		//TODO tex coords are currently dummy
		this.vertices = [
			// Front face
			-h, -h, h, 0, 0, 1, 0, 0,
			h, -h, h, 0, 0, 1, 0, 0,
			h, h, h, 0, 0, 1, 0, 0,
			-h, h, h, 0, 0, 1, 0, 0,

			// Back face
			-h, -h, -h, 0, 0, -1, 0, 0,
			-h, h, -h, 0, 0, -1, 0, 0,
			h, h, -h, 0, 0, -1, 0, 0,
			h, -h, -h, 0, 0, -1, 0, 0,

			// Top face
			-h, h, -h, 0, 1, 0, 0, 0,
			-h, h, h, 0, 1, 0, 0, 0,
			h, h, h, 0, 1, 0, 0, 0,
			h, h, -h, 0, 1, 0, 0, 0,

			// Bottom face
			-h, -h, -h, 0, -1, 0, 0, 0,
			h, -h, -h, 0, -1, 0, 0, 0,
			h, -h, h, 0, -1, 0, 0, 0,
			-h, -h, h, 0, -1, 0, 0, 0,

			// Right face
			h, -h, -h, 1, 0, 0, 0, 0,
			h, h, -h, 1, 0, 0, 0, 0,
			h, h, h, 1, 0, 0, 0, 0,
			h, -h, h, 1, 0, 0, 0, 0,

			// Left face
			-h, -h, -h, -1, 0, 0, 0, 0,
			-h, -h, h, -1, 0, 0, 0, 0,
			-h, h, h, -1, 0, 0, 0, 0,
			-h, h, -h, -1, 0, 0, 0, 0
		];

		this.elements = [
			0, 1, 2, 0, 2, 3,    // front
			4, 5, 6, 4, 6, 7,    // back
			8, 9, 10, 8, 10, 11,   // top
			12, 13, 14, 12, 14, 15,   // bottom
			16, 17, 18, 16, 18, 19,   // right
			20, 21, 22, 20, 22, 23    // left
		];

		return this;
	}


	sphere(diameter: number = 2): CustomVertexDrawable {
		let radius = diameter / 2;
		let center = new Point(0, 0, 0);

		// IMP: these steps must divide 180 evenly
		let vStep = 5;
		let hStep = 5;

		const verticesInACircle = 360 / hStep;
		const verticesInSphere = 1 + (180 / vStep - 2 + 1) * verticesInACircle + 1;

		let verticesSoFar = 0;
		this.vertices = [];
		this.elements = [];

		//vertical down (top to bottom in y)
		for (let i = 0; i <= 180; i += vStep) {

			let y = radius * Math.sin(toRadians(90 - i));
			if (i == 0) {

				let pointOnSphere = new Point(0, y, 0);
				let normalOnPoint = Vector.between(center, pointOnSphere);
				this.addVertex(pointOnSphere, normalOnPoint);
				verticesSoFar++;

			} else if (i == 180) {


				let pointOnSphere = new Point(0, y, 0);
				let normalOnPoint = Vector.between(center, pointOnSphere);
				this.addVertex(pointOnSphere, normalOnPoint);
				verticesSoFar++;

			} else {

				//disk (circle in the xz plane)
				let armAngle = (90 - Math.abs(90 - i))
				let diskRadius = Math.sin(toRadians(armAngle)) * radius;//the more you move away from center, the smaller the disk radius
				const startingCircleElement = verticesSoFar;
				for (let j = 0; j < 360; j += hStep) {

					let x = diskRadius * Math.cos(toRadians(j));
					let z = diskRadius * Math.sin(toRadians(j));

					let pointOnSphere = new Point(x, y, z);
					let normalOnPoint = Vector.between(center, pointOnSphere);
					this.addVertex(pointOnSphere, normalOnPoint);
					verticesSoFar++;

					//element index for this vertex and the next(in possible future)
					const thisElement = verticesSoFar - 1;
					const nextElement = j == 360 - hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

					if (i - vStep == 0) {// previous height was the top polar point

						//top polar point
						const polarPointElement = 0;

						//make a triangle using these 3 vertices (counter clockwise)
						this.elements.push(thisElement);
						this.elements.push(nextElement);
						this.elements.push(polarPointElement);

					} else if (i + vStep == 180) {// next height is the bottom polar point(last vertex)

						//top polar point (will always be last)
						const polarPointElement = verticesInSphere - 1;

						//make a triangle using these 3 vertices (counter clockwise)
						this.elements.push(polarPointElement);
						this.elements.push(nextElement);
						this.elements.push(thisElement);
					}
					else {// previous height was a circle, connect to vertices of the circle of previous height

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
	protected addVertex(position: Point, normal: Vector, texCoords = new Point(0, 0)): number {

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

	cylinder(diameter: number = 2, height: number = 3): CustomVertexDrawable {
		let radius = diameter / 2;
		// IMP: these steps must divide 180 evenly
		let vStep = height / 20;
		let hStep = 5;
		const verticesInACircle = 360 / hStep;

		let verticesSoFar = 0;
		this.vertices = [];
		this.elements = [];

		//center of top circle
		let y = height / 2;
		let goingUp = new Vector(0, 1, 0);
		this.addVertex(new Point(0, y, 0), goingUp.clone());
		verticesSoFar++;
		const topCircleCenterElement = 0;

		//top circle (boundary points)
		let startingCircleElement = verticesSoFar;
		for (let j = 0; j < 360; j += hStep) {

			let x = radius * Math.cos(toRadians(j));
			let z = radius * Math.sin(toRadians(j));

			this.addVertex(new Point(x, y, z), goingUp.clone());
			verticesSoFar++;

			//element index for this vertex and the next(in possible future)
			const thisElement = verticesSoFar - 1;
			const nextElement = j == 360 - hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

			this.elements.push(nextElement);
			this.elements.push(thisElement);
			this.elements.push(topCircleCenterElement);
		}

		//vertical down (top to bottom in y)
		for (y = height / 2; y >= -height / 2; y -= vStep) {

			//disk (circle in the xz plane)
			startingCircleElement = verticesSoFar;
			for (let j = 0; j < 360; j += hStep) {

				let x = radius * Math.cos(toRadians(j));
				let z = radius * Math.sin(toRadians(j));

				let pointOnCylinder = new Point(x, y, z);
				let normalOnPoint = Vector.between(new Point(0, y, 0), pointOnCylinder);
				this.addVertex(pointOnCylinder, normalOnPoint);
				verticesSoFar++;

				if (y != height / 2) { //not first or last iteration of the outer loop

					//element index for this vertex and the next(in possible future)
					const thisElement = verticesSoFar - 1;
					const nextElement = j == 360 - hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

					//corresponding vertex elements of previous height
					const thisElementPrevious = thisElement - verticesInACircle;
					const nextElementPrevious = nextElement - verticesInACircle;

					//make a quad using these 4 vertices (counter clockwise)
					this.elements.push(nextElement);
					this.elements.push(thisElement);
					this.elements.push(thisElementPrevious);

					this.elements.push(nextElementPrevious);
					this.elements.push(nextElement);
					this.elements.push(thisElementPrevious);
				}
			}
		}

		//bottom circle
		y = -height / 2;
		const goingDown = new Vector(0, -1, 0);
		this.addVertex(new Point(0, y, 0), goingDown.clone());
		const bottomCircleCenterElement = verticesSoFar;
		verticesSoFar++;
		startingCircleElement = verticesSoFar;

		//bottom circle (boundary points)
		for (let j = 0; j < 360; j += hStep) {

			let x = radius * Math.cos(toRadians(j));
			let z = radius * Math.sin(toRadians(j));
			this.addVertex(new Point(x, y, z), goingDown.clone());
			verticesSoFar++;

			//element index for this vertex and the next(in possible future)
			const thisElement = verticesSoFar - 1;
			const nextElement = j == 360 - hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

			this.elements.push(thisElement);
			this.elements.push(nextElement);
			this.elements.push(bottomCircleCenterElement);
		}

		return this;
	}

	cone(diameter: number = 2, height: number = 3): CustomVertexDrawable {
		const radius = diameter / 2;
		const slantAngleRad = Math.atan(height / radius);
		const normalExtrusionAngleRad = toRadians(90 - toDegrees(slantAngleRad));
		

		// IMP: these steps must divide 180 evenly
		let vStep = height / 20;
		let hStep = 5;
		const verticesInACircle = 360 / hStep;

		let verticesSoFar = 0;
		this.vertices = [];
		this.elements = [];

		//center of top circle
		const halfHeight = height / 2;
		let y = halfHeight;
		this.addVertex(new Point(0, y, 0), new Vector(0, 1, 0));
		verticesSoFar++;
		const topCircleCenterElement = 0;

		//vertical down (top to bottom in y)
		for (y = halfHeight; y >= -halfHeight; y -= vStep) {

			//disk (circle in the xz plane)
			const subConeHeight = halfHeight - y; 
			const diskRadius =  subConeHeight / Math.tan(slantAngleRad) ;

			//compute the origin point, that will get used later while calculating normal
			const alongAxis = Math.tan(normalExtrusionAngleRad) * diskRadius;
			const belowCurrentY=new Point(0,y-alongAxis,0);

			const startingCircleElement = verticesSoFar;
			for (let j = 0; j < 360; j += hStep) {

				let x = diskRadius * Math.cos(toRadians(j));
				let z = diskRadius * Math.sin(toRadians(j));

				let pointOnCone = new Point(x, y, z);
				let normalOnPoint = Vector.between(belowCurrentY, pointOnCone).normalize();
				this.addVertex(pointOnCone, normalOnPoint);
				verticesSoFar++;

				//element index for this vertex and the next(in possible future)
				const thisElement = verticesSoFar - 1;
				const nextElement = j == 360 - hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

				if (y == halfHeight) {// previous height was the top polar point

					//top polar point
					const polarPointElement = 0;

					//make a triangle using these 3 vertices (counter clockwise)
					this.elements.push(nextElement);
					this.elements.push(thisElement);
					this.elements.push(polarPointElement);

				} else {// previous height was a circle, connect to vertices of the circle of previous height

					//corresponding vertex elements of previous height
					const thisElementCorresponding = thisElement - verticesInACircle;
					const nextElementCorresponding = nextElement - verticesInACircle;

					//make a quad using these 4 vertices (counter clockwise)
					this.elements.push(nextElement);
					this.elements.push(thisElement);
					this.elements.push(thisElementCorresponding);

					this.elements.push(nextElementCorresponding);
					this.elements.push(nextElement);
					this.elements.push(thisElementCorresponding);
				}

			}
		}

		//bottom circle
		y = -halfHeight;
		const goingDown = new Vector(0, -1, 0);
		this.addVertex(new Point(0, y, 0), goingDown.clone());
		const bottomCircleCenterElement = verticesSoFar;
		verticesSoFar++;
		const startingCircleElement = verticesSoFar;

		//bottom circle (boundary points)
		for (let j = 0; j < 360; j += hStep) {

			let x = radius * Math.cos(toRadians(j));
			let z = radius * Math.sin(toRadians(j));
			this.addVertex(new Point(x, y, z), goingDown.clone());
			verticesSoFar++;

			//element index for this vertex and the next(in possible future)
			const thisElement = verticesSoFar - 1;
			const nextElement = j == 360 - hStep ? startingCircleElement : thisElement + 1;//wrap around for the last element

			this.elements.push(thisElement);
			this.elements.push(nextElement);
			this.elements.push(bottomCircleCenterElement);
		}
		return this;
	}

	plane(width = 2,length = 2): CustomVertexDrawable {

		//half side
		const hw = width / 2;
		const hl = length / 2;

		//vertex : position(3) + normal(3) + tex coords(2)
		//TODO tex coords are currently dummy
		this.vertices = [

			// along the xz plane
			-hw, 0, -hl, 0, 1, 0, 0, 0,
			hw, 0, -hl, 0, 1, 0, 0, 0,
			hw, 0, hl, 0, 1, 0, 0, 0,
			-hw, 0, hl, 0, 1, 0, 0, 0,

		];

		this.elements = [0, 2, 1, 0, 3, 2];
		// this.elements = [0, 1, 2, 0, 2, 3];

		return this;
	}

	circle(diameter:number=2) :CustomVertexDrawable{

		
		//multiple of 360
		const hStep = 5;
		const radius = diameter/2;
		const startingCircleElement = 0;
		const goingUp=new Vector(1,0,0);

		this.vertices = [];
		this.elements = [];

		this.addVertex(new Point(0, 0, 0), goingUp.clone());
		let verticesSoFar = 1;

		// circle in xz plane
		for (let j = 0; j <= 360; j += hStep) {

			let x = radius * Math.cos(toRadians(j));
			let z = radius * Math.sin(toRadians(j));
			this.addVertex(new Point(x, 0, z), goingUp.clone());
			verticesSoFar++;

			//element index for this vertex and the next(in possible future)
			const thisElement = verticesSoFar - 1;
			const nextElement = j == 360 ? startingCircleElement : thisElement + 1;//wrap around for the last element

			this.elements.push(nextElement);
			this.elements.push(thisElement);
			this.elements.push(0);//center point
		}
		return this;
	}
}