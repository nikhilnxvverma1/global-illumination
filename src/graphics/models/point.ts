import { Ray } from './ray';
import { Vector } from './vector';
import { mat4,vec3 } from 'gl-matrix';

export class Point{
	x:number;
	y:number;
	z:number;

	constructor(x=0,y=0,z=0){
		this.x=x;
		this.y=y;
		this.z=z;
	}

	clone():Point{
		return new Point(this.x,this.y,this.z);
	}

	onLeft(d:number):Point{
		return new Point(this.x-d,this.y,this.z);
	}

	onRight(d:number):Point{
		return new Point(this.x+d,this.y,this.z);
	}

	onTop(d:number):Point{
		return new Point(this.x,this.y-d,this.z);
	}

	onBottom(d:number):Point{
		return new Point(this.x,this.y+d,this.z);
	}

	onDeep(d:number):Point{
		return new Point(this.x,this.y,this.z+d);
	}

	onShallow(d:number):Point{
		return new Point(this.x,this.y,this.z-d);
	}

	add(dPoint: Point): Point {
		return new Point(this.x + dPoint.x, this.y + dPoint.y, this.z + dPoint.z);
	}

	toString():string{
		return "("+this.x+","+this.y+","+this.z+")";
	}

	distance(from:Point):number{
		return Math.sqrt(
			(this.x-from.x)*(this.x-from.x) +
			(this.y-from.y)*(this.y-from.y) +
			(this.z-from.z)*(this.z-from.z));
	}

	reflect(vector:Vector,normal:Vector):Vector{
		let numerator = vector.dot(normal);
		let denominator = Math.pow(normal.magnitude(), 2);
		let fraction = 2 * (numerator / denominator);

		return vector.subtract(normal.scalerProduct(fraction));
	}

	/**Returns a homogenous array equivalent */
	asArray():number[]{
		return [this.x,this.y,this.z,1];
	}

	/** Returns gl-Matrix's vec3 representation */
	asVec3():vec3{
		return vec3.fromValues(this.x,this.y,this.z);
	}

	/**Returns the difference in a new point */
	subtract(that:Point):Point{
		return new Point(this.x-that.x,this.y-that.y,this.z-that.z);
	}
}