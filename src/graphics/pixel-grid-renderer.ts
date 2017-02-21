import { PixelGrid } from './models/pixel-grid';
import { Renderer } from './renderer';

export class PixelGridRenderer implements Renderer{
	pixelGrid:PixelGrid;
	constructor(
		private ctx:CanvasRenderingContext2D
	){}

	draw(){
		for(let i=0;i<this.pixelGrid.rows;i++){
			for(let j=0;j<this.pixelGrid.columns;j++){
				this.ctx.fillStyle=this.pixelGrid.grid[i][j].hashcode();
				this.ctx.fillRect(i,j,1,1);
			}
		}
	}
}