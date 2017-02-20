import { Color } from './color';

export class PixelGrid{
	grid:Color[][];

	constructor(width:number,height:number,defaultColor:Color){
		this.initGrid(width,height,defaultColor);
	}

	private initGrid(width:number,height:number,defaultColor:Color){
		for(let i=0;i<width;i++){
			this.grid[i]=[];
			for(let j=0;j<height;j++){
				this.grid[i][j]=defaultColor.clone();
			}
		}
	}
}