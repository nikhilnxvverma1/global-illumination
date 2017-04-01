import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Renderer } from '../../graphics/renderer';
import { PixelGridRenderer } from '../../graphics/pixel-grid-renderer';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { Color } from '../../graphics/models/color';
import { Camera } from '../../graphics/models/camera';
import { Sphere } from '../../graphics/models/sphere';
import { Point } from '../../graphics/models/point';
import { Vector } from '../../graphics/models/vector';
import { Geometry } from '../../graphics/models/geometry';
import { RectQuad } from '../../graphics/models/rect-quad';
import { RayTracerDriver } from './ray-tracer-driver';

@Component({
  selector: 'app-ray-tracer-demo',
  templateUrl: './ray-tracer-demo.component.html',
  styleUrls: ['./ray-tracer-demo.component.scss']
})
export class RayTracerDemoComponent implements OnInit {

	@ViewChild('myCanvas') canvasElement:ElementRef;
	private renderer:Renderer;

	constructor() { }

	ngOnInit() {	// 7 units
	
		//upper first sphere setup
		let sphere1=new Sphere(10);
		sphere1.position=new Point(5,0,-30);
		sphere1.color=new Color().set("#542312");

		//lower green sphere
		let sphere2=new Sphere(10);
		sphere2.position=new Point(-5,-5,-35);
		sphere2.color=new Color().set("#245214");

		//dark blue plane
		let plane=new RectQuad();
		plane.position=new Point(0,-8,-40);
		plane.normal=new Vector(0,1,0);
		plane.color=new Color().set("#141574");
		plane.width=90;
		plane.height=90;

		//PUT geometries in a list to show
		let geometryList:Geometry[]=[];
		geometryList.push(sphere1);
		geometryList.push(sphere2);
		geometryList.push(plane);

		//camera 
		let camera=new Camera();
		camera.near=10;
		camera.far=50;
		camera.left=-10;
		camera.right=10;
		camera.top=10;
		camera.bottom=-10;

		//MAKE pixel grid using canvas
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;
		// this.renderer=new Engine(canvas.getContext('webgl'));
		
		let pixelGridRenderer=new PixelGridRenderer(canvas.getContext('2d'));

		//RENDER using a pixel grid that will be COMPUTED by the RAY TRACER framework
		pixelGridRenderer.pixelGrid=new RayTracerDriver(500,500).computePixelGrid(geometryList,camera);

		this.renderer=pixelGridRenderer;
		this.renderer.draw();
	}

}
