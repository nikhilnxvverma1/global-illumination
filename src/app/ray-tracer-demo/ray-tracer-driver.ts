import { Camera } from '../../graphics/models/camera';
import { Color } from '../../graphics/models/color';
import { Geometry } from '../../graphics/models/geometry';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { RectQuad } from '../../graphics/models/rect-quad';

export class RayTracerDriver{

	constructor(
		private width:number,
		private height:number
	){}

	computePixelGrid(geometryList:Geometry[],camera:Camera):PixelGrid{
		let pixelGrid=new PixelGrid(this.width,this.height,new Color().set("#5898f8"));
		let imagePlane=camera.getNearPlane();
		return pixelGrid;
	}
}