import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Http,Headers,RequestOptions,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Renderer } from '../../graphics/renderer';
import { WebGLRenderer } from '../../graphics/webgl/webgl-renderer';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { Color } from '../../graphics/models/color';
import { Camera } from '../../graphics/models/camera';
import { Sphere } from '../../graphics/models/sphere';
import { Point } from '../../graphics/models/point';
import { Vector } from '../../graphics/models/vector';
import { Geometry } from '../../graphics/models/geometry';
import { RectQuad } from '../../graphics/models/rect-quad';
import { GLScene } from '../../graphics/models/scene';
import { Light } from '../../graphics/models/light';
import { GLDrawable } from '../../graphics/webgl/gl-drawable';
import { CustomVertexDrawable } from '../../graphics/webgl/custom-vertex-drawable';
import { RotateDrawable } from '../../graphics/animation/rotate-drawable';
import { ScaleDrawable } from '../../graphics/animation/scale-drawable';
import { TranslateDrawable } from '../../graphics/animation/translate-drawable';
import { Linear } from '../../graphics/animation/interpolation-curve';
import { OrbitalRevolution } from '../../graphics/animation/orbital-revolution';
import { SceneLoader } from '../../graphics/scene-loader';

@Component({
  selector: 'app-webgl-testing',
  templateUrl: './webgl-testing.component.html',
  styleUrls: ['./webgl-testing.component.scss']
})
export class WebglTestingComponent implements OnInit {

	@ViewChild('myCanvas') canvasElement:ElementRef;
	private renderer:WebGLRenderer;

	private graphful=`
	scene<GLScene>{
		camera=(camera),
		drawableList=[(sphere),(cylinder),(cube)],
		lightList=[(light1)],
		ambientLight=(ambientLight)
	};

	camera<Camera>{
		origin_z=5,
		origin_y=3,
		near=1,
		far=100,
		left=-10,
		right=10,
		top=10,
		bottom=-10,
	};

	ambientLight<Color>{
		r=200,
		g=200,
		b=200,
		a=255
	};

	light1<Light>{
		position_x=0,
		position_y=2,
		position_z=5,
		initWith="#FFFF36"
	};

	cylinder<CustomVertexDrawable>{
		shape="cylinder",
		args=[7,5]
	};

	cube<CustomVertexDrawable>{
		shape="cube",
		translation_x=-15,
		args=[3]
	};

	sphere<CustomVertexDrawable>{
		shape="sphere",
		translation_x=16,
		args=[4]
	};
	`
	
	constructor(
		private http:Http
	) { }

	ngOnInit() {
		this.initializeRenderer();
	}

	private initializeRenderer() { //=4 units
	
		//get canvas SO THAT we can create a pixel grid 
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;

		//set the world on the webgl world
		// let scene=this.makeSimpleScene();
		let scene=new SceneLoader().compile(this.graphful);

		//set a webgl based renderer
		this.renderer=new WebGLRenderer(canvas.getContext('webgl'),scene);


		//draw
		this.renderer.draw();
	}

	private makeSimpleScene():GLScene{//=3 units

		//scene
		let scene=new GLScene();
		scene.camera=this.makeDefaultCamera();

		//make a light and supply that as well
		let light1=new Light(new Point(0,2,5));
		light1.color.set("#FFFF36");
		scene.lightList.push(light1);

		let light2=new Light(new Point(15,10,-2));
		light2.color.set("#DE72A4");

		this.simplePopulation(scene);

		return scene;
	}

	private makeDummyWorld():GLScene{ //=6 units
		
		let scene=new GLScene();
		scene.camera=this.makeDefaultCamera();

		let light1=new Light(new Point(5,20,-5));
		light1.color.set("#FFFF36");
		scene.lightList.push(light1);

		return scene;
	}

	makeDefaultCamera():Camera{//1 units
		//camera
		let camera=new Camera();
		camera.origin.z=5;
		camera.origin.y=3;
		// camera.lookAt.y=-1;
		// camera.up=new Vector(0,0,-1);
		camera.near=1;
		camera.far=100;
		camera.left=-10;
		camera.right=10;
		camera.top=10;
		camera.bottom=-10;
		return camera;
	}

	private simplePopulation(scene:GLScene){
		// let geometry=new CustomVertexDrawable().cube(3);
		let cylinder=new CustomVertexDrawable().cylinder(7,5);
		let cube=new CustomVertexDrawable().cube(3);
		cube.translation.x=-15;
		let sphere=new CustomVertexDrawable().sphere(4);
		sphere.translation.x=16;
	
		scene.drawableList.push(cylinder);
		scene.drawableList.push(cube);
		scene.drawableList.push(sphere);

		// let animationEffect=new RotateDrawable(cylinder,360,5000);
		// animationEffect.interpolation=new Linear();
		// animationEffect.yoyo=false;
		// animationEffect.alongZ=false;
		// animationEffect.alongY=false;
		// animationEffect.alongX=true;
		// this.behaviors.push(animationEffect);

		const revolveCamera=new OrbitalRevolution(scene.camera);
		// scene.behaviourList.push(revolveCamera);
	}

	reloadScene(){
		let newScene = new SceneLoader().compile(this.graphful);
		this.renderer.loadNewScene(newScene);
	}

}
