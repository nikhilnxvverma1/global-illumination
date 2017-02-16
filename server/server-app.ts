import express = require('express');
import http = require('http');
import https = require('https');
import path = require('path');
import orientjs = require('orientjs');
import winston = require('winston');
import bodyParser = require('body-parser');

export class ServerApp {
    
	private app: express.Application;
	private db:orientjs.Db;
    
	constructor(db?:orientjs.Db) {
		this.app = express();
		this.db=db;
	}
    
    public setRoutes() {        //the order matters here

		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({
			extended:false
		}));
		this.configureAPIRoutes();
		
		//static resources (is amongst the main folders in the root of the project)
		this.app.use('/', express.static(path.join(__dirname, '../', 'dist')));//for one level

		//all other routes are handled by angular
		this.app.get('/*', this._homePage);//this should be in the end
	}

	private configureAPIRoutes(){


	}

    public start() {//this method is called after setRoutes()

		//normalize ports by environment variables        
		let port=process.env.PORT_SANITY||3000;
		
		// http.createServer(express).listen(port);
		this.app.listen(port,()=>{
			winston.info("Server started on port "+port);
		})
	}

    private _homePage(req: express.Request, res: express.Response) {

		let pathToIndexPage:string;
		pathToIndexPage=path.join(__dirname,'../','dist/','index.html'); //amongst the main folders
		winston.log('info',"Server refreshed index file: "+pathToIndexPage);
        res.sendFile(pathToIndexPage);
    }
}

/**
 * Simple method that set the content header to be json. 
 * Returns the same response to allow chaining. 
 */
export function jsonHeader(response:express.Response):express.Response{
	response.setHeader('Content-Type', 'application/json');
	return response;
}

const production=process.env.NODE_ENV=='production';