scene<GLScene>{
	camera=(camera),
	drawableList=[(cylinder),(cube),(sphere)],
	lightList=[(light1),(light2)],
	ambientLight=(ambientLight)
};

camera<Camera>{
	origin_z=5,
	origin_y=3,
	lookAt_y=-1,
	up_y=1,
	near=1,
	far=100,
	left=-10,
	right=10,
	top=10,
	bottom=-10,
};

ambientLight<Color>{
	r=200,
	g=200,
	b=200,
	a=255
};

light1<Light>{
	x=0,
	y=2,
	z=5,
	initWith="#FFFF36"
};

light2<Light>{
	x=15,
	y=0,
	z=-2,
	initWith="#DE72A4"
};

cylinder<CustomVertexDrawable>{
	shape="cylinder",
	args=[7,5]
};

cube<CustomVertexDrawable>{
	shape="cube",
	x=-15,
	args=[3]
};

sphere<CustomVertexDrawable>{
	shape="sphere",
	x=16,
	args=[4]
};