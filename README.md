# Angular 2 - Express in Typescript (with OrientDB if needed)

This is a seed project for anyone looking for a nice and quick Angular 2 - Express setup in typescript. Optionally, you can also use [OrientDB](http://orientdb.com/orientdb/), a nice graph database, 
at the backend for storage.

## Libraries and Frameworks incorporated:
1. Angular2 
2. Express
3. OrientJS
4. Bluebird Promises
5. Winston
6. Angular CLI
7. Gulp

Additionally, there is also a handy _.vscode/launch.json_ file that makes it much easier to launch and debug server code inside VS Code.
## Instructions
1. npm install
2. *Optional: Make sure [OrientDB server is installed and running](http://orientdb.com/docs/2.1/Tutorial-Run-the-server.html)
3. npm run build:client
4. npm run compile:server
5. npm start
6. npm watch:client

*Want to use the database? Go to *server/server.ts* and set the flag called _iWantToUseADatabase_. By default, it will most likely will be false.

`let iWantToUseADatabase=true;`

## I cant connect to the database

Go to server/index.ts. You will have to define the address and port for OrientDB server along with other necessary credentials.

## How do I create my schema?

Go to *server/schema.backend.ts*. There you will find succinct methods for defining serveral classes (a.k.a tables) and their attributes.
 By default, there are already two example classes defined: User and Location, but you can drop the entire schema using methods defined 
in that class and create a new schema from scratch.

## What happens when I make changes to the schema
The schema is ensured at the start of the server in server/index.ts. Anytime you add a new class in schema, its going to automatically
 pick that up at server restart. You can also consider dropping entire schema and build everything from scratch. Keep in mind, that if you change the attributes
 of a class, you are going to have to drop that class manually from the backend to register that change. In any case, you should feel free to 
 tweak _schema.backend_ to your own custom needs. 