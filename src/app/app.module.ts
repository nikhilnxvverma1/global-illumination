import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RayTracerDemoComponent } from './ray-tracer-demo/ray-tracer-demo.component';
import { BasicShadingComponent } from './basic-shading/basic-shading.component';
import { ProceduralTexturingComponent } from './procedural-texturing/procedural-texturing.component';
import { WebglTestingComponent } from './webgl-testing/webgl-testing.component';

@NgModule({
  declarations: [
    AppComponent,
    RayTracerDemoComponent,
    BasicShadingComponent,
    ProceduralTexturingComponent,
    WebglTestingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
