import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Renderer } from '../../graphics/renderer';
import { PixelGridRenderer } from '../../graphics/pixel-grid-renderer';
import { Engine } from '../../graphics/engine';
import { PixelGrid } from '../../graphics/models/pixel-grid';
import { Color } from '../../graphics/models/color';
import { Camera } from '../../graphics/models/camera';
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
		
		pixelGridRenderer.pixelGrid=new RayTracerDriver(500,500).computePixelGrid([],new Camera());

		this.renderer=pixelGridRenderer;
		this.renderer.draw();
	}

}
