import { Camera } from '../../graphics/models/camera';
import { Color } from '../../graphics/models/color';
import { Geometry } from '../../graphics/models/geometry';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { RectQuad } from '../../graphics/models/rect-quad';
import { Point } from '../../graphics/models/point';
import { Vector } from '../../graphics/models/vector';
import { Ray } from '../../graphics/models/ray';
import { World } from '../../graphics/models/world';
import { IlluminationModel } from '../../graphics/models/illumination-model';
import { PhongIlluminationModel } from '../../graphics/models/phong-illumination';
import { Light } from '../../graphics/models/light';
import { IntersectionData } from '../../graphics/models/intersection-data';

export class BasicShadingDriver {

	constructor(
		private width: number,
		private height: number
	) { }

	computePixelGrid(world:World): PixelGrid {	//6 units

		let geometryList=world.geometryList;
		let camera=world.camera;

		let pixelGrid = new PixelGrid(this.width, this.height, new Color().set("#5898f8"));
		let imagePlane = camera.getNearPlane();

		//FOR EACH pixel of image grid,
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {

				//MAKE the ray from camera to pixel
				let pixel = imagePlane.pointInGrid(i, j, this.width, this.height);
				// console.log("i="+i+"j="+j+": "+pixel.toString());
				let ray = new Ray(camera.origin, Vector.between(camera.origin,pixel));

				//FIND the best intersection:
				let best: IntersectionResult = null;
				for (let geometry of geometryList) {

					//COMPUTE intersections with ray
					let intersection = geometry.intersection(ray);
					if (intersection != null) {
						
						if(best!=null){
							//UPDATE if closest to camera
							best.updateIfNeeded(geometry,intersection)
						}else{
							best=new IntersectionResult(geometry,intersection,camera);
						}
					}
				}

				//UPDATE color of the pixel grid at this pixel
				if (best != null) {
					let illuminatedColor= best.geometry.illuminationModel.illuminate(best.primary,best.geometry,world);

					pixelGrid.grid[j][i] =illuminatedColor;
					// if(i>233){
					// 	pixelGrid.grid[j][i]=new Color(33,123,184,123);
					// }
				}
			}
		}
		return pixelGrid;
	}
}

class IntersectionResult {
	geometry: Geometry;
	primary: Point;
	camera:Camera;

	constructor(geometry:Geometry,intersection:Point,camera:Camera){
		this.geometry=geometry;
		this.primary=intersection;
		this.camera=camera;
		// console.log("Intersected");
	}

	updateIfNeeded(geometry:Geometry,intersection:Point):boolean{
		let distanceFromCamera=this.camera.origin.distance(intersection);
		if(distanceFromCamera<this.camera.origin.distance(this.primary)){
			this.geometry=geometry;
			this.primary=intersection;
			return true;
		}
		return false;
	}
}