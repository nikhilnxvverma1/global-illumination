import { Camera } from '../../graphics/models/camera';
import { Color } from '../../graphics/models/color';
import { Geometry } from '../../graphics/models/geometry';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { RectQuad } from '../../graphics/models/rect-quad';
import { Point } from '../../graphics/models/point';
import { Vector } from '../../graphics/models/vector';
import { Ray } from '../../graphics/models/ray';

export class RayTracerDriver {

	constructor(
		private width: number,
		private height: number
	) { }

	computePixelGrid(geometryList: Geometry[], camera: Camera): PixelGrid {
		let pixelGrid = new PixelGrid(this.width, this.height, new Color().set("#5898f8"));
		let imagePlane = camera.getNearPlane();

		//iterate over the image plane grid to get the position of each pixel
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {

				//make the ray from camera to pixel
				let pixel = imagePlane.pointInGrid(i, j, this.width, this.height);
				// console.log("i="+i+"j="+j+": "+pixel.toString());
				let ray = new Ray(camera.origin, Vector.between(camera.origin,pixel));

				//compute the intersections with the geometries and store the best intersection 
				let best: IntersectionResult = null;
				for (let geometry of geometryList) {

					//find intersections with ray
					let intersection = geometry.intersection(ray);
					if (intersection != null) {
					//compare against best intersection and update if closes to camera
						if(best!=null){
							best.updateIfNeeded(geometry,intersection)
						}else{
							best=new IntersectionResult(geometry,intersection,camera);
						}
					}
				}

				//update color of the pixel grid at this pixel
				if (best != null) {
					pixelGrid[i][j] = best.geometry.color;
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
		console.log("INtersected");
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