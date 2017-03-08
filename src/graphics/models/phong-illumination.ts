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

	constructor(ka:number=0.6,kd:number=0.3,ks:number=0.4,ke:number=1){
		this.ka=ka;
		this.kd=kd;
		this.ks=ks;
		this.ke=ke;
	}

	illuminate(point: Point, geometry: Geometry, world: World): Color {
		//object color
		let co=geometry.color.toFractionalValues();

		let ambientComponent = world.ambientLight.toFractionalValues().multiply(co).scalerProduct(this.ka);
		let diffuseComponent: Color;
		let specularComponent: Color;

		for (let i = 0; i < world.lightList.length; i++) {

			let light = world.lightList[i];

			//illuminated light color
			let li=light.color.toFractionalValues();

			let intersectionData = new IntersectionData(geometry, point, light, world.camera);
			let towardsLight = new Ray(point, Vector.between(point, light.position));

			//compute the intersections with the geometries and store the best intersection 
			let best: BestIntersection = new BestIntersection(point);
			for (let geometry of world.geometryList) {

				//find intersections with ray
				let intersection = geometry.intersection(towardsLight);
				if (intersection != null) {
					//compare against best intersection and update if closes to camera
					best.updateIfNeeded(geometry, intersection)
				}
			}

			//add the diffuse and specular component
			if (!best.isEmpty) {
				let n=intersectionData.normal;
				let si=intersectionData.incoming;
				let ri=intersectionData.reflective;
				
				let diffuseColor=li.multiply(co).scalerProduct(si.dot(n));
				diffuseComponent.add(diffuseColor);

				let cs=light.color;
				let specularColor=li.multiply(cs).scalerProduct(Math.pow(ri.dot(n),this.ke));
				specularComponent.add(specularColor);
			}
		}


		// return intersectionData.geometry.color;
		return ambientComponent.add(diffuseComponent.scalerProduct(this.kd)).add(specularComponent.scalerProduct(this.ks));
	}
}