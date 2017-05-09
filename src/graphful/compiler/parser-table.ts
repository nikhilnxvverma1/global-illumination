import { ContextFreeGrammer,Rule } from './syntax-parser';
import { Terminal,NonTerminal,SyntaxElement,SyntaxElementType } from './syntax-parser';
import * as util from '../graphful-util';

/** Type of action in the parser table */
export enum ParserTableValueType{
	Blank=1,
	Shift,
	Reduce,
	Goto,
	Accept
}

/**  Inidivual cell value of the 2d parse table. */
export class ParserTableValue{
	type:ParserTableValueType;
	n:number;

	constructor(type:ParserTableValueType,n:number){
		this.type=type;
		this.n=n;
	}

	toString():string{
		switch(this.type){
			case ParserTableValueType.Blank:return "  ";
			case ParserTableValueType.Shift:return "S"+this.n;
			case ParserTableValueType.Reduce:return "R"+this.n;
			case ParserTableValueType.Goto:return "G"+this.n;
			case ParserTableValueType.Accept:return "Ac";
		}
		return null;
	}
}

export class ShiftReduceConflict{
	state:number;
	terminal:Terminal;
	constructor(state:number,terminal:Terminal){
		this.state=state;
		this.terminal=terminal;
	}
}

/** Holds a 2d table that drives the shift reduce algorithm. */
export class ParserTable{
	private cfg:ContextFreeGrammer;
	private table:ParserTableValue[][]=[];
	private rowCount=0;

	shiftReduceConflicts:ShiftReduceConflict[]=[];

	constructor(cfg:ContextFreeGrammer){
		this.cfg=cfg;
		//set the indices and get table length
		this.setIndices();

		this.constructUsingLR1();
	}

	/** Sets the indices of the terminal and variable elements and */
	private setIndices():number{
		var index=0;
		for(;index<this.cfg.terminalList.length;index++){
			this.cfg.terminalList[index].tableIndex=index;
		}
		// this.cfg.eof.tableIndex=index;

		for(var j=0;j<this.cfg.variableList.length;j++){
			this.cfg.variableList[j].tableIndex=index++;
		}
		return this.cfg.terminalList.length + 1 + this.cfg.variableList.length;
	}

	/** Returns total column length of the parser table */
	private totalColumns(){
		return this.cfg.terminalList.length + this.cfg.variableList.length;
	}

	/** Creates new row in the table column */
	private makeNewRow(){
		var totalColumns=this.totalColumns();
		this.table[this.rowCount]=[];
		for(var j=0;j<totalColumns;j++){
			this.table[this.rowCount][j]=new ParserTableValue(ParserTableValueType.Blank,0);
		}
		this.rowCount++;
	}

	getAction(row:number,terminal:Terminal):ParserTableValue{
		return this.table[row][terminal.tableIndex];
	}

	setAction(row:number,terminal:Terminal,type:ParserTableValueType,n:number){
		this.table[row][terminal.tableIndex].type=type;
		this.table[row][terminal.tableIndex].n=n;
	}

	getGoto(row:number,variable:NonTerminal):number{
		return this.table[row][variable.tableIndex].n;
	}

	setGoto(row:number,variable:NonTerminal,n:number){
		this.table[row][variable.tableIndex].type=ParserTableValueType.Goto;
		this.table[row][variable.tableIndex].n=n;
	}

