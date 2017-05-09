
/** Gives radians when multiplied by an angle in degrees */
export const DegreesToRadians=Math.PI/180;
/** Gives degrees when multiplied by an angle in radians */
export const RadiansToDegrees=180/Math.PI;

/** Represents direction in all 8 corners */
export enum Direction{//going clockwise
	Top=1,
	TopRight=2,
	Right=3,
	BottomRight=4,
	Bottom=5,
	BottomLeft=6,
	Left=7,
	TopLeft=8
}

/** Returns opposite direction as that of argument */
export function oppositeDirection(direction:Direction):Direction{
	switch(direction){
		case Direction.Top:return Direction.Bottom;
		case Direction.TopRight:return Direction.BottomLeft;
		case Direction.TopLeft:return Direction.BottomRight;
		case Direction.Right:return Direction.Left;
		case Direction.Left:return Direction.Right;
		case Direction.Bottom:return Direction.Top;
		case Direction.BottomRight:return Direction.TopLeft;
		case Direction.BottomLeft:return Direction.TopRight;
	}
}

/**
 *  Mouse interactions on views that involve dragging event implement this interface
 *  to receive callbacks from a parent component. This is done so as to overcome the
 *  problem when the mouse cursor goes out of the target view. Implementors need to
 *  handle the mouse press event and regiter themselves to the artboard.
 */
export interface PressDragReleaseProcessor{
	/** Will be fired on the subcomponent after the first time it has be registered on the artboard(for the initial press). */
	handleMousePress(event:MouseEvent):void;
	/** Fired whenever the mouse moves, on the target view or on the artboard untill it hasn't bee released */
	handleMouseDrag(event:MouseEvent):void;
	/** Called once the mouse has been released wethear on or outside target view */
	handleMouseRelease(event:MouseEvent):void;
}

/** Returns a matching element if present in list, null otherwise */
export function existsInList(item:any,list:any[]):boolean{
	for(let inList of list){
		if(item==inList){
			return true;
		}
	}
	return false;
}

/** 
 * Merges two lists together ensuring no two elements are repeated. Returns duplicates count.
 * The result list should not be either of the two lists.
 */
export function merge(list1:any[],list2:any[],result:any[]):number{
	var duplicatesFound=0;

	//add all items of first list
	for(let fromList1 of list1){
		result.push(fromList1);
	}

	//only add those items of second list that don't exist already
	for(let fromList2 of list2){
		if(!existsInList(fromList2,result)){
			result.push(fromList2);
		}else{
			duplicatesFound++;
		}
	}
	return duplicatesFound;
}

/** Returns a delimeter separated string for a supplied list */
export function csv(list:any[],delimeter=","):string{
	var csv="";
	for(let item of list){
		csv+=item.toString();
	}
	return csv;
}

/** Outputs the supplied list by calling its toString for each element */
export function printList(list:any[]){
	for(let item of list){
		console.log(item.toString());
	}
}

export function deriveSimilarButDifferentString(content:string):string{
	if(isNaN(parseInt(content, 10) )){
		return content;
	}
	return Math.floor(Math.random()*100)+"";
}

/**Removes an item from a generic list, and logs an error if the item wasn't found */
export function removeFromList(item:any,list:any[],logError?:string):boolean{
	let index=list.indexOf(item);
	if(index!=-1){
		list.splice(index,1);
		return true;
	}else if(logError!=null){
		console.error(logError);
	}
	return false;
}

/**Produces a CSV of whatever attribute is of interest in the list of items*/
export function produceCsvOf(list:any[],valuePerElement:(element:any)=>string):string{
	let csv='';
	for(let item of list){
		csv+=valuePerElement(item)+",";
	}
	return csv;
}