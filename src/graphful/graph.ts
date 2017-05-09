import { GFNode } from './node';
import { GFEdge } from './edge';

export class GFGraph{
	/** Holds all higher level nodes (list of Object nodes) */
	nodeList:GFNode[]=[];
	/** Holds only edges that act as links between two 'Object' nodes or an 'Object' node and an 'Array' node */
	edgeList:GFEdge[]=[];

	//methods for filtering nodes based on a selector

	getNodeById(id:string,makeIfNeeded=false):GFNode{
		for(let i=0;i<this.nodeList.length;i++){
			if(this.nodeList[i].id==id){
				return this.nodeList[i];
			}
		}
		if(makeIfNeeded){
			let node=new GFNode();
			node.id=id;
			//by default the node will hold a value of itself to represent an object
			node.value=node;
			node.placeholder=true;
			return node;
		}
		return null;
	}

	getNodesOfType(type:string):GFNode[]{
		let filteredNodes:GFNode[]=[];
		for(let i=0;i<this.nodeList.length;i++){
			if(this.nodeList[i].type==type){
				filteredNodes.push(this.nodeList[i]);
			}
		}
		return filteredNodes;
	}

	/** Returns nodes in a path in the object graph. */
	valueInPath(path:string):any{
		let pathItems:string[]=path.split(".");
		let nodeList:GFNode[]=this.nodeList;
		let currentNode:GFNode=null;
		let i=0;
		while(i<pathItems.length){
			let item=pathItems[i];

			let isArray=false;
			let arrayIndex=-1;//by default array index is not applicable
			let identifier=item;//by default identifier is same as the current item

			if(item.endsWith("]")){//indexed
				isArray=true;
				let openBracket=item.lastIndexOf("[");
				let closeBracket=item.lastIndexOf("]");
				let numberInsideBrackets=item.substring(openBracket+1,closeBracket);//excluding ending bracket
				arrayIndex=parseInt(numberInsideBrackets);
				identifier=item.substring(0,openBracket);
			}

			if(i==0){
				currentNode=this.getNodeById(identifier);
			}else{
				currentNode=currentNode.getAttributeValue(identifier);
			}

			//there is no node if chain breaks at this point
			if(currentNode==null){
				return null;//TODO send error
			}

			if(isArray){
				currentNode=currentNode.getAttributeValue(""+arrayIndex);
			}

			i++;
		}
		
		return currentNode;
	}
}