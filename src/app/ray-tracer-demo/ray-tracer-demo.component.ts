import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Engine } from '../../graphics/engine';
@Component({
  selector: 'app-ray-tracer-demo',
  templateUrl: './ray-tracer-demo.component.html',
  styleUrls: ['./ray-tracer-demo.component.scss']
})
export class RayTracerDemoComponent implements OnInit {

	@ViewChild('myCanvas') canvasElement:ElementRef;
	private engine:Engine;

	constructor() { }

	ngOnInit() {
		let canvas=<HTMLCanvasElement>this.canvasElement.nativeElement;
		this.engine=new Engine(canvas.getContext('webgl'));
		this.engine.draw();
	}

}