	/** Constructs the parser table using LR1 construction algorithm */
	private constructUsingLR1(){
		
		//used in marking the indices of all the states
		var stateCount=0;

		//these two stack help in tracking which all states have got their transitions found
		var processedStates:ParsingState[]=[];
		var unprocessedStates:ParsingState[]=[];

		//create the first LR1 item by placing the dot at the first symbol of the augumented rule
		let initialItem=new LR1Item(this.cfg.relation[0],0);
		initialItem.lookaheads.push(this.cfg.eof);

		//closure is found internally inside the constructor
		var firstState=new ParsingState([initialItem],this.cfg);

		//find the outgoing transitions for all the unprocessed states 
		unprocessedStates.push(firstState);
		while(unprocessedStates.length!=0){

			//pop from unprocessed and push to processed before  adding new states
			let state=unprocessedStates.pop();
			processedStates.push(state);
			state.stateNo=stateCount++;

			//we will use the symbols after the dot in each item of this state, to determine the next propogating states
			let beforeDotSymbols = state.getRespectiveSymbolsPostDot(this.cfg);
			let yieldedNewStates = false;

			for(let symbol of beforeDotSymbols){
				let outgoing=state.transitionFor(symbol,this.cfg);
				if(outgoing!=null){
					yieldedNewStates=true;

					state.transitions.push(outgoing);//note that this is a transition and not a state
					//check if this state already exists
					let existing=this.findMatchingState(outgoing.to,processedStates,unprocessedStates);
					if(existing!=null){
						//use existing state if they exist, 
						outgoing.to=existing;
					}else{
						//otherwise add the new state to unprocessed list
						//this must be added in the beginning, otherwise it would lead 
						//to closure being done from the opposite direction
						unprocessedStates.unshift(outgoing.to);
					}
				}
			}

			//after finding all the possible transitions
			state.finalState = !yieldedNewStates;

		}

		this.fillTableUsing(processedStates);

		//output
		// util.printList(processedStates);//only states
		// this.printStateDiagram(processedStates);
		
		// let graphviz=this.generateGraphViz(processedStates);
		// console.log(`Graphviz:${this.cfg.displayName}`);
		// console.log(graphviz);
		// this.printParsingTable();
	}


	/** Uses the LR(1) state diagram to fill entries in the parsing table */
	private fillTableUsing(stateDiagram:ParsingState[]){

		/* By using the state diagram constructed so far, we make a tabular representation of
			our CFG. This is later used by the parser to figure out which state to jump to in our 
			state diagram as we are scanning through the input.If the last state we land on happens 
			to be the final state, the input is said to have passed. During this process, we also 
			construct the parse tree as a byproduct
		 */

		//initialize the 2d table
		for(var i=0;i<stateDiagram.length;i++){//as many row as are states
			this.makeNewRow();
		}

		//mark all shift entries in the table
		for(let state of stateDiagram){
			
			//check all its transitions 
			for(let transition of state.transitions){
				//if the outgoing symbol is a non terminal
				if(transition.syntaxElement.getType()==SyntaxElementType.NonTerminal){//goto entry 
					this.setGoto(
						state.stateNo,
						<NonTerminal>transition.syntaxElement,
						transition.to.stateNo);
				}else{//(terminal) : shift entry
					this.setAction(
						state.stateNo,
						<Terminal>transition.syntaxElement,
						ParserTableValueType.Shift,
						transition.to.stateNo);
				}
			}

			//find all items of this state that have dot at the end
			let finishedItems=state.finsihedItems();
			for(let item of finishedItems){

				if(item.rule.ruleIndex==0){//accept entry (starting rule)
					this.setAction(
						state.stateNo,
						this.cfg.eof,
						ParserTableValueType.Accept,
						-1);
				}else{//reduce entry

					//only under the lookahead symbols
					for(let lookahead of item.lookaheads){
						if(this.getAction(state.stateNo,lookahead).type==ParserTableValueType.Shift){
							// console.error("Shift Reduce Conflict arisen at ("+state.stateNo+","+lookahead.token+")");
							this.shiftReduceConflicts.push(new ShiftReduceConflict(state.stateNo,lookahead));
						}
						this.setAction(
							state.stateNo,
							lookahead,
							ParserTableValueType.Reduce,
							item.rule.ruleIndex);
					}
				}

			}
		}
	}

	/** Prints the entire state diagram with the transitions */
	private printStateDiagram(stateList:ParsingState[]){
		console.log("LR(1) State Diagram. Total States: "+stateList.length);

		let i=0;
		//go to each state
		for(let state of stateList){

			console.log("S"+i++);
			for(let item of state.itemList){
				console.log(item.toString());
			}

			//print transition between states for this state
			let transitionCSV="";
			for(let transition of state.transitions){
				transitionCSV+="("+transition.syntaxElement.toString()+")"+transition.to.stateNo+",";
			}
			console.log(transitionCSV);
		}
	}


