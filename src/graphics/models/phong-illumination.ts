import { IlluminationModel } from './illumination-model';
import { IntersectionData } from './intersection-data';
import { Color } from './color';
import { World } from './world';
import { Geometry } from './geometry';
import { Point } from './point';
import { Ray } from './ray';
import { Vector } from './vector';
import { BestIntersection } from './best-intersection';

export class PhongIlluminationModel implements IlluminationModel{
	/**Ambient coefficient */
	ka:number;
	/**Diffuse coefficient */
	kd:number;
	/**Specular coefficient */
	ks:number;
	/**Exponent controlling the size of specular highlight */
	ke:number;
	/** Reflectionm coefficient that determines color coming from other surfaces */
	kr:number;

	constructor(ka:number=0.9,kd:number=0.3,ks:number=0.6,ke:number=2){
		this.ka=ka;
		this.kd=kd;
		this.ks=ks;
		this.ke=ke;
		this.kr=0;
	}

	illuminate(point: Point, geometry: Geometry, world: World): Color {
		//object color
		let co=geometry.colorPickingStrategy.colorAt(point).toFractionalValues();
		// let co=geometry.color.toFractionalValues();

		let ambientComponent = world.ambientLight.toFractionalValues().product(co).scalerProduct(this.ka);
		let diffuseComponent: Color = new Color(0, 0, 0, 0);
		let specularComponent: Color = new Color(0, 0, 0, 0);

		for (let i = 0; i < world.lightList.length; i++) {

			let light = world.lightList[i];

			//illuminated light color
			let li=light.color.toFractionalValues();

			let intersectionData = new IntersectionData(geometry, point, light, world.camera);
			let towardsLight = new Ray(point, Vector.between(point, light.position));

			//compute the intersections with the geometries and store the best intersection 
			let best: BestIntersection = new BestIntersection(point);//TODO unneeded, just need to ensure there is no intersection
			for (let otherObjects of world.geometryList) {

				if(otherObjects==geometry){
					continue;
				}

				//find intersections with ray
				let intersection = otherObjects.intersection(towardsLight);
				if (intersection != null) {

					// console.debug("Intersection before light");
					//compare against best intersection and update if closes to camera
					best.updateIfNeeded(otherObjects, intersection)
				}
			}

			// if(best==undefined){
			// 	console.log("Best is undefiend");
			// }

			//add the diffuse and specular component only if there was no intersection
			if (best.isEmpty()) {
				let n=intersectionData.normal;
				let si=intersectionData.incoming;
				let ri=intersectionData.reflective;
				
				let diffuseColor=li.product(co).scalerProduct(Math.max(0,si.dot(n)));
				diffuseComponent.addToSelf(diffuseColor);

				let cs=light.color.toFractionalValues();
				let specularColor=li.product(cs).scalerProduct(Math.pow(Math.max(0,ri.dot(n)),this.ke));
				specularComponent.addToSelf(specularColor);
			}
		}


		// return intersectionData.geometry.color;
		let fractionalColor = ambientComponent.sum(diffuseComponent.scalerProduct(this.kd)).sum(specularComponent.scalerProduct(this.ks));
		let in256Range=fractionalColor.toWholeValues();
		return in256Range;
	}
}