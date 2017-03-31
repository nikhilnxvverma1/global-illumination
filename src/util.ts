import { mat4 } from 'gl-matrix';

export function toRadians(degree:number):number{//=1 step
	return degree*(Math.PI/180);
}

export function printMat4(mat:mat4){//=1 step

	//print in column major format
	for(let i=0;i<4;i+=1){
		let row = mat[i] + " " + mat[i + 4] + " " + mat[i + 8] + " " + mat[i + 12];
		console.log(row);
	}
}

/** Removes an object from any generic list */
export function removeFromList(object,array:any[]):boolean{//=2 steps
	//find index
	let index=array.indexOf(object);

	//remove object at that index
	let removed=array.splice(index,1);
	return removed.length>=1;
}