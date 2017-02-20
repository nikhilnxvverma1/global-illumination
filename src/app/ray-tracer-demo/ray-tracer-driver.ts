import { Camera } from '../../graphics/models/camera';
import { Color } from '../../graphics/models/color';
import { Geometry } from '../../graphics/models/geometry';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { RectQuad } from '../../graphics/models/rect-quad';
import { Point } from '../../graphics/models/point';
import { Vector } from '../../graphics/models/vector';

export class RayTracerDriver{

	constructor(
		private width:number,
		private height:number
	){}

	computePixelGrid(geometryList:Geometry[],camera:Camera):PixelGrid{
		let pixelGrid=new PixelGrid(this.width,this.height,new Color().set("#5898f8"));
		let imagePlane=camera.getNearPlane();

		//iterate over the image plane grid to get the position of each pixel
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {

				let pixelCenter = imagePlane.pointInGrid(i,j,this.width,this.height);

			}
		}
		return pixelGrid;
	}
}