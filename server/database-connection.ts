import orientjs= require('orientjs');
import winston=require('winston');
import Promise=require('bluebird');

export class DatabaseOptions{
	host:string;
	port:number;
	dbType:string;
	dbStorage:string;
	username:string;
	password:string;
	name:string;
}

const defaultOptions=new DatabaseOptions();
defaultOptions.host="localhost";
defaultOptions.port=2424;
defaultOptions.dbType="graph";
defaultOptions.dbStorage="plocal";
defaultOptions.username="root";
defaultOptions.password="root";
defaultOptions.name="sanity";

function fillBlankEntriesWithDefaults(option: DatabaseOptions): DatabaseOptions {
	option.host = option.host || defaultOptions.host;
	option.port = option.port || defaultOptions.port;
	option.dbType = option.dbType || defaultOptions.dbType;
	option.dbStorage = option.dbStorage || defaultOptions.dbStorage;
	option.username = option.username || defaultOptions.username;
	option.password = option.password || defaultOptions.password;
	option.name = option.name || defaultOptions.name;
	return option;
}

/**
 *  Connects to database instance with the specified options
 *  Creates a database if one for that name doesn't already exist. 
 */
export function connectToDatabase(option:any):Promise<orientjs.Db>{
	fillBlankEntriesWithDefaults(option);

	//connect to the database server
	var serverConfig = {
		host: option.host,
		port: option.port,
		username:option.username,
		password:option.password
	};
	let databaseServer = orientjs(serverConfig);

	return searchForDatabaseOrCreateOneIfNeeded(databaseServer,option);
}

function searchForDatabaseOrCreateOneIfNeeded(server:orientjs.Server,option:DatabaseOptions):Promise<orientjs.Db>{
	//find the database on server
	return server.list().
	then((dbs:orientjs.Db[])=>{
		winston.log('info',"Searching database '"+(option.name)+"' amongst "+dbs.length+" databases on server");
		var foundDatabase=false;
		for(let db of dbs){
			//check if database exists
			if(db.name==option.name){
				winston.log('info','Connecting to existing database: ' + db.name);
				//initializes and use the db
				let databaseInitialized=server.use({name:option.name,username:option.username,password:option.password});
				return databaseInitialized.open();//opens and returns a databse promise
			}
		}

		//if said database doesn't exist, create a new one
		winston.log('info','Did not find database \''+(option.name)+'\' on server, creating a new one ');
		return server.create({
			name:    option.name,
			type:    option.dbType,
			storage: option.dbStorage
		});
	});
}
