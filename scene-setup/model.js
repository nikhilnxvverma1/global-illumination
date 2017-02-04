/** --------------Point-------------- */

function Point(x,y,z){
	this.x=x;
	this.y=y;
	this.z=z;
}

/** --------------Vector-------------- */

function Vector(start,end){
	this.start=start;
	this.end=end;
}

/** --------------Sphere-------------- */

function Sphere(center,radius){
	this.center=center;
	this.radius=radius;
}

/** --------------Quad-------------- */

function Quad(center,width,height,normal){
	this.center=center;
	this.width=width;
	this.height=height;
	this.normal=normal;
}

/** --------------Camera-------------- */

function Camera(){

}