	/** Prints the entire table held by this object */
	private printParsingTable(){
		console.log("Parsing table");

		var headerString="	";
		for(var i=0;i<this.cfg.terminalList.length;i++){
			headerString+=this.cfg.terminalList[i].toString()+"		";
		}
		// headerString+=this.cfg.eof.toString()+"  ";

		for(var j=0;j<this.cfg.variableList.length;j++){
			headerString+=this.cfg.variableList[j].toString()+"		";
		}

		console.log(headerString);

		for(i=0;i<this.table.length;i++){
			var rowString=i+"	";
			for(let cell of this.table[i]){
				rowString+=cell.toString()+"|		";
			}
			console.log(rowString);
		}
	}

	/** Finds the matching state from a any list of states, if exists */
	private findMatchingState(parsingState:ParsingState,list1:ParsingState[],list2:ParsingState[]):ParsingState{

		//check if its in first list
		for(let stateInList of list1){
			if(parsingState!=stateInList && parsingState.equals(stateInList)){
				return stateInList;
			}
		}

		//check if its in second list
		for(let stateInList of list2){
			if(parsingState!=stateInList && parsingState.equals(stateInList)){
				return stateInList;
			}
		}
		return null;
	}

	generateGraphViz(states:ParsingState[]):string{
		let graphviz=`
			digraph state_machine {
			rankdir=LR;
			node [shape = rectangle];
			`;

		for(let state of states){
			
			graphviz+=`${state.stateNo}`;
			graphviz+=`[label="${state.stateNo}\\n`;
			for(let item of state.itemList){
				graphviz+=item.toString()+"\\n";
			}
			graphviz+=`"];`;
	
		}
		for(let state of states){
			for(let transition of state.transitions){
				graphviz+=`${state.stateNo} -> ${transition.to.stateNo} [label = "${transition.syntaxElement.toString()}"];`;
			}
		}
		
		graphviz+=`}`;

		return graphviz;
	}
}

/** An LR(1) item is a combination of rule, position of cursor(dot) and lookahead symbols */
export class LR1Item{

	rule:Rule;
	/** Denotes cursor position which is specified by index in the rule's RHS.*/
	dot:number;
	lookaheads:Terminal[]=[];

	constructor(rule:Rule,dot:number){
		this.rule=rule;
		this.dot=dot;
	}

	/** Checks if the two items are same by comparing their attributes */
	equals(other:LR1Item):boolean{
		var lookaheadsMatch=true;
		if(this.lookaheads.length==other.lookaheads.length){
			//matches lookaheads in both items 
			for(let lookahead of this.lookaheads){
				//using two loops ensure order of lookaheads in each doesn't matter
				//if both lookahead lists are in same order, this will take O(n) time anyway
				var found=false;
				for(let otherLookahead of other.lookaheads){
					if(lookahead==otherLookahead){
						found=true;
						break;
					}
				}
				if(!found){
					lookaheadsMatch=false;
					break;
				}
			}
		}else{
			lookaheadsMatch=false;
		}
		return this.rule==other.rule && this.dot==other.dot && lookaheadsMatch;
	}

	/**
	 * Proceeds the cursor(dot) one step to produce a new item.
	 * During this process, the new lookaheads are also computed
	 */
	proceed():LR1Item{
		if(this.dot<this.rule.rhs.length){

			let proceeded=new LR1Item(this.rule,this.dot+1);
			proceeded.lookaheads=this.lookaheads;
			return proceeded;
		}
		return null;
	}

	/** Checks dot position by comparing with the length of the rhs of the rule */
	dotAtTheEnd():boolean{
		return this.dot==this.rule.rhs.length;
	}

