import { Color } from './color';

export class PixelGrid{
	grid:Color[][];
	columns:number;
	rows:number;

	constructor(width:number,height:number,defaultColor:Color){
		this.rows=height;
		this.columns=width;
		this.initGrid(width,height,defaultColor);
	}

	private initGrid(width:number,height:number,defaultColor:Color){
		this.grid=[];
		for(let i=0;i<width;i++){
			this.grid[i]=[];
			for(let j=0;j<height;j++){
				this.grid[i][j]=defaultColor.clone();
			}
		}
	}
}