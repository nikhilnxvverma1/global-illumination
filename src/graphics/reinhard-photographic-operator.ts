import { PixelGrid } from './models/pixel-grid';
import { Color } from './models/color';
import { ToneReproductionOperator } from './tone-reproduction-operator';

export class ReinhardPhotographicOperator extends ToneReproductionOperator{
	ldMax:number;
	a=0.18;

	constructor(ldMax:number){
		super();
		this.ldMax=ldMax;
	}

	apply(pixelGrid:PixelGrid,luminanceOnly:PixelGrid):PixelGrid{

		let lBar = this.logAverageLuminance(luminanceOnly);
		let scaledLuminance = this.scaleLuminance(pixelGrid, this.a, lBar);
		let targetDisplayLuminance= this.targetDisplayLuminance(scaledLuminance,this.ldMax);
		return targetDisplayLuminance;
	}

	private scaleLuminance(pixelGrid: PixelGrid, a: number, lBar: number): PixelGrid {
		let scaledGrid = new PixelGrid(pixelGrid.columns, pixelGrid.rows, new Color(0, 0, 0, 255));

		for (let i = 0; i < pixelGrid.rows; i++) {
			for (let j = 0; j < pixelGrid.columns; j++) {

				//get RGB values at this pixel
				let r = pixelGrid.grid[i][j].r;
				let g = pixelGrid.grid[i][j].g;
				let b = pixelGrid.grid[i][j].b;


				//scale each element by a value
				scaledGrid.grid[i][j].r = (r * a) / lBar;
				scaledGrid.grid[i][j].g = (g * a) / lBar;
				scaledGrid.grid[i][j].b = (b * a) / lBar;

			}
		}
		return scaledGrid;
	}

	// private targetDisplayLuminance(scaledLuminance: PixelGrid, ldMax: number): PixelGrid {
	private targetDisplayLuminance(scaledLuminance: PixelGrid, ldMax: number): PixelGrid {
		let displayLuminance = new PixelGrid(scaledLuminance.columns, scaledLuminance.rows, new Color(0, 0, 0, 255));

		for (let i = 0; i < scaledLuminance.rows; i++) {
			for (let j = 0; j < scaledLuminance.columns; j++) {

				//get RGB values at this pixel
				let r = scaledLuminance.grid[i][j].r;
				let g = scaledLuminance.grid[i][j].g;
				let b = scaledLuminance.grid[i][j].b;


				//scale each element by a value
				displayLuminance.grid[i][j].r = (r / (1 + r)) * ldMax;
				displayLuminance.grid[i][j].g = (g / (1 + g)) * ldMax;
				displayLuminance.grid[i][j].b = (b / (1 + b)) * ldMax;

			}
		}
		return displayLuminance;

	}

}