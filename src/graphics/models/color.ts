
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

	multiply(that: Color): Color {
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

	add(that:Color):Color{
		return new Color(this.r+that.r,this.g+that.g,this.b+that.b,this.a+that.a);
	}

}