import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Renderer } from '../../graphics/renderer';
import { PixelGridRenderer } from '../../graphics/pixel-grid-renderer';
import { Engine } from '../../graphics/engine';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { Color } from '../../graphics/models/color';
import { Camera } from '../../graphics/models/camera';
import { Sphere } from '../../graphics/models/sphere';
import { Point } from '../../graphics/models/point';
import { Geometry } from '../../graphics/models/geometry';
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

	ngOnInit() {
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;
		// this.renderer=new Engine(canvas.getContext('webgl'));
		
		let pixelGridRenderer=new PixelGridRenderer(canvas.getContext('2d'));
		
		let camera=new Camera();
		camera.near=10;
		camera.far=50;
		camera.left=-10;
		camera.right=10;
		camera.top=10;
		camera.bottom=-10;

		let sphere1=new Sphere(10);
		sphere1.position=new Point(5,0,-30);
		sphere1.color=new Color().set("#542312");

		let sphere2=new Sphere(10);
		sphere2.position=new Point(-5,-5,-35);
		sphere2.color=new Color().set("#245214");

		let geometryList:Geometry[]=[];
		geometryList.push(sphere1);
		geometryList.push(sphere2);

		pixelGridRenderer.pixelGrid=new RayTracerDriver(500,500).computePixelGrid(geometryList,camera);

		this.renderer=pixelGridRenderer;
		this.renderer.draw();
	}

}
