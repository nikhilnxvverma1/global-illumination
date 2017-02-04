//Vertex Shader
var vertexShader=`
	attribute vec4 position;
	void main(){
		gl_Position=position;
	}
`;

//Fragment Shader
var fragmentShader=`
	void main(){
		gl_FragColor=vec4(0.4,0.3,0.8,1);
	}
`;

function createShader(gl,shaderType,sourceCode){
	var shaderId=gl.createShader(shaderType);
	gl.shaderSource(shaderId,sourceCode);
	gl.compileShader(shaderId);
	var compileStatus=gl.getShaderParameter(shaderId,gl.COMPILE_STATUS);
	if(compileStatus){
		return shaderId;
	}else{
		console.error(gl.getShaderInfoLog(shaderId));
		gl.deleteShader(shaderId);
		return null;//something went wrong
	}
}

function createProgram(GL,shaderList){
	//create a program and attach all shaders to this program
	var program=GL.createProgram();
	for(var i=0;i<shaderList.length;i++){
		GL.attachShader(program,shaderList[i]);
	}

	GL.linkProgram(program);
	if(GL.getProgramParameter(program,GL.LINK_STATUS)){
		return program;
	}else{
		console.error(GL.getProgramInfoLog(program));
		GL.deleteProgram(program);
	}
}

function main(){

	//get the canvas in the page to get the GL context from it
	var canvas=document.getElementById('canvas');
	var GL=canvas.getContext('webgl');
	if(!GL){
		console.error("webgl not available");
		return;
	}

	//create the two shaders and put them in a program
	var vertexShaderId=createShader(GL,GL.VERTEX_SHADER,vertexShader);
	var fragmentShaderId=createShader(GL,GL.FRAGMENT_SHADER,fragmentShader);

	//put these two shaders in a list and create a program
	var program=createProgram(GL,[vertexShaderId,fragmentShaderId]);

	//get the location to the position attribute defined in the vertex shader
	var positionLocation=GL.getAttribLocation(program,"position");

	//create and bind a new buffer, and use the models to set positional attributes to it.
	var positionBuffer=GL.createBuffer();
	GL.bindBuffer(GL.ARRAY_BUFFER,positionBuffer);


	//------Rendering------
	GL.viewport(0,0,GL.canvas.width,GL.canvas.height);

	//clear to a black color
	GL.clearColor(0,0,0,0);
	GL.clear(GL.COLOR_BUFFER_BIT);

	//use the shader program we setup earlier, 
	GL.useProgram(program);

	//enable array for position attribute of vertex shader
	GL.enableVertexAttribArray(positionLocation);

	//to send data to the position attribute, we must first bind to that attribute's location
	GL.bindBuffer(GL.ARRAY_BUFFER,positionBuffer);

	//set buffer data based on the models
	var points=[
		0,0,
		0,0.6,
		0.9,0
	]
	GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(points),GL.STATIC_DRAW);
	GL.vertexAttribPointer(positionLocation,2,GL.FLOAT,false,0,0);

	//draw the triangles as set by the position buffers
	GL.drawArrays(GL.TRIANGLES,0,3);

}

//execute the main program
main();