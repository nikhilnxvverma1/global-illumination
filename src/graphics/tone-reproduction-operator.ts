import { PixelGrid } from './models/pixel-grid';
import { Color } from './models/color';

export abstract class ToneReproductionOperator{
	abstract apply(pixelGrid:PixelGrid,luminanceOnly:PixelGrid):PixelGrid;

	logAverageLuminance(luminanceOnly: PixelGrid): number {
		let lBar = 0;
		let n = luminanceOnly.rows * luminanceOnly.columns;
		let sum = 0;
		let sigma = 0.0000001;//small value to prevent it from going to infinity 
		for (let i = 0; i < luminanceOnly.rows; i++) {
			for (let j = 0; j < luminanceOnly.columns; j++) {

				//get RGB values at this pixel
				let l = luminanceOnly.grid[i][j].r;

				let inner = (sigma + l);
				let element = Math.log2(inner);

				sum += element;
			}
		}
		return Math.exp(sum / n);
	}
}
