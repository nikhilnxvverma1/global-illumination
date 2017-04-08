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
import { World } from '../../graphics/models/world';
import { Light } from '../../graphics/models/light';


@Component({
  selector: 'app-webgl-testing',
  templateUrl: './webgl-testing.component.html',
  styleUrls: ['./webgl-testing.component.scss']
})
export class WebglTestingComponent implements OnInit {

	@ViewChild('myCanvas') canvasElement:ElementRef;
	private renderer:WebGLRenderer;

	private clientBaseLocation:string;
	
	constructor(
		private http:Http
	) { }

	ngOnInit() {//=2 units
		this.initializeRenderer();
		//base location for dist build (TODO remove as it is unneeded)
		// this.retrieveBaseLocation().subscribe((baseLocation:string)=>{
		// 	this.clientBaseLocation=baseLocation;

		// 	//renderer setup
		// 	this.initializeRenderer();
		// });
	}

	private initializeRenderer() { //=4 units
	
		//get canvas SO THAT we can create a pixel grid 
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;

		//set a webgl based renderer
		this.renderer=new WebGLRenderer(canvas.getContext('webgl'),this.clientBaseLocation);

		//set the world on the webgl world
		this.renderer.world=this.makeSimpleWorld();

		//draw
		this.renderer.draw();
	}

	private makeSimpleWorld():World{//=3 units

		//quad
		let plane=new RectQuad();
		plane.position=new Point(0,-8,-40);
		plane.normal=new Vector(0,1,0);
		plane.color=new Color().set("#141574");
		plane.width=150;
		plane.height=150;

		//geometry list
		let geometryList:Geometry[]=[];
		geometryList.push(plane);

		//world
		let world=new World();
		world.geometryList=geometryList;
		world.camera=this.makeDefaultCamera();

		//MAKE a light and SUPPLY that as well
		let light1=new Light(new Point(0,2,5));
		light1.color.set("#FFFF36");
		world.lightList.push(light1);

		let light2=new Light(new Point(15,10,-2));
		light2.color.set("#DE72A4");
		// world.lightList.push(light2);


		return world;
	}

	private makeDummyWorld():World{ //=6 units

		//upper brown sphere
		let sphere1=new Sphere(10);
		sphere1.position=new Point(5,10,-35);
		sphere1.color=new Color().set("#542312");

		//lower green sphere 
		let sphere2=new Sphere(10);
		// sphere2.position=new Point(-5,-5,-65);
		sphere2.position=new Point(-5,-5,-40);
		sphere2.color=new Color().set("#245214");

		//bottom dark blue plane
		let plane=new RectQuad();
		plane.position=new Point(0,-8,-40);
		plane.normal=new Vector(0,1,0);
		plane.color=new Color().set("#141574");
		plane.width=150;
		plane.height=150;

		//put all these in a list
		let geometryList:Geometry[]=[];
		geometryList.push(sphere1);
		geometryList.push(sphere2);
		geometryList.push(plane);

		//MAKE world and SUPPLY list and camera
		let world=new World();
		world.geometryList=geometryList;
		world.camera=this.makeDefaultCamera();

		//MAKE a light and SUPPLY that as well
		let light1=new Light(new Point(5,20,-5));
		light1.color.set("#FFFF36");
		world.lightList.push(light1);

		return world;
	}

	makeDefaultCamera(){//1 units
		//camera
		let camera=new Camera();
		camera.near=0.1;
		camera.far=100;
		camera.left=-10;
		camera.right=10;
		camera.top=10;
		camera.bottom=-10;
		return camera;
	}

	retrieveBaseLocation():Observable<string>{//=1 unit
		return this.http.get("/api/dist-loc").map((response:Response)=>{return response.text()});
	}
}
