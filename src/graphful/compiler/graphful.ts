import * as lexer from './lexical-analyzer';
import { ParsingResult, ParsingStatus, ContextFreeGrammer, ParentParseTreeNode, LeafParseTreeNode } from './syntax-parser';
import { ParseTreeNodeType } from './syntax-parser';
import { GFGraph } from '../graph';
import { GFNode } from '../node';
import { GFEdge } from '../edge';

//Non Terminals
const NODE_LIST = "NodeList";
const NODE = "Node";
const TYPE = "Type";
const BLOCK = "Block";
const ATTRIBUTE_LIST = "AttributeList";
const ATTRIBUTE = "Attribute";
const VALUE = "Value";
const VALUE_LIST = "ValueList";
const INTEGER = "Integer";
const FLOAT = "Float";
const STRING = "String";
const ARRAY = "Array";
const EDGE = "Edge";


export const INTEGER_TYPE = "Integer";
export const FLOAT_TYPE = "Float";
export const STRING_TYPE = "String";
export const ARRAY_TYPE = "Array";

/** Converts graphful code into a graph data structure */
export class GFCompiler {

	input: string;
	graph: GFGraph;
	parsingResult: ParsingResult;
	static readonly ruleList = [
		`${NODE_LIST} -> ${NODE} ${NODE_LIST} | ${NODE}`,
		`${NODE} -> $3 ${TYPE} ${BLOCK} $36`,
		`${TYPE} -> $21 $3 $22 | $E`,
		`${BLOCK} -> $25 ${ATTRIBUTE_LIST} $26`,
		`${ATTRIBUTE_LIST} -> ${ATTRIBUTE} $11 ${ATTRIBUTE_LIST}| ${ATTRIBUTE} | $E`,
		`${ATTRIBUTE} -> $3 $34 ${VALUE}`,
		`${VALUE} -> ${INTEGER} | ${FLOAT} | ${STRING} | ${EDGE} | ${ARRAY}`,
		`${INTEGER} -> $4 | $6 $4`,
		`${FLOAT} -> $4 $37 $4 | $6 $4 $37 $4`,
		`${STRING} -> $38`,
		`${EDGE} -> $23 $3 $24`,
		`${ARRAY} -> $19 ${VALUE_LIST} $20`,
		`${VALUE_LIST} -> ${VALUE} $11 ${VALUE_LIST} | ${VALUE} | $E`,

	];

	static readonly cfg = ContextFreeGrammer.grammerFrom(GFCompiler.ruleList);

	constructor(input: string) {
		this.input = input;
	}

	compile(): boolean {
		this.parsingResult = GFCompiler.cfg.parse(this.input);
		if (this.parsingResult.status != ParsingStatus.Passed) {
			return false;
		}
		this.graph = new GFGraph();
		this.extractNodesFrom(this.parsingResult.root);
		return true;
	}

	private extractNodesFrom(nodeListContainer: ParentParseTreeNode) {
		let pairs: ContainerNodePair[] = [];
		//each child of the node container corresponds to a node in graph
		for (let child of nodeListContainer.children) {

			//child will always be a container: Node or NodeList
			let container = <ParentParseTreeNode>child;
			if (container.getNonTerminal().representation == NODE) {//NODE

				let node = this.makeSimpleNode(container);
				this.graph.nodeList.push(node);
				pairs.push(new ContainerNodePair(container, node));

			} else {//NODE_LIST
				this.extractNodesFrom(container);
			}
		}

		//find attributes for each child
		for (let pair of pairs) {

			let container = pair.container;
			let node = pair.node;
			let blockContainer = <ParentParseTreeNode>container.children[2];
			//the second contianer contains the attribute list
			let attributeListContainer = <ParentParseTreeNode>blockContainer.children[1];

			this.extractAttributeList(attributeListContainer, node);
			node.placeholder = false;
		}
	}



	private makeSimpleNode(nodeContainer: ParentParseTreeNode): GFNode {
		//retrieve id from first child
		let id = nodeContainer.children[0].getLexeme().valueIn(this.input);

		let node: GFNode = this.graph.getNodeById(id, true);

		//retrieve possible type from second child
		let typeContainer = <ParentParseTreeNode>nodeContainer.children[1];
		if (typeContainer.children.length == 3) {
			node.type = typeContainer.children[1].getLexeme().valueIn(this.input);
		}
		return node;
	}

	private extractAttributeList(attributeListContainer: ParentParseTreeNode, node: GFNode) {

		//loop through all the attributes of this container
		for (let child of attributeListContainer.children) {
			if (child.getType() == ParseTreeNodeType.Parent) {
				let container = <ParentParseTreeNode>child;

				//container is an attribute container
				if (container.getNonTerminal().representation == ATTRIBUTE) {
					//this will only have 3 children :

					//first is the identifier
					let attributeName = container.children[0].getLexeme().valueIn(this.input);
					//second is equals sign
					//third is the value itself
					this.extractValue(<ParentParseTreeNode>container.children[2], attributeName, node);
				} else {
					//container can only be an attribute list container,in which case recurse
					this.extractAttributeList(container, node);
				}
			}
		}
	}

