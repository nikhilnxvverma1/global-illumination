//Vertex Shader
let simpleVertexShader=`
	attribute vec4 position;
	void main(){
		gl_Position=position;
	}
`;

//Fragment Shader
let simpleFragmentShader=`
	void main(){
		gl_FragColor=vec4(0.4,0.3,0.8,1);
	}
`;

//Fragment Shader
let colorFragmentShader=`
	attribute vec4 vColor;
	void main(){
		gl_FragColor=vec4(vColor.r,vColor.g,vColor.b,vColor.a);
	}
`;


export class Engine{
	
	constructor(
		private GL:WebGLRenderingContext
	){}

	private createShader(shaderType,sourceCode){
		let shaderId=this.GL.createShader(shaderType);
		this.GL.shaderSource(shaderId,sourceCode);
		this.GL.compileShader(shaderId);
		let compileStatus=this.GL.getShaderParameter(shaderId,this.GL.COMPILE_STATUS);
		if(compileStatus){
			return shaderId;
		}else{
			console.error(this.GL.getShaderInfoLog(shaderId));
			this.GL.deleteShader(shaderId);
			return null;//something went wrong
		}
	}

	private createProgram(shaderList){
		//create a program and attach all shaders to this program
		let program=this.GL.createProgram();
		for(let i=0;i<shaderList.length;i++){
			this.GL.attachShader(program,shaderList[i]);
		}

		this.GL.linkProgram(program);
		if(this.GL.getProgramParameter(program,this.GL.LINK_STATUS)){
			return program;
		}else{
			console.error(this.GL.getProgramInfoLog(program));
			this.GL.deleteProgram(program);
		}
	}

	draw(){

		if(!this.GL){
			console.error("webgl not available");
			return;
		}

		//create the two shaders and put them in a program
		let vertexShaderId=this.createShader(this.GL.VERTEX_SHADER,simpleVertexShader);
		let fragmentShaderId=this.createShader(this.GL.FRAGMENT_SHADER,simpleFragmentShader);

		//put these two shaders in a list and create a program
		let program=this.createProgram([vertexShaderId,fragmentShaderId]);

		//get the location to the position attribute defined in the vertex shader
		let positionLocation=this.GL.getAttribLocation(program,"position");

		//create and bind a new buffer, and use the models to set positional attributes to it.
		let positionBuffer=this.GL.createBuffer();
		this.GL.bindBuffer(this.GL.ARRAY_BUFFER,positionBuffer);


		//------Rendering------
		this.GL.viewport(0,0,this.GL.canvas.width,this.GL.canvas.height);

		//clear to a black color
		this.GL.clearColor(0,0,0,0);
		this.GL.clear(this.GL.COLOR_BUFFER_BIT);

		//use the shader program we setup earlier, 
		this.GL.useProgram(program);

		//enable array for position attribute of vertex shader
		this.GL.enableVertexAttribArray(positionLocation);

		//to send data to the position attribute, we must first bind to that attribute's location
		this.GL.bindBuffer(this.GL.ARRAY_BUFFER,positionBuffer);

		//set buffer data based on the models
		let points=[
			0,0,0,
			0,0.6,0,
			0.9,0,0
		]
		this.GL.bufferData(this.GL.ARRAY_BUFFER,new Float32Array(points),this.GL.STATIC_DRAW);
		this.GL.vertexAttribPointer(positionLocation,3,this.GL.FLOAT,false,0,0);

		//draw the triangles as set by the position buffers
		this.GL.drawArrays(this.GL.TRIANGLES,0,3);

	}
}