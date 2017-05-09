/** Each lexeme can be identified by its type. These help in easily categorising the different tokens in a string. */
export enum LexemeType { //debugging tip: use this line number to derive the number for the enum constant
	Identifier = 3,	//alphanumeric starting with a letter,underscore accepted
	Number,// any integer number
	Unknown,// just anything, this has the lease priority 
	Minus,//-
	Plus,//+
	HashTag,//#
	Tilde,//~
	Colon,//:
	Comma,//,
	Int,//int
	Float,//float
	Bool,//bool
	Char,//char
	String,//string
	Void,//void
	Star,//*
	OpeningSquareBracket,//[
	ClosingSquareBracket,//]
	OpeningAngularBracket,//<
	ClosingAngularBracket,//>
	OpeningCurvedBracket,//(
	ClosingCurvedBracket,//)
	OpeningCurlyBracket,//{
	ClosingCurlyBracket,//}
	Interface,//interface
	Enumeration,//enumeration
	OpeningMultiLineComment,// /*
	ClosingMultiLineComment,// */
	EOF,//End of File, artificial and used exclusively by parser
	ForwardSlash,// /
	BackwardSlash,// \
	Equals,//=
	Backtick,//`
	SemiColon,//;
	Dot,//.
	Literal// "23 asf 435" (anything between a pair of quotes, or backticks or double quotes)
	//NOTE: For each addition or change, make sure to revise the string representation method below

}

/** Returns string representation of the lexeme type. Used only for development purposes */
export function stringForLexemeType(type: LexemeType): string {

	switch (type) {
		case LexemeType.Identifier: return "<id>";
		case LexemeType.Number: return "<num>";
		case LexemeType.Unknown: return "'unknown'";
		case LexemeType.Minus: return "-";
		case LexemeType.Plus: return "+";
		case LexemeType.HashTag: return "#";
		case LexemeType.Tilde: return "~";
		case LexemeType.Colon: return ":";
		case LexemeType.Comma: return ",";
		case LexemeType.Int: return "int";
		case LexemeType.Float: return "float";
		case LexemeType.Bool: return "bool";
		case LexemeType.Char: return "char";
		case LexemeType.String: return "string";
		case LexemeType.Void: return "void";
		case LexemeType.Star: return "*";
		case LexemeType.OpeningSquareBracket: return "[";
		case LexemeType.ClosingSquareBracket: return "]";
		case LexemeType.OpeningAngularBracket: return "<";
		case LexemeType.ClosingAngularBracket: return ">";
		case LexemeType.OpeningCurvedBracket: return "(";
		case LexemeType.ClosingCurvedBracket: return ")";
		case LexemeType.Interface: return "interface";
		case LexemeType.Enumeration: return "enumeration";
		case LexemeType.OpeningMultiLineComment: return "/*";
		case LexemeType.ClosingMultiLineComment: return "*/";
		case LexemeType.OpeningCurlyBracket: return "{";
		case LexemeType.ClosingCurlyBracket: return "}";
		case LexemeType.ForwardSlash: return "/";
		case LexemeType.BackwardSlash: return "\\";
		case LexemeType.Equals: return "=";
		case LexemeType.Backtick: return "`";
		case LexemeType.SemiColon: return ";";
		case LexemeType.Dot: return ".";
		case LexemeType.Literal: return "<literal>";

		case LexemeType.EOF: return "$";//return "EOF";
	}

	return null;
}

/** 
 * A token in the string that qualifies as an identified symbol in the grammer .
 * A Lexeme should be thought of as an instance of a terminal in the CFG.
 */
export class Lexeme {
	type: LexemeType;
	start: number;
	length: number;

	/**
	 * Index in the terminal list of the context free grammer. This is set and read 
	 * by the parsing algorithm and as such should not be touched.
	 */
	terminalIndex: number;

	constructor(type: LexemeType, startIndex: number, length: number) {
		this.type = type;
		this.start = startIndex;
		this.length = length;
	}

	toString(): string {
		return this.type + " ";
	}

	valueIn(input: string): string {

		//special case: remove the outer qutation marks
		if(this.type==LexemeType.Literal){

			//ending also with literal mark
			if(litrealMarkFor(input.charAt(this.start+this.length-1))!=LiteralMark.None){
				return input.substr(this.start+1, this.length-2);
			}else{
				return input.substr(this.start+1, this.length-1);
			}

		}else{
			return input.substr(this.start, this.length);;
		}
	}
}

class Keyword {
	word: string;
	type: LexemeType;

	constructor(word: string, type: LexemeType) {
		this.word = word;
		this.type = type;
	}

	lexemeMatch(container: string, fromIndex: number): Lexeme {
		if (fromIndex + this.word.length > container.length) {
			return null;
		}
		var fromHere = container.substring(fromIndex, fromIndex + this.word.length);
		if (this.word == fromHere) {
			return new Lexeme(this.type, fromIndex, this.word.length);
		} else {
			return null;
		}
	}

	toString(): string {
		return this.word + " (" + this.type + ")";
	}
}

