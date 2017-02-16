import {ServerApp} from './server-app'
import { connectToDatabase,DatabaseOptions } from './database-connection';
import { SchemaBackend } from './schema.backend';
import ojs= require('orientjs');
import winston=require('winston');

winston.level='debug';

winston.info("Initializing Server");

let iWantToUseADatabase=false;

if(iWantToUseADatabase){//configure and setup OrientDB database before launching the server
	let databaseOptions=new DatabaseOptions();//<--there are a total of 7 properties
	databaseOptions.username="root";
	databaseOptions.password="root";
	databaseOptions.name="sanity";
	//change or add more properties as needed

	connectToDatabase(databaseOptions).
	//uncomment this part if you want to destroy and recreate the entire database schema from scratch
	// then((db:ojs.Db)=>{
	// 	winston.info("Databse connection established, destroying schema setup");
	// 	return new SchemaBackend(db).dropDatabaseSchema().then((v:any)=>{
	// 		return db;
	// 	});
	// }).
	then((db:ojs.Db)=>{
		winston.info("Databse connection established, ensuring schema setup");
		return new SchemaBackend(db).ensureDatabaseSchema().then((v:any)=>{
			winston.info("Schema ready");
			return db;
		});
	}).then((db:ojs.Db)=>{
		winston.info("Firing up server");
		let server=new ServerApp(db);
		server.setRoutes();
		server.start();
	}).catch((error:Error)=>{
		winston.error("Problems occured during server initialization:"+error.message);
	});
}else{
	//start the server (the db field of the server will be empty)
	winston.info("Starting server without a database");
	let server=new ServerApp();
	server.setRoutes();
	server.start();
}
