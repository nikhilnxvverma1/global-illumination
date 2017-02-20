
/**
 * Color in RGBA format with ranges between 0-255
 */
export class Color{
	r:number;
	g:number;
	b:number;
	a:number;

	constructor(r=0,g=0,b=0,a=255){
		this.r=r;
		this.g=g;
		this.b=b;
		this.a=a;
	}

	clone():Color{
		return new Color(this.r,this.g,this.b,this.a);
	}

	/**
	 * Sets the color to the specified color hashcode.
	 * A valid hashcode must begin with '#' followed by 6 hexadecimal numbers
	 * Returns the same instance for chaining
	 */
	set(hashcode:string):Color{
		let hexString : string = hashcode.substr(1).toString();
		this.r=parseInt(hexString.substr(0,2),16);
		this.g=parseInt(hexString.substr(2,2),16);
		this.b=parseInt(hexString.substr(4,2),16);
		return this;
	}
}