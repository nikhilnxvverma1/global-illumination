import { Color } from './color';

export class PixelGrid{
	grid:Color[][];

	constructor(width:number,height:number){
		this.initGrid(width,height);
	}

	private initGrid(width:number,height:number){
		for(let i=0;i<width;i++){
			this.grid[i]=[];
			for(let j=0;j<height;j++){
				this.grid[i][j]=new Color();
			}
		}
	}
}