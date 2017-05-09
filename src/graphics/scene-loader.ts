import { GFCompiler } from '../graphful/compiler/graphful';
import { GFGraph } from '../graphful/graph';
import { GFNode } from '../graphful/node';
import { GFEdge } from '../graphful/edge';
import { GLScene } from './models/scene';
import { Camera } from './models/camera';
import { Color } from './models/color';
import { Light } from './models/light';
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
		let sceneNode=graph.getNodesOfType("GLScene");
		
		return null;
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

		return color;
	}

	private customVertexDrawableFrom(node:GFNode):CustomVertexDrawable{
		return null;
	}

	private lightFrom(node:GFNode):Light{
		return null;
	}

	private valueOf(attribute:string,node:GFNode,defaultValue?:any):any{
		let value=node.getAttributeValue(attribute);
		return value==null?defaultValue:value;
	}
}