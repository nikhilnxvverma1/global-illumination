import { Point } from './point';
import { Ray } from './ray';

export class Vector{
	x:number;
	y:number;
	z:number;
	
	constructor(x=0,y=0,z=0){
		this.x=x;
		this.y=y;
		this.z=z;
	}

	pointAt(distance:number,from:Point):Point{
		let unitVector = this.unitVector();
		let distantPoint = from.clone();
		distantPoint.x += unitVector.x * distance;
		distantPoint.y += unitVector.y * distance;
		distantPoint.z += unitVector.z * distance;
		return distantPoint;
	}

	unitVector():Vector{
		let unitVector=new Vector();
		let magnitude=this.magnitude();
		unitVector.x=this.x/magnitude;
		unitVector.y=this.y/magnitude;
		unitVector.z=this.z/magnitude;
		return unitVector;
	}

	normalize():Vector{
		let magnitude=this.magnitude();
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
		this.z=this.z/magnitude;
		return this;
	}

	magnitude():number{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	clone():Vector{
		return new Vector(this.x,this.y,this.z);
	}

	opposite():Vector{
		return new Vector(-this.x,-this.y,-this.z);
	}

	dot(that:Vector):number{
		return this.x * that.x + this.y * that.y + this.z * that.z;
	}

	static between(from:Point,to:Point):Vector{
		return new Vector(to.x-from.x,to.y-from.y,to.z-from.z);
	}

	static reflect(ray:Ray,normal:Vector):Vector{
		return null;//TODO
	}
}