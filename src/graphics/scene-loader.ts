import { GFCompiler } from '../graphful/compiler/graphful';
import { GFGraph } from '../graphful/graph';
import { GFNode } from '../graphful/node';
import { GFEdge } from '../graphful/edge';
import { GLScene } from './models/scene';
import { Camera } from './models/camera';
import { Color } from './models/color';
import { Light } from './models/light';
import { Point } from './models/point';
import { CustomVertexDrawable } from './webgl/custom-vertex-drawable';

/** Loads the scene description language and outputs a GLScene */
export class SceneLoader{

	/**Compiles scene description code which exists in graphful syntax into actual GLScene */
	compile(sceneDescriptionCode:string):GLScene{
		let compiler=new GFCompiler(sceneDescriptionCode);
		let syntaxPassed=compiler.compile();
		if(!syntaxPassed){
			return null;
		}

		return this.loadSceneFromGraph(compiler.graph);
	}

	private loadSceneFromGraph(graph:GFGraph):GLScene{
		let scene=new GLScene;
		
		//find the (first)scene node in graph
		let allSceneNodes=graph.getNodesOfType("GLScene");
		let sceneNode=allSceneNodes[0];

		//find all connected nodes to that scene node
		let cameraNode=sceneNode.getAttributeValue("camera");
		let ambientLightNode=sceneNode.getAttributeValue("ambientLight");
		let drawableListNode=sceneNode.getAttributeValue("drawableList");
		let lightListNode=sceneNode.getAttributeValue("lightList");

		//build the scene using these nodes
		scene.camera=this.cameraFrom(cameraNode);
		scene.ambientLight=this.colorFrom(ambientLightNode);

		forEachIn(drawableListNode,(element:GFNode,index:number)=>{
			let drawable=this.customVertexDrawableFrom(element);
			scene.drawableList.push(drawable);
		});

		forEachIn(lightListNode,(element:GFNode,index:number)=>{
			let light=this.lightFrom(element);
			scene.lightList.push(light);
		});

		return scene;
	}

	private cameraFrom(node:GFNode):Camera{
		let camera=new Camera();

		camera.origin.x=this.valueOf("origin_x",node,camera.origin.x);
		camera.origin.y=this.valueOf("origin_y",node,camera.origin.y);
		camera.origin.z=this.valueOf("origin_z",node,camera.origin.z);

		camera.lookAt.x=this.valueOf("lookAt_x",node,camera.lookAt.x);
		camera.lookAt.y=this.valueOf("lookAt_y",node,camera.lookAt.y);
		camera.lookAt.z=this.valueOf("lookAt_z",node,camera.lookAt.z);

		camera.up.x=this.valueOf("up_x",node,camera.up.x);
		camera.up.y=this.valueOf("up_y",node,camera.up.y);
		camera.up.z=this.valueOf("up_z",node,camera.up.z);

		camera.near=this.valueOf("near",node,camera.near);
		camera.far=this.valueOf("far",node,camera.far);
		camera.left=this.valueOf("left",node,camera.left);
		camera.right=this.valueOf("right",node,camera.right);
		camera.top=this.valueOf("top",node,camera.top);
		camera.bottom=this.valueOf("bottom",node,camera.bottom);

		return camera;
	}

	private colorFrom(node:GFNode):Color{
		let color=new Color();

		color.r=this.valueOf("r",node,color.r);
		color.g=this.valueOf("g",node,color.g);
		color.b=this.valueOf("b",node,color.b);
		color.a=this.valueOf("a",node,color.a);

		let hexCode=this.valueOf("initWith",node);
		if(hexCode!=null){
			color.set(hexCode);
		}

		return color;
	}

	private customVertexDrawableFrom(node:GFNode):CustomVertexDrawable{

		let drawable=new CustomVertexDrawable();

		drawable.scale.x=this.valueOf("scale_x",node,drawable.scale.x);
		drawable.scale.y=this.valueOf("scale_y",node,drawable.scale.y);
		drawable.scale.z=this.valueOf("scale_z",node,drawable.scale.z);

		drawable.rotation.x=this.valueOf("rotation_x",node,drawable.rotation.x);
		drawable.rotation.y=this.valueOf("rotation_y",node,drawable.rotation.y);
		drawable.rotation.z=this.valueOf("rotation_z",node,drawable.rotation.z);

		drawable.translation.x=this.valueOf("translation_x",node,drawable.translation.x);
		drawable.translation.y=this.valueOf("translation_y",node,drawable.translation.y);
		drawable.translation.z=this.valueOf("translation_z",node,drawable.translation.z);


		//look for argument array
		let args=node.getAttributeValue("args");
		let argValues=[];
		if(args!=null){
			let argsNode=<GFNode>args;
			let length=argsNode.edgeList.length;
			for(let i=0;i<length;i++){
				let value=argsNode.getAttributeValue(""+i);
				argValues.push(parseInt(value));
			}
		}

		let choiceOfShape=this.valueOf("shape",node);
		switch(choiceOfShape){
			case "cylinder":
				if(argValues.length>1){
					drawable.cylinder(argValues[0],argValues[1]);
				}else if(argValues.length>0){
					drawable.cylinder(argValues[0]);
				}else{
					drawable.cylinder();
				}
				break;
			case "cube":
				if(argValues.length>0){
					drawable.cube(argValues[0]);
				}else{
					drawable.cube();
				}
				break;
			case "sphere":
				if(argValues.length>0){
					drawable.sphere(argValues[0]);
				}else{
					drawable.sphere();
				}
				break;
			case "cone":
				if(argValues.length>1){
					drawable.cone(argValues[0],argValues[1]);
				}else if(argValues.length>0){
					drawable.cone(argValues[0]);
				}else{
					drawable.cone();
				}
				break;
			case "plane":
				if(argValues.length>1){
					drawable.plane(argValues[0],argValues[1]);
				}else if(argValues.length>0){
					drawable.plane(argValues[0]);
				}else{
					drawable.plane();
				}
				break;
			case "circle":
				if(argValues.length>0){
					drawable.circle(argValues[0]);
				}else{
					drawable.circle();
				}
				break;
		}
		
		return drawable;
	}

	private lightFrom(node:GFNode):Light{
		let light = new Light(new Point(0,0,0));
		light.position.x=this.valueOf("position_x",node,light.position.x);
		light.position.y=this.valueOf("position_y",node,light.position.y);
		light.position.z=this.valueOf("position_z",node,light.position.z);

		light.color.r=this.valueOf("color_r",node,light.color.r);
		light.color.g=this.valueOf("color_g",node,light.color.g);
		light.color.b=this.valueOf("color_b",node,light.color.b);
		light.color.a=this.valueOf("color_a",node,light.color.a);

		return light;
	}

	private valueOf(attribute:string,node:GFNode,defaultValue?:any):any{
		let value=node.getAttributeValue(attribute);
		return value==null?defaultValue:value;
	}
}

/** Iterates across all the elements of a node to perform a given operation*/
function forEachIn(arrayNode:GFNode,operation:(element:GFNode,index:number)=>void){
	let i=0;
	for(let edge of arrayNode.edgeList){
		let outgoinNode=edge.node2;
		operation(outgoinNode,i++);
	}
}