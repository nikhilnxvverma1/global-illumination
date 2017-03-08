import { IntersectionData } from './intersection-data';
import { Color } from './color';
import { World } from './world';
import { Geometry } from './geometry';
import { Point } from './point';

export interface IlluminationModel{
	illuminate(point:Point,geometry:Geometry,world:World):Color;
}