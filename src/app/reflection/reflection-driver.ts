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
				pixelGrid.grid[j][i] = this.illuminate(ray,world,0).ensureBounds();
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
					//update if closest to point to be closed to
					best.updateIfNeeded(geometry,intersection)
				}else{
					best=new IntersectionResult(geometry,intersection,ray.origin);
				}
			}
		}

		//update color of the pixel grid at this pixel
		let pixelColor=new Color(0,0,0,0);
		if (best != null) {

			let intersectionPoint=best.primary;
			let normal= best.geometry.normalExtrudingTo(best.primary).normalize();
			let reflectedVector=intersectionPoint.reflect(ray.direction.opposite(),normal).normalize();//we inverte it again to get the right direction

			let reflectedRay=new Ray(best.primary,reflectedVector);
			
			pixelColor=best.geometry.illuminationModel.illuminate(best.primary,best.geometry,world);
			if(depth<ReflectionDriver.MAX_DEPTH){

				let reflectionCoefficient=(best.geometry.illuminationModel as PhongIlluminationModel).kr;
				if(reflectionCoefficient>0){

					let detailedPixel=this.illuminate(reflectedRay,world,depth+1);
					pixelColor.addToSelf(detailedPixel.scalerProduct(reflectionCoefficient));
				}
			}
		}else{
			pixelColor=new Color(0,0,255,255);
		}
		return pixelColor;
	}
}



class IntersectionResult {
	geometry: Geometry;
	primary: Point;
	pointToBeCloseTo:Point;

	constructor(geometry:Geometry,intersection:Point,pointToBeClosedTo:Point){
		this.geometry=geometry;
		this.primary=intersection;
		this.pointToBeCloseTo=pointToBeClosedTo;
		// console.log("Intersected");
	}

	updateIfNeeded(geometry:Geometry,intersection:Point):boolean{
		let distanceFromOrigin=this.pointToBeCloseTo.distance(intersection);
		if(distanceFromOrigin<this.pointToBeCloseTo.distance(this.primary)){
			this.geometry=geometry;
			this.primary=intersection;
			return true;
		}
		return false;
	}
}