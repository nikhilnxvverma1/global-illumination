import { ToneReproductionOperator } from '../../graphics/tone-reproduction-operator';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { Color } from '../../graphics/models/color';
export class ToneReproductionDriver{
	operator:ToneReproductionOperator;
	lMax:number;

	constructor(operator:ToneReproductionOperator, lMax:number){
		this.operator=operator;
		this.lMax=lMax;
	}

	applyToneReproduction(pixelGrid:PixelGrid):PixelGrid{

		//luminance values at each pixel
		let luminanceOnly = this.overallLuminance(pixelGrid);

		//operator on pixel grid
		let afterOperator=this.operator.apply(pixelGrid,luminanceOnly);

		// apply device model
		let deviceSuitable = this.deviceModel(afterOperator, this.lMax);
		return deviceSuitable;
	}

	private overallLuminance(pixelGrid: PixelGrid): PixelGrid {

		//luminance grid (stored as a single channel in R)
		let luminanceOnly = new PixelGrid(pixelGrid.columns, pixelGrid.rows, new Color(0, 0, 0, 0));
		for (let i = 0; i < pixelGrid.rows; i++) {
			for (let j = 0; j < pixelGrid.columns; j++) {

				//get RGB values at this pixel
				let r = pixelGrid.grid[i][j].r;
				let g = pixelGrid.grid[i][j].g;
				let b = pixelGrid.grid[i][j].b;

				//compute the luminance
				let l = 0.27 * r + 0.67 * g + 0.06 * b;

				//use Red channel to store luminance
				luminanceOnly.grid[i][j].r = l;

			}
		}

		return luminanceOnly;
	}

	private deviceModel(pixelGrid:PixelGrid,ldMax:number):PixelGrid{
		//luminance grid (stored as a single channel in R)
		let finalColorGrid = new PixelGrid(pixelGrid.columns, pixelGrid.rows, new Color(0, 0, 0, 255));

		for (let i = 0; i < pixelGrid.rows; i++) {
			for (let j = 0; j < pixelGrid.columns; j++) {

				//get RGB values at this pixel
				let r = pixelGrid.grid[i][j].r;
				let g = pixelGrid.grid[i][j].g;
				let b = pixelGrid.grid[i][j].b;

				//convert from target color to final color using ldMax
				finalColorGrid.grid[i][j].r = r/ldMax;
				finalColorGrid.grid[i][j].g = g/ldMax;
				finalColorGrid.grid[i][j].b = b/ldMax;

				finalColorGrid.grid[i][j] = finalColorGrid.grid[i][j].toWholeValues().truncateFractionalPart();
				
			}
		}

		return finalColorGrid;
	}
}