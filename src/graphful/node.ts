import { GFEdge } from './edge';

export class GFNode{
	id:string;
	type:string;
	/** Attributes associated to this node, weather they are primitives,array objects or other nodes*/
	edgeList:GFEdge[]=[];
	/** 
	 * If this node represents an object, this will be a reference to itself, otherwise, 
	 * a node may represent a primitive, in which case it will hold simple value like a string or a number
	 */
	value:any;
	/** Placeholder nodes are used by edges that don't have actual nodes prepared up yet */
	placeholder=false;

	getAttributeValue(attributeName:string):any{
		let connectedNode:GFNode;
		let attributeEdge=this.edgeBy(attributeName,this.edgeList);
		
		if(attributeEdge!=null){
			return attributeEdge.node2.value;
		}else{
			return null;
		}
	}

	private edgeBy(name:string,edgeList:GFEdge[]):GFEdge{
		for(let edge of edgeList){
			if(edge.name==name){
				return edge;
			}
		}
		return null;
	}

	toString():string{
		return this.id;
	}
}
