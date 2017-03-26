export interface AfterTextIsLoaded{
	(Error,string?):void;
}

export interface AfterImageIsLoaded{
	(Error,Image?):void;
}

export interface AfterJsonIsLoaded{
	(Error,json?:any):void;
}

export function loadTextResource(url:string,callback:AfterTextIsLoaded){
	let request = new XMLHttpRequest();
	request.open('GET', url + '?nocache=' + Math.random(), true);
	request.onload = function () {
		if (request.status < 200 || request.status > 299) {
			callback('Response code ' + request.status + ' on resource ' + url);
		} else {
			callback(null, request.responseText);
		}
	};
	request.send();
}

export function loadImage(url:string,callback:AfterImageIsLoaded){
	let image=new Image();
	image.onload=()=>{
		callback(null,image);
	}
	image.src=url;
}

export function loadJsonData(url:string,callback:AfterJsonIsLoaded){
	loadTextResource(url,(error:Error,data:string)=>{
		if(error){
			callback(error);
		}else{
			try{
				callback(null,JSON.parse(data));
			}catch(exception){
				callback(exception);
			}
		}
	});
}