var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
document.body.appendChild( renderer.domElement );

var material = new THREE.MeshBasicMaterial( { color: 0x23ff40 } );

var cube = new THREE.BoxGeometry( 5, 0.1, 5 );
var cube = new THREE.Mesh( cube, material );
scene.add( cube );

var sphere1 = new THREE.SphereGeometry( 1, 64, 64 );
var sphere1 = new THREE.Mesh( sphere1, material );
sphere1.position.set(1,1.5,-0.5);
scene.add( sphere1 );

var sphere2 = new THREE.SphereGeometry( 0.6, 64, 64 );
var sphere2 = new THREE.Mesh( sphere2, material );
sphere2.position.set(0,1,0);
scene.add( sphere2 );


camera.position.y = 1;
camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	// cube.rotation.x += 0.1;
	// cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};
render();