	/** 
	 * Gives the element after dot.Optionally, you can also skip elements(default is 0).
	 * Gives null if dot(plus skip) is beyond the length of RHS
	 */
	elementAfterDot(skip=0):SyntaxElement{
		if(this.dot+skip<this.rule.rhs.length){
			return this.rule.rhs[this.dot+skip];
		}
		return null;
	}

	/** Returns true if dot exists before a variable or terminal, false otherwise */
	dotBeforeSyntaxElement():boolean{
		return this.dot<this.rule.rhs.length;//in case of epsilon only on lhs of rule, length will be 0
	}

	toString():string{
		var rhsProgress="";
		for(var i=0;i<this.dot;i++){
			rhsProgress+=this.rule.rhs[i].toString()+" ";
		}
		rhsProgress+=".";
		while(i<this.rule.rhs.length){
			rhsProgress+=this.rule.rhs[i].toString()+" ";
			i++;
		}
		return this.rule.lhs.toString()+"->"+rhsProgress+","+util.csv(this.lookaheads," ");
	}
}

/** A collection of LR(1) item set along with transitions to other states */
export class ParsingState{
	stateNo:number;
	itemList:LR1Item[]=[];
	transitions:ParsingTransition[]=[];
	/** Wether this state yields any new state or not (as determined by the construction algorithm) */
	finalState:boolean;

	constructor(itemList:LR1Item[],cfg:ContextFreeGrammer){
		this.itemList=itemList;
		this.findClosure(cfg);
	}

	/** In finding the closure, it computes new lookahead symbols */
	private findClosure(cfg:ContextFreeGrammer){
		for(let item of this.itemList){
			this.closure(item,cfg);
		}
	}

	/** A final state is one which has a single item where the dot is at the end */
	isFinalState():boolean{
		return this.itemList.length==1 && !this.itemList[0].dotBeforeSyntaxElement();
	}

	/** 
	 * For all the items in this state, it returns a respective list of syntax elements that appear after the dot in each.
	 * The symbols is EOF if the dot is in the end.
	 */
	getRespectiveSymbolsPostDot(cfg:ContextFreeGrammer):SyntaxElement[]{
		let symbolsAfterDot:SyntaxElement[]=[];
		for(let item of this.itemList){
			let elementAfterDot=item.elementAfterDot();

			if(elementAfterDot!=null){
				symbolsAfterDot.push(elementAfterDot);
			}else{
				symbolsAfterDot.push(cfg.eof);
			}
		}
		return symbolsAfterDot;
	}

	/** Returns list of items that have dots at the end */
	finsihedItems():LR1Item[]{
		let finishedItems:LR1Item[]=[];
		for(let item of this.itemList){
			if(item.dotAtTheEnd()){
				finishedItems.push(item);
			}
		}
		return finishedItems;
	}

	/** 
	 * Computes and returns the transition to the next state for a given syntax element.
	 */
	transitionFor(syntaxElement:SyntaxElement,cfg:ContextFreeGrammer):ParsingTransition{

		//find all the items for which the given syntax element is exactly before the dot
		let coveredItems:LR1Item[]=[];
		for(let item of this.itemList){
			if(item.elementAfterDot()==syntaxElement){
				coveredItems.push(item);
			}
		}

		//(an empty list indicates a final state)
		if(coveredItems.length>0){

			//proceed each covered item and create new list of proceeeded items
			let proceededItems:LR1Item[]=[];
			for(let item of coveredItems){
				proceededItems.push(item.proceed());
			}

			//for the covered items, create a new state 
			let nextState=new ParsingState(proceededItems,cfg);//the closure is found inside

			//create a new transition for this syntax element and return
			return new ParsingTransition(this,nextState,syntaxElement);
		}
		return null;
	}

