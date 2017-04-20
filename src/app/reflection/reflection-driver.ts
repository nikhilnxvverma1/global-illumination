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

export class ReflectionDriver {

	private static MAX_DEPTH=2;

	constructor(
		private width: number,
		private height: number
	) { }

	computePixelGrid(world:World): PixelGrid {

		let geometryList=world.geometryList;
		let camera=world.camera;

		let pixelGrid = new PixelGrid(this.width, this.height, new Color().set("#5898f8"));
		let imagePlane = camera.getNearPlane();

		//for each pixel of image grid,
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {

				//make the ray from camera to pixel
				let pixel = imagePlane.pointInGrid(i, j, this.width, this.height);
				let ray = new Ray(camera.origin, Vector.between(camera.origin,pixel));
				pixelGrid.grid[j][i] = this.illuminate(ray,world,0);
			}
		}
		return pixelGrid;
	}

	illuminate(ray:Ray,world:World,depth:number){

		let geometryList=world.geometryList;
		let camera = world.camera;

		//find the best intersection:
		let best: IntersectionResult = null;
		for (let geometry of geometryList) {

			//compute intersections with ray
			let intersection = geometry.intersection(ray);
			if (intersection != null) {
				
				if(best!=null){
					//update if closest to camera
					best.updateIfNeeded(geometry,intersection)
				}else{
					best=new IntersectionResult(geometry,intersection,camera);
				}
			}
		}

		let reflectedRay:Ray;

		//update color of the pixel grid at this pixel
		let pixelColor=new Color(0,0,0);
		if (best != null) {
			
			pixelColor=best.geometry.illuminationModel.illuminate(best.primary,best.geometry,world);
			if(depth<ReflectionDriver.MAX_DEPTH){

				let reflectionCoefficient=(best.geometry.illuminationModel as PhongIlluminationModel).kr;
				if(reflectionCoefficient>0){

					let detailedPixel=this.illuminate(reflectedRay,world,depth+1);
					pixelColor.addToSelf(detailedPixel.scalerProduct(reflectionCoefficient));
				}
			}
		}
		return pixelColor;
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