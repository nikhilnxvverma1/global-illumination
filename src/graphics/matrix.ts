
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
}