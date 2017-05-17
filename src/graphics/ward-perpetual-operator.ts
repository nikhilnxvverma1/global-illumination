import { PixelGrid } from './models/pixel-grid';
import { Color } from './models/color';
import { ToneReproductionOperator } from './tone-reproduction-operator';

export class WardPerpetualOperator extends ToneReproductionOperator{
	
	ldMax:number;

	apply(pixelGrid:PixelGrid,luminanceOnly:PixelGrid):PixelGrid{

		let lWa=this.logAverageLuminance(luminanceOnly);
		let sf=this.scaleFactor(this.ldMax,lWa);
		return this.scaleEachElement(pixelGrid,sf);
	}

	private scaleEachElement(pixelGrid:PixelGrid,sf:number):PixelGrid{
		let scaledGrid=new PixelGrid(pixelGrid.columns,pixelGrid.rows,new Color(0,0,0,255));
		
		for (let i = 0; i < pixelGrid.rows; i++) {
			for (let j = 0; j < pixelGrid.columns; j++) {

				//get RGB values at this pixel
				let r = pixelGrid.grid[i][j].r;
				let g = pixelGrid.grid[i][j].g;
				let b = pixelGrid.grid[i][j].b;


				//scale each element by a value
				scaledGrid.grid[i][j].r = r *sf;
				scaledGrid.grid[i][j].g = g *sf;
				scaledGrid.grid[i][j].b = b *sf;;

			}
		}
		return scaledGrid;
	}

	private scaleFactor(ldMax: number, lWa: number): number {
		let numerator = 1.219 + Math.pow((ldMax / 2), 0.4);
		let denominator = 1.219 + Math.pow(lWa, 0.4);
		let fraction = numerator / denominator;
		return Math.pow(fraction, 2.5);
	}
}