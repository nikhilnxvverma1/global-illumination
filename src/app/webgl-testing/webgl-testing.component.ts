import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Renderer } from '../../graphics/renderer';
import { WebGLRenderer } from '../../graphics/webgl-renderer';
import { Engine } from '../../graphics/engine';
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
	private renderer:Renderer;
	
	constructor() { }

	ngOnInit() {	
	
		//get canvas SO THAT we can create a pixel grid 
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;

		//set a webgl based renderer
		this.renderer=new WebGLRenderer(canvas.getContext('webgl'));

		//draw
		this.renderer.draw();
	}
}
