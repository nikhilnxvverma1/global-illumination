import { Lexeme,LexemeType, getLexemeList } from './lexical-analyzer';
import * as sp from './syntax-parser';

/**
 * Example of a simple calculator using CFG grammer.
 */
export class SimpleCalculator {
	static readonly ruleList = [
		"Expr -> Expr Op Expr | $4",
		"Op -> $6 | $7"
	];

	expression: string;
	result: number;
	parsingResult:sp.ParsingResult;

	constructor(expression:string){
		this.expression=expression;
		this.calculate();
	}

	private calculate(): boolean {
		let cfg = sp.ContextFreeGrammer.grammerFrom(SimpleCalculator.ruleList);
		this.parsingResult = cfg.parse(this.expression);
		if (this.parsingResult.status==sp.ParsingStatus.Passed) {
			//We use the parse tree to recursively compute the result at each stage of three children
			this.result = this.resultFor(this.parsingResult.root, this.expression);
			return true;
		} else {
			return false;
		}
	}

	private resultFor(parseTreeNode: sp.ParseTreeNode, input: string): number {

		//since non terminals can only be of two types: Expr and Ops
		if (parseTreeNode.getType() == sp.ParseTreeNodeType.Parent) {
			let parentParseTreeNode = (parseTreeNode as sp.ParentParseTreeNode);

			//we look for Expr since thats the one that would have three children or one child all the time
			let nonTerminal = parseTreeNode.getNonTerminal();
			if (nonTerminal.representation == "Expr") {

				if (parentParseTreeNode.children.length == 1) {
					//if the number of children is 1, return the number itself
					let leafNode = parentParseTreeNode.children[0] as sp.LeafParseTreeNode;
					let value = leafNode.getLexeme().valueIn(input);
					return Number.parseInt(value);

				} else if (parentParseTreeNode.children.length == 3) {
					//if the number of children is 3, return the operation between the two expr on either sides
					let leftSide = this.resultFor(parentParseTreeNode.children[0], input);
					let rightSide = this.resultFor(parentParseTreeNode.children[2], input);

					//find the operation to perform between these two expressions
					let operationNode=parentParseTreeNode.children[1] as sp.ParentParseTreeNode;
					return this.operateTwoNumbers(leftSide,rightSide,operationNode.children[0].getLexeme());

				} else {
					throw new Error("Unexpected number of children in Expr");
				}
			}
		}
		return 0;
	}

	private operateTwoNumbers(left: number, right: number, operation: Lexeme): number {

		if (operation.type == LexemeType.Plus) {
			return left + right;
		} else if (operation.type == LexemeType.Minus) {
			return left - right;
		} else {
			throw new Error("Unexpected operation:" + operation);
		}
	}
}