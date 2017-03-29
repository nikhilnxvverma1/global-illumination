import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Renderer } from '../../graphics/renderer';
import { PixelGridRenderer } from '../../graphics/pixel-grid-renderer';
import { Engine } from '../../graphics/engine';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { Color } from '../../graphics/models/color';
import { Camera } from '../../graphics/models/camera';
import { Sphere } from '../../graphics/models/sphere';
import { Point } from '../../graphics/models/point';
import { Vector } from '../../graphics/models/vector';
import { Geometry } from '../../graphics/models/geometry';
import { RectQuad } from '../../graphics/models/rect-quad';
import { ProceduralTextureDriver } from './procedural-texture-driver';
import { World } from '../../graphics/models/world';
import { Light } from '../../graphics/models/light';
import { CheckerBoxStrategy } from '../../graphics/color-picking-strategy';

@Component({
  selector: 'app-procedural-texturing',
  templateUrl: './procedural-texturing.component.html',
  styleUrls: ['./procedural-texturing.component.scss']
})
export class ProceduralTexturingComponent implements OnInit {

	@ViewChild('myCanvas') canvasElement:ElementRef;
	private renderer:Renderer;
	
	constructor() { }

	ngOnInit() {	// 7 units
	
		
		//camera
		let camera=new Camera();
		camera.near=10;
		camera.far=50;
		camera.left=-10;
		camera.right=10;
		camera.top=10;
		camera.bottom=-10;

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
		plane.colorPickingStrategy=new CheckerBoxStrategy(plane);

		//put all these in a list
		let geometryList:Geometry[]=[];
		geometryList.push(sphere1);
		geometryList.push(sphere2);
		geometryList.push(plane);

		//MAKE world and SUPPLY list and camera
		let world=new World();
		world.geometryList=geometryList;
		world.camera=camera;

		//MAKE a light and SUPPLY that as well
		let light1=new Light(new Point(5,20,-5));
		world.lightList.push(light1);

		// let light2=new Light(new Point(-5,15,-5));
		// world.lightList.push(light2);

		//get canvas SO THAT we can create a pixel grid 
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;
		// this.renderer=new Engine(canvas.getContext('webgl'));
		
		let pixelGridRenderer=new PixelGridRenderer(canvas.getContext('2d'));
		
		// USE driver TO GET pixel grid
		pixelGridRenderer.pixelGrid=new ProceduralTextureDriver(500,500).computePixelGrid(world);

		//draw
		this.renderer=pixelGridRenderer;
		this.renderer.draw();
	}
}
