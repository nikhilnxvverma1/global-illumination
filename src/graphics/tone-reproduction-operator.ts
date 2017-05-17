import { PixelGrid } from './models/pixel-grid';
import { Color } from './models/color';

export interface ToneReproductionOperator{
	apply(pixelGrid:PixelGrid,luminanceOnly:PixelGrid):PixelGrid;
}

export class WardPerpetualOperator implements ToneReproductionOperator{
	
	ldMax:number;

	apply(pixelGrid:PixelGrid,luminanceOnly:PixelGrid):PixelGrid{
		let scaledGrid=new PixelGrid(pixelGrid.columns,pixelGrid.rows,new Color(0,0,0,0));

		return scaledGrid;
	}

	logAverageLuminance(pixelGrid:PixelGrid):number{
		let lBar=0;

		return 0;//TODO
	}
}