var keywordList: Keyword[] = [
	new Keyword("interface", LexemeType.Interface),
	new Keyword("enumeration", LexemeType.Enumeration),
	new Keyword("int", LexemeType.Int),
	new Keyword("char", LexemeType.Char),
	new Keyword("bool", LexemeType.Bool),
	new Keyword("float", LexemeType.Float),
	new Keyword("string", LexemeType.String),
	new Keyword("void", LexemeType.Void),
	new Keyword("+", LexemeType.Plus),
	new Keyword("-", LexemeType.Minus),
	new Keyword("#", LexemeType.HashTag),
	new Keyword("~", LexemeType.Tilde),
	new Keyword(":", LexemeType.Colon),
	new Keyword(",", LexemeType.Comma),
	new Keyword("*", LexemeType.Star),
	new Keyword("/*", LexemeType.OpeningMultiLineComment),
	new Keyword("*/", LexemeType.ClosingMultiLineComment),
	new Keyword("[", LexemeType.OpeningSquareBracket),
	new Keyword("]", LexemeType.ClosingSquareBracket),
	new Keyword("(", LexemeType.OpeningCurvedBracket),
	new Keyword(")", LexemeType.ClosingCurvedBracket),
	new Keyword("{", LexemeType.OpeningCurlyBracket),
	new Keyword("}", LexemeType.ClosingCurlyBracket),
	new Keyword("<", LexemeType.OpeningAngularBracket),
	new Keyword(">", LexemeType.ClosingAngularBracket),
	new Keyword("/", LexemeType.ForwardSlash),
	new Keyword("\\", LexemeType.BackwardSlash),
	new Keyword("=", LexemeType.Equals),
	new Keyword("`", LexemeType.Backtick),
	new Keyword(";", LexemeType.SemiColon),
	new Keyword(".", LexemeType.Dot),
]

//sort the keyword list in descending order because
//longer keywords are prioritised over shorter ones during ambiguities. 
//Example: 'interface' before 'int' 
keywordList.sort((a: Keyword, b: Keyword) => {
	return b.word.length - a.word.length;
});

/** 
 * Performs lexical analysis algorithm to yield a list of lexeme(of various categories).
 */
export function getLexemeList(input: string): Lexeme[] {
	let lexemeList: Lexeme[] = [];

	let inputLength = input.length;
	let i = 0;
	let openingLiteralMark = LiteralMark.None;
	while (i < inputLength) {

		//firstly check for pair of quotation marks : backticks, qutoes or double quotes 
		//these define literals that will be impossible to capture afterwards
		openingLiteralMark = litrealMarkFor(input.charAt(i));
		if (openingLiteralMark != LiteralMark.None) {

			//look for closing literal
			let j = i + 1;
			let closingLiteralMark = litrealMarkFor(input.charAt(j));

			//find the literal for each character after the first opening literal
			while (j < inputLength && closingLiteralMark != openingLiteralMark) {
				j++;
				closingLiteralMark = litrealMarkFor(input.charAt(j));
			}

			//once a closing literal is found, mark its index and return the length in an appropriate lexeme
			let length = j - i;
			let literal = new Lexeme(LexemeType.Literal, i, length);
			lexemeList.push(literal);
			i = j + 1;

			continue;//this lexeme has been found, so move on to the next one
		}

		//skip through any whitespace(including tabs) or newlines 
		let char=input.charAt(i);
		if(char ==' ' || char == '\n' || char == '\t'){
			i++;
			continue;
		}

		//check for match with any keyword
		//this is an O(1) operation since the keyword list is finitely defined
		//in other words, think of this as multiple if else statements
		let keywordMatch: Lexeme = null;
		for (let keyword of keywordList) {

			//if there is a match, store the result, and break from this inner loop
			keywordMatch = keyword.lexemeMatch(input, i);
			if (keywordMatch != null) {
				break;
			}
		}

		//for a keyword match, push to lexeme list and increment the index by that much length for the next iteration
		if (keywordMatch != null) {
			lexemeList.push(keywordMatch);
			i += keywordMatch.length;
			continue;
		}

		//if no keywords matched by now, check to see if it is any other type of symbol
		if (isAlpha(input.charAt(i))) { //identifier check (alphanumeric with _ accepted)
			let startIndex = i;
			while (i < inputLength &&
				(isAlpha(input.charAt(i)) ||
					isDigit(input.charAt(i))) ||
				"_" == input.charAt(i)
			) {
				i++;
			}
			let length = i - startIndex;
			let identifier = new Lexeme(LexemeType.Identifier, startIndex, length);
			lexemeList.push(identifier);
		} else if (isDigit(input.charAt(i))) { // number check
			let startIndex = i;
			while (i < inputLength && isDigit(input.charAt(i))) {
				i++;
			}
			let length = i - startIndex;
			let digitsOnly = new Lexeme(LexemeType.Number, startIndex, length);
			lexemeList.push(digitsOnly);
		} else if (" " == input.charAt(i)) { // skip whitespaces
			//simply skip whitespaces
			while (i < inputLength && (" " == input.charAt(i))) {
				i++;
			}
		} else { // all unknowns symbols are thrown as unknown lexeme types
			let unknown = new Lexeme(LexemeType.Unknown, i, 1);
			lexemeList.push(unknown);
			i++;
		}
	}

	//at the very end, append the EOF symbol
	lexemeList.push(new Lexeme(LexemeType.EOF, input.length, 0));
	return lexemeList;
}

function isAlpha(str: string): boolean {
	return /^[a-zA-Z]+$/.test(str);
}

function isDigit(str: string): boolean {
	return /^\d+$/.test(str);
}

function litrealMarkFor(str: string): LiteralMark {
	let char = str.charAt(0);
	if (char == '`') {
		return LiteralMark.Backtick
	} else if (char == "'") {
		return LiteralMark.SingleQuote;
	} else if (char == '"') {
		return LiteralMark.DoubleQuote;
	} else {
		return LiteralMark.None;
	}
}

enum LiteralMark {
	None = 1,
	Backtick,
	SingleQuote,
	DoubleQuote
}

