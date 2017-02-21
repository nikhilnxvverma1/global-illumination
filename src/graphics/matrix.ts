
export class Matrix {
	private grid: number[][];
	private rows: number;
	private cols: number;

	constructor(rows: number, cols: number) {
		this.rows = rows;
		this.cols = cols;
		this.initGrid();
	}

	private initGrid() {
		this.grid = [];
		for (let i = 0; i < this.rows; i++) {
			this.grid[i] = [];
			for (let j = 0; j < this.cols; j++) {
				this.grid[i][j] = 0;
			}
		}
	}

	/**
	 * Sets the value at the specified position. 
	 * Returns the same object to allow chaining
	 */
	set(row: number, col: number, value: number): Matrix {
		this.grid[row][col] = value;
		return this;
	}

	/** Returns the element in the matrix for the given indices */
	get(row: number, col: number): number {
		return this.grid[row][col];
	}

	/**
	 * Multiplies with another matrix commutatively. If the dimensions are not compatible for multiplication,
	 * null is returned otherwise, result matrix is returned
	 */
	multiply(that: Matrix): Matrix {
		if (this.cols != that.rows) {
			return null;
		}
		let result = new Matrix(this.rows, that.cols);

		for (let i = 0; i < this.rows; i++) {
			let sum = 0;
			for (let j = 0; j < that.cols; j++) {
				for (let k = 0; k < that.rows; k++) {
					sum += this.get(i, j) * that.get(j, k);
				}
				result.set(i,j,sum);
			}
		}
		return result;
	}

	/** Builds a rotation matrix which results from the rotation matrices of rotationX X rotationY X rotationZ */
	static rotationXYZMatrix(x:number,y:number,z:number):Matrix{
		
		//reference :
		//http://inside.mines.edu/fs_home/gmurray/ArbitraryAxisRotation/
		
		let m=new Matrix(4,3);

		m.set(0,0,cos(y)*cos(z));
		m.set(0,1,-cos(y)*sin(z));
		m.set(0,2,sin(y));
		m.set(0,3,0);

		m.set(1,0,cos(x)*sin(z)+sin(x)*sin(y)*cos(z));
		m.set(1,1,cos(x)*cos(z)-sin(x)*sin(y)*sin(z));
		m.set(1,2,-sin(x)*cos(y));
		m.set(1,3,0);

		m.set(2,0,sin(x)*sin(z)-cos(x)*sin(y)*cos(z));
		m.set(2,1,sin(x)*cos(z)+cos(x)*sin(y)*sin(z));
		m.set(2,2,cos(x)*cos(y));
		m.set(2,3,0);

		m.set(3,0,0);
		m.set(3,1,0);
		m.set(3,2,0);
		m.set(3,3,1);

		return m;
	}

	/** Builds a rotation matrix which results from the rotation matrices of rotationZ X rotationY X rotationX */
	static rotationZYXMatrix(x:number,y:number,z:number):Matrix{
		
		//reference :
		//http://inside.mines.edu/fs_home/gmurray/ArbitraryAxisRotation/
		
		let m=new Matrix(4,3);

		m.set(0,0,cos(y)*cos(z));
		m.set(0,1,cos(z)*sin(x)*sin(y)-cos(x)*sin(z));
		m.set(0,2,cos(x)*cos(z)*sin(y)+sin(x)*sin(z));
		m.set(0,3,0);

		m.set(1,0,cos(y)*sin(z));
		m.set(1,1,cos(x)*cos(z)+sin(x)*sin(y)*sin(z));
		m.set(1,2,-cos(z)*sin(x)+cos(x)*sin(y)*sin(z));
		m.set(1,3,0);

		m.set(2,0,-sin(y));
		m.set(2,1,cos(y)*sin(x));
		m.set(2,2,cos(x)*cos(y));
		m.set(2,3,0);

		m.set(3,0,0);
		m.set(3,1,0);
		m.set(3,2,0);
		m.set(3,3,1);

		return m;
	}
}

/** Math.cos(theta) shorthand */
function cos(theta:number):number{
	return Math.cos(theta);
}

/** Math.sin(theta) shorthand */
function sin(theta:number):number{
	return Math.sin(theta);
}