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

export class TransmissionDriver {

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
				pixelGrid.grid[j][i] = this.illuminate(ray,null,world,0);
			}
		}
		return pixelGrid;
	}

	illuminate(ray:Ray,originatingObject:Geometry,world:World,depth:number){

		let geometryList=world.geometryList;
		let camera = world.camera;

		//find the best intersection:
		let best: IntersectionResult = null;
		for (let geometry of geometryList) {

			//skip over the originating object
			//avoid ray intersecting with the originating object due to floating point error resulting from intersection at the origin of ray itself
			if(geometry==originatingObject){
				continue;
			}
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
		let pixelColor=new Color(0,0,255,255);
		
		if (best != null) {

			//find the reflected ray by computing the reflected vector at intersection point
			let intersectionPoint=best.intersectionPoint;
			let normal= best.geometry.normalExtrudingTo(best.intersectionPoint).normalize();
			
			//for this pass, find the pixel color by calling the attached illumination model
			pixelColor=best.geometry.illuminationModel.illuminate(best.intersectionPoint,best.geometry,world);

			//for subsequent rays, fire off another ray in the reflected direction(called reflectd ray)
			if(depth<TransmissionDriver.MAX_DEPTH){

				//find the refracted ray here, there is a chance it might get used in the transmitted condition too(coz of Total internal reflection)
				let reflectedVector=intersectionPoint.reflect(ray.direction,normal).normalize();//we inverte it again to get the right direction
				let reflectedRay=new Ray(best.intersectionPoint,reflectedVector);

				//get the pixel color from the reflection and apply that proportional to reflection coefficient,
				let reflectionCoefficient=(best.geometry.illuminationModel as PhongIlluminationModel).kr;
				if(reflectionCoefficient>0){

					let detailedPixel=this.illuminate(reflectedRay,best.geometry,world,depth+1);
					pixelColor.addToSelf(detailedPixel.scalerProduct(reflectionCoefficient));
				}

				//get the pixel color from refraction and apply that proportional to refraction coefficient,
				let transmissionCoefficient=(best.geometry.illuminationModel as PhongIlluminationModel).kt;
				if(transmissionCoefficient>0){

					//find the refracted ray using Snells law
					let refraction=best.geometry.refract(best.intersectionPoint,ray,normal);
					let detailedPixel;
					if(refraction.totalInternalReflection){
						detailedPixel=this.illuminate(reflectedRay,best.geometry,world,depth+1);
					}else{
						detailedPixel=this.illuminate(refraction.refracted,best.geometry,world,depth+1);
					}
					pixelColor.addToSelf(detailedPixel.scalerProduct(transmissionCoefficient));
				}


			}
		}
		return pixelColor;
	}
}



class IntersectionResult {
	geometry: Geometry;
	intersectionPoint: Point;
	pointToBeCloseTo:Point;

	constructor(geometry:Geometry,intersection:Point,pointToBeClosedTo:Point){
		this.geometry=geometry;
		this.intersectionPoint=intersection;
		this.pointToBeCloseTo=pointToBeClosedTo;
		// console.log("Intersected");
	}

	updateIfNeeded(geometry:Geometry,intersection:Point):boolean{
		let distanceFromOrigin=this.pointToBeCloseTo.distance(intersection);
		if(distanceFromOrigin<this.pointToBeCloseTo.distance(this.intersectionPoint)){
			this.geometry=geometry;
			this.intersectionPoint=intersection;
			return true;
		}
		return false;
	}
}