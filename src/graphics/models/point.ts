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
}