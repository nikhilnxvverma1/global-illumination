A successful graphics engine displays something. That’s obvious. But what’s not as obvious are the methodologies used in supplying content to the system. Essentially, when we are tasked with the setup of a scene we have a couple of options. The simplest one is to establish the data structure in code. So, if a scene consists of a ball resting on a plane, we simply hardcode this description in our application. Since this is inflexible, we externalize the scene configuration in a separate file more commonly referred to as the scene descriptor.

This project is a realization of the above concept. Its divided into two sub projects. The graphics engine and the scene descriptor. The interesting area of focus is the new language used to make the scene descriptor. This new language is called Graphful. The other aspect of this project is the graphics engine itself which was built using WebGL. The graphics engine is a proof of concept of a rendering system that has a scene descriptor that is defined through graphful. 

The language is used as a scene descriptor by making a graph comprising of nodes and edges that resemble an object graph. Unlike XML, JSON or YAML, Graphful produces a graph and not a tree. Graphful has been developed as a separate language but currently the core files are just tentatively copied over into this project(because of laziness) instead of being used as a dependency.

Additionally, coursework for ray tracer of global illumination course is also included here.

Note : There is very little angular 2 work happening mostly because the canvas needs to be handledd manually.

## Instructions
1. npm install
2. npm run build:client
3. npm run compile:server
4. npm start
5. npm watch:client

