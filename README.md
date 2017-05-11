WebGL based Graphics engine developed in typescript. Plus, certain programs of global illumination related excercises.
The graphics engine is a proof of concept of a rendering system that has a scene descriptor that is defined through a new data format language called graphful. 
Graphful is a graph based language with the intent to reduce data representation complexity while defining object graphs. Unlike XML, JSON or YAML, Graphful produces a graph and not a tree.Graphful is developed as a separate language but currently the core files are just copied over into this project(because of laziness) instead of being used as a dependency.
Note : There is very little angular 2 work happening mostly because the canvas needs to be handledd manually.

## Instructions
1. npm install
2. npm run build:client
3. npm run compile:server
4. npm start
5. npm watch:client

