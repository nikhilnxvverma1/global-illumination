import { Geometry } from './models/geometry';
import { Point } from './models/point';
import { Color } from './models/color';
import { RectQuad } from './models/rect-quad';
import { mat4,vec4 } from 'gl-matrix';

/** Strategy for picking color at a given point. This could be used if the model has a texture. */
export interface ColorPickingStrategy{
	colorAt(point:Point):Color;
}

/** Returns the same color as the geometry */
export class SimpleColorStrategy implements ColorPickingStrategy{

	constructor(private geometry:Geometry){}

	colorAt(point:Point):Color{
		return this.geometry.color;
	}

}


/** Color in the Checker box pattern. Applicable only for rect quad */
export class CheckerBoxStrategy implements ColorPickingStrategy{

	private color1:Color=new Color(255,0,0);
	private color2:Color=new Color(255,255,0);
	
	constructor(private rectQuad:RectQuad){}

	colorAt(point:Point):Color{

		//TODO create matrix that transforms from world space to object space
		// let objectSpace=mat4.create();
		// mat4.translate(objectSpace,mat4.create(),this.rectQuad.position.asArray());
		// mat4.invert(objectSpace,objectSpace);

		// let positionInObjectSpace=multiplyMat4WithVec4(objectSpace,vec4FromPoint(point));

		//translate back to the origin(naive approach)
		let local=this.rectQuad.position.subtract(point);

		//center point is the center of the rect quad
		let totalCells=10;
		let cellWidth=this.rectQuad.width/totalCells;
		let cellHeight=this.rectQuad.height/totalCells;
		// console.log("x,z "+local.x+" , "+local.z);

		//compute row and column numbers
		let column=Math.floor(5+(local.x/cellWidth));
		let row=Math.floor(5+(local.z/cellWidth));

		if(row%2==0 && column%2==0){//both even
			return this.color1;
		}else if(row%2==0 && column%2!=0){//even odd
			return this.color2;
		}else if(row%2!=0 && column%2==0){//odd even
			return this.color2;
		}else{//both odd
			return this.color1;
		}

	}
}

function multiplyMat4WithVec4(a:mat4,b:vec4):vec4{
	let product=vec4.create();
	for(let i=0;i<4;i++){
		for(let j=0;j<4;j++){
			//TODO
		}
	}
	return product;
}

function vec4FromPoint(point:Point):vec4{
	let filledVec4=vec4.create();
	filledVec4.set(0,point.x);
	filledVec4.set(1,point.y);
	filledVec4.set(2,point.z);
	filledVec4.set(3,1);
	return filledVec4;
}