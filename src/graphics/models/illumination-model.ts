import { IntersectionData } from './intersection-data';
import { Color } from './color';
import { World } from './world';
import { Geometry } from './geometry';

export interface IlluminationModel{
	illuminate(world:World,intersectionData:IntersectionData):Color;
}