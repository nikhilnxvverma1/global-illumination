import { vec3 } from 'gl-matrix';

/**
 * Color in RGBA format with ranges between 0-255
 */
export class Color {
	r: number;
	g: number;
	b: number;
	a: number;

	constructor(r = 0, g = 0, b = 0, a = 255) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	clone(): Color {
		return new Color(this.r, this.g, this.b, this.a);
	}

	/**
	 * Sets the color to the specified color hashcode.
	 * A valid hashcode must begin with '#' followed by 6 hexadecimal numbers
	 * Returns the same instance for chaining
	 */
	set(hashcode: string): Color {
		let hexString: string = hashcode.substr(1).toString();
		this.r = parseInt(hexString.substr(0, 2), 16);
		this.g = parseInt(hexString.substr(2, 2), 16);
		this.b = parseInt(hexString.substr(4, 2), 16);
		return this;
	}

	private getHexPart(v: number): string {
		let h: string = v.toString(16);
		return (h.length > 1) ? h : "0" + h;
	}

	hashcode(): string {
		return "#" + this.getHexPart(this.r) + this.getHexPart(this.g) + this.getHexPart(this.b);
	}

	toFractionalValues(): Color {
		let clone = new Color();
		clone.r = this.r / 255;
		clone.g = this.g / 255;
		clone.b = this.b / 255;
		clone.a = this.a / 255;
		return clone;
	}

	toWholeValues(): Color {
		let clone = new Color();
		clone.r = Math.min(255,Math.ceil(this.r * 255));
		clone.g = Math.min(255,Math.ceil(this.g * 255));
		clone.b = Math.min(255,Math.ceil(this.b * 255));
		clone.a = Math.min(255,Math.ceil(this.a * 255));
		return clone;
	}

	product(that: Color): Color {
		let product = new Color();
		product.r = this.r * that.r;
		product.g = this.g * that.g;
		product.b = this.b * that.b;
		product.a = this.a * that.a;
		return product;
	}


	scalerProduct(scaler: number): Color {
		let color = new Color();
		color.r = scaler * this.r;
		color.g = scaler * this.g;
		color.b = scaler * this.b;
		color.a = scaler * this.a;
		return color;
	}

	/**Returns the sum of this color with another color */
	sum(that:Color):Color{
		return new Color(this.r+that.r,this.g+that.g,this.b+that.b,this.a+that.a);
	}

	/**Adds element wise sum with another vector and MODIFIES original object */
	addToSelf(that:Color):Color{
		this.r = this.r + that.r > 255 ? 255 : this.r + that.r;
		this.g = this.g + that.g > 255 ? 255 : this.g + that.g;
		this.b = this.b + that.b > 255 ? 255 : this.b + that.b;
		this.a = this.a + that.a > 255 ? 255 : this.a + that.a;
		return this;
	}

	/**Changes itself and returns the same object*/
	makeNegativeValuesPositive(): Color {
		this.r = this.r < 0 ? -this.r : this.r;
		this.g = this.g < 0 ? -this.g : this.g;
		this.b = this.b < 0 ? -this.b : this.b;
		this.a = this.a < 0 ? -this.a : this.a;
		return this;
	}

	asArray():number[]{
		return [this.r,this.g,this.b,this.a];
	}

	asVec3():vec3{
		return vec3.fromValues(this.r,this.g,this.b);
	}

	ensureBounds():Color{
		
		this.r=this.r<0?0:this.r>255?255:this.r;
		this.g=this.g<0?0:this.g>255?255:this.g;
		this.b=this.b<0?0:this.b>255?255:this.b;
		this.a=this.a<0?0:this.a>255?255:this.a;
		return this;
	}

	isInvalid():boolean{
		return ((this.r > 255 || this.g > 255 || this.b > 255 || this.a > 255) ||
		 (this.r < 0 || this.g < 0 || this.b < 0 || this.a < 0)) ;
	}

	isZero():boolean{
		return (this.r ==0 && this.g ==0 && this.b ==0);
	}

}