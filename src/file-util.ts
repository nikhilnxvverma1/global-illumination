import * as Promise from 'bluebird';
import { readFile } from 'fs';
export interface AfterTextIsLoaded{
	(Error,string?):void;
}

export interface AfterImageIsLoaded{
	(Error,Image?):void;
}

export interface AfterJsonIsLoaded{
	(Error,json?:any):void;
}

export function loadTextResource(url:string):Promise<any>{

	return new Promise<any>((resolve,reject)=>{
		readFile(url,'UTF-8',function(error,data){
			console.log("before error");
			if(error){
				reject(error);
			}
			resolve(data);
		});
	});

}

export function loadImage(url:string,callback:AfterImageIsLoaded){
	let image=new Image();
	image.onload=()=>{
		callback(null,image);
	}
	image.src=url;
}

export function loadJsonData(url:string,callback:AfterJsonIsLoaded){
	loadTextResource(url).then((data:string)=>{
		try{
			callback(null,JSON.parse(data));
		}catch(exception){
			callback(exception);
		}
	});
}