	/** Checks if the two states are same by comparing only their LR(1) item set */
	equals(other:ParsingState):boolean{
		var itemsMatch=true;
		if(this.itemList.length==other.itemList.length){
			//matches LR(1) items in both states
			for(let item of this.itemList){
				//using two loops ensure order of LR(1) items in each doesn't matter
				//if both item lists are in same order, this will take O(n) time anyway
				var found=false;
				for(let otherItem of other.itemList){
					if(item.equals(otherItem)){
						found=true;
						break;
					}
				}
				if(!found){
					itemsMatch=false;
					break;
				}
			}
		}else{
			itemsMatch=false;
		}
		return itemsMatch;
	}

	/** Recursively finds and adds all LR(1) items by looking at the position of the dot */
	private closure(item:LR1Item,cfg:ContextFreeGrammer){
		
		/*
		 * In finding closure, if the element after dot is a non terminal element,
		 * we find all the rules that contain that non terminal on the LHS.
		 * For each such rule, we place the dot at the beginning, thereby creating new 
		 * (derived) LR1 Items. Each LR1 Item also requires a set of lookaheads.
		 * 
		 */

		if(item.dotBeforeSyntaxElement()){

			//check the item after the dot
			var afterDot=item.elementAfterDot();
			if(afterDot.getType()==SyntaxElementType.NonTerminal){
				
				//find all rules for this non terminal
				var variableRules=cfg.rulesFor(<NonTerminal>afterDot);

				//for each variable rule, 
				for(let variableRule of variableRules){

					//make an LR(1) item with dot placed at the beginning,
					var derived=new LR1Item(variableRule,0);

					//find the lookaheads for the derived item
					var derivedsLookaheads:Terminal[];
					var followingAfterDot=item.elementAfterDot(1);//it is item's follow after dot

					if(followingAfterDot!=null){

						if(followingAfterDot.getType()==SyntaxElementType.NonTerminal){
							//find first and store in a list
							var firstTerminals:Terminal[]=[];
							// cfg.first(<NonTerminal>followingAfterDot,firstTerminals,false);//we intentionally don't find first recursively
							cfg.first(<NonTerminal>followingAfterDot,firstTerminals,true);//finds lookaheads if they are further deeper inside another non terminal

							//if the first list is empty, 
							if(firstTerminals.length==0){
								//use the first from existing item
								derivedsLookaheads=item.lookaheads;
							}else{
								//remove eof from first terminal if exist
								var eofIndex=firstTerminals.indexOf(cfg.eof);
								if(eofIndex!=-1){
									firstTerminals.splice(eofIndex,1);
								}
								derivedsLookaheads=firstTerminals;
							}
						}else if(followingAfterDot.getType()==SyntaxElementType.Terminal){
							//only add that terminal in the deriveds lookahead
							derivedsLookaheads=[];
							derivedsLookaheads.push(<Terminal>followingAfterDot);
						}
					}else{
						derivedsLookaheads=item.lookaheads;//TODO same object may cause problems later if changes are made
					}
					//set the lookaheads for the derived items 
					derived.lookaheads=derivedsLookaheads;

					//don't add this derived it if already exists, otherwise the list will grow indefinitely
					if(!this.contains(derived)){
						this.itemList.push(derived);
					}
				
				}
			}
		}
	}

	private containsItemWith(lhs:NonTerminal):boolean{
		for(let item of this.itemList){
			if(item.rule.lhs==lhs){
				return true;
			}
		}
		return false;
	}

	contains(possible:LR1Item):boolean{
		for(let item of this.itemList){
			if(item.equals(possible)){
				return true;
			}
		}
		return false;
	}

	toString():string{
		var itemSets="";
		for(let item of this.itemList){
			itemSets+=item.toString();
			itemSets+=", ";
		}
		return this.stateNo+":"+itemSets;
	}
}

/** Denotes transition from one parsing state to another for a given syntax element */
export class ParsingTransition{
	syntaxElement:SyntaxElement;
	from:ParsingState;
	to:ParsingState;

	constructor(from:ParsingState,to:ParsingState,forElement:SyntaxElement){
		this.from=from;
		this.to=to;
		this.syntaxElement=forElement;
	}

	toString():string{
		return this.from.stateNo+":"+this.syntaxElement.toString()+":"+this.to.toString();
	}
}