	private extractValue(valueContainer: ParentParseTreeNode, attributeName: string, node: GFNode) {
		let valueTypeContainer = <ParentParseTreeNode>valueContainer.children[0];
		//check the expression of the non terminal
		if (valueTypeContainer.getNonTerminal().representation == INTEGER) {
			//the input can be negative, so check the lexeme type of the first terminal
			let isNegative=false;
			let offset=0;
			if(valueTypeContainer.children[0].getLexeme().type==lexer.LexemeType.Minus){
				isNegative=true;
				offset=1;
			}
			let valueFromInput = valueTypeContainer.children[offset+0].getLexeme().valueIn(this.input);//this will always be positive
			let value = parseInt(valueFromInput);
			if(isNegative){
				value=-value;
			}
			let valueNode = new GFNode();
			valueNode.type = INTEGER_TYPE;
			valueNode.value = value;
			let attributeEdge = new GFEdge();
			attributeEdge.name = attributeName;
			attributeEdge.node1 = node;
			attributeEdge.node2 = valueNode;
			node.edgeList.push(attributeEdge);
		} else if (valueTypeContainer.getNonTerminal().representation == FLOAT) {
			//the input can be negative, so check the lexeme type of the first terminal //TODO duplicate code
			let isNegative=false;
			let offset=0;
			if(valueTypeContainer.children[0].getLexeme().type==lexer.LexemeType.Minus){
				isNegative=true;
				offset=1;
			}

			//get the 2 lexemes on the outer side, and parse it to create a float value
			let beforeDecimal = valueTypeContainer.children[offset+0].getLexeme().valueIn(this.input);
			let afterDecimal = valueTypeContainer.children[offset+2].getLexeme().valueIn(this.input);
			let value = parseFloat(beforeDecimal + "." + afterDecimal);
			if(isNegative){
				value=-value;
			}
			let valueNode = new GFNode();
			valueNode.type=FLOAT_TYPE;
			valueNode.value=value;
			let attributeEdge=new GFEdge();
			attributeEdge.name=attributeName;
			attributeEdge.node1=node;
			attributeEdge.node2=valueNode;
			node.edgeList.push(attributeEdge);
		} else if (valueTypeContainer.getNonTerminal().representation == STRING) {
			//get the only lexeme from this container, and parse it to create a string value
			let valueFromInput = valueTypeContainer.children[0].getLexeme().valueIn(this.input);
			let valueNode = new GFNode();
			valueNode.type=STRING_TYPE;
			valueNode.value=valueFromInput;
			let attributeEdge=new GFEdge();
			attributeEdge.name=attributeName;
			attributeEdge.node1=node;
			attributeEdge.node2=valueNode;
			node.edgeList.push(attributeEdge);
		} else if (valueTypeContainer.getNonTerminal().representation == EDGE) {
			let outgoingNodeId = valueTypeContainer.children[1].getLexeme().valueIn(this.input)
			let outgoingNode = this.graph.getNodeById(outgoingNodeId, true);
			let edge = new GFEdge();
			edge.name=attributeName;
			edge.node1 = node;
			edge.node2 = outgoingNode;
			outgoingNode.value=outgoingNode;//because this is an attribute, it needs to have a value of itself
			node.edgeList.push(edge);

			//because this is an edge between two object nodes,we push to graph edge list
			this.graph.edgeList.push(edge);//TODO for arrays, a recursive call will make an edge between a node and array in graph
		

		} else if (valueTypeContainer.getNonTerminal().representation == ARRAY) {
			
			let arrayNode = new GFNode();
			arrayNode.type=ARRAY_TYPE;
			let attributeEdge=new GFEdge();
			attributeEdge.name=attributeName;
			attributeEdge.node1=node;
			attributeEdge.node2=arrayNode;
			arrayNode.value=arrayNode;//because this is an attribute, it needs to have a value of itself
			node.edgeList.push(attributeEdge);
			this.extractValueList(<ParentParseTreeNode>valueTypeContainer.children[1],0,arrayNode);//the middle child contains the value list

		}
	}

	private extractValueList(valueListContainer:ParentParseTreeNode,index:number,arrayNode:GFNode){
		//take the first child all the time
		let child=valueListContainer.children[0];

		//possibly this could be null because of epsilon in the value list rule
		if(child==null){
			return ;
		}

		//first child will always be a value node
		let attributeName=index+"";
		this.extractValue(<ParentParseTreeNode>child,attributeName,arrayNode);

		if(valueListContainer.children.length>2){
			//three children means value , value list
			//which means second child will always be comma

			//and third child will always be value list
			let childValueListContainer=<ParentParseTreeNode>valueListContainer.children[2];
			this.extractValueList(childValueListContainer,index+1,arrayNode);
		}

		
	}

}

class ContainerNodePair {
	container: ParentParseTreeNode;
	node: GFNode;
	constructor(container: ParentParseTreeNode, node: GFNode) {
		this.container = container;
		this.node = node;
	}


}