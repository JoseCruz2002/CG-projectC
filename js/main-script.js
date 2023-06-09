//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, camera;

var mesh, geometry;

var clock;
var controls;

var planeTexture, skydomeTexture;

// objects
var ovni, plane, moon, moonDirectionalLight, isDirectionalLightOn = false, corkTree, skydome;


const SCALE = 0.01;

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight() {
	'use strict';

	var light = new THREE.AmbientLight({ color: 0xffe000 }); // soft white light
	light.intensity = 0.2;
	scene.add(light);
}

//////////////////////////////////////
/* CREATE THE PLANE AND THE SKYDOME */
//////////////////////////////////////
function createPlane(x, y, z) {
	'use strict';

	plane = new THREE.Object3D();

	geometry = new THREE.PlaneGeometry(600*SCALE, 600*SCALE, 100, 100);

	var disMap = new THREE.TextureLoader().setPath("images/").load("heightmap.png");
	disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
	disMap.repeat.set(5, 2);

	var lambert_material = new THREE.MeshLambertMaterial({ color: 0x009900, displacementMap: disMap, displacementScale: 100*SCALE });
	var phong_material = new THREE.MeshPhongMaterial({ color: 0xffaa22, emissive: 0x242923, specular: 15, shininess: 5 });
	var toon_material = new THREE.MeshToonMaterial({ color: 0xffaa22});

	plane.userData = {
		materials: { lambert_material, phong_material, toon_material },
		apllyPlaneTexture: false
	}

	mesh = new THREE.Mesh(geometry, plane.userData.materials.lambert_material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.set(x, y, z);
	plane.add(mesh);

	scene.add(plane);

}

function createSkydome(x, y, z) {
	'use strict';

	skydome = new THREE.Object3D();

	var lambert_material = new THREE.MeshLambertMaterial({ color: 0x000099 });
	var phong_material = new THREE.MeshPhongMaterial({ color: 0xffaa22, emissive: 0x242923, specular: 15, shininess: 5 });
	var toon_material = new THREE.MeshToonMaterial({ color: 0xffaa22 });

	skydome.userData = {
		materials: { lambert_material, phong_material, toon_material },
		applySkydomeTexture: false
	}

	geometry = new THREE.SphereGeometry(250*SCALE, 32, 16, 0, Math.PI * 2, Math.PI, Math.PI);
	mesh = new THREE.Mesh(geometry, skydome.userData.materials.lambert_material);
	mesh.position.set(x, y, z);
	skydome.add(mesh);

	scene.add(skydome);

}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createOVNIbody(obj, x, y, z) {
	'use strict';

	var ud = obj.userData;

	geometry = new THREE.SphereGeometry();
	geometry.scale(ud.r_body, ud.h_body, ud.r_body);
	mesh = new THREE.Mesh(geometry, ud.materials_body.lambert_material_body);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createOVNIcockpit(obj, x, y, z) {
	'use strict';

	var ud = obj.userData;

	geometry = new THREE.SphereGeometry(ud.r_cockpit);
	mesh = new THREE.Mesh(geometry, ud.materials_cc.lambert_material_cc);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createOVNIcylinder(obj, x, y, z) {
	'use strict';

	var ud = obj.userData;

	geometry = new THREE.CylinderGeometry(ud.r_cylinder, ud.r_cylinder, ud.h_cylinder);
	mesh = new THREE.Mesh(geometry, ud.materials_cc.lambert_material_cc);
	mesh.position.set(x, y, z);
	mesh.add(ud.spotLight);
	obj.add(mesh);
}

function createOVNIlight(obj, x, y, z, light) {
	'use strict';

	var ud = obj.userData;

	geometry = new THREE.SphereGeometry(ud.r_light);
	mesh = new THREE.Mesh(geometry, ud.materials_light.lambert_material_light);
	mesh.add(ud.pointLights[light]);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createOVNI(x, y, z) {
	'use strict';

	ovni = new THREE.Object3D();

	var lambert_material_body = new THREE.MeshLambertMaterial({ color: 0x262725, emissive: 0x242923 });
	var lambert_material_cc = new THREE.MeshLambertMaterial({ color: 0x323857, emissive: 0x242923 }); /*cylinder and cockpit*/
	var lambert_material_light = new THREE.MeshLambertMaterial({ color: 0x610000, emissive: 0x242923 });
	var phong_material_body = new THREE.MeshPhongMaterial({ color: 0xffaa22, emissive: 0x242923, specular: 15, shininess: 5 });
	var phong_material_cc = new THREE.MeshPhongMaterial({ color: 0x323857, emissive: 0x242923, specular: 15, shininess: 5 });
	var phong_material_light = new THREE.MeshPhongMaterial({ color: 0x610000, emissive: 0x242923, specular: 15, shininess: 5 });
	var toon_material_body = new THREE.MeshToonMaterial({ color: 0xffaa22 });
	var toon_material_cc = new THREE.MeshToonMaterial({ color: 0x323857 });
	var toon_material_light = new THREE.MeshToonMaterial({ color: 0x610000 });

	var pointLight1 = new THREE.PointLight({ distance: 200*SCALE });
	var pointLight2 = new THREE.PointLight({ distance: 200*SCALE });
	var pointLight3 = new THREE.PointLight({ distance: 200*SCALE });
	var pointLight4 = new THREE.PointLight({ distance: 200*SCALE });

	ovni.userData = {
		materials_body: { lambert_material_body, phong_material_body, toon_material_body },
		materials_cc: { lambert_material_cc, phong_material_cc, toon_material_cc },
		materials_light: { lambert_material_light, phong_material_light, toon_material_light },
		r_body: 7*SCALE*3, h_body: 3*SCALE*3,
		r_cockpit: 2.5*SCALE*3,
		r_cylinder: 2*SCALE*3, h_cylinder: 1.5*SCALE*3,
		r_light: 1*SCALE*3,
		y_rotate: Math.PI / 2,
		move_plus_x: false, move_minus_x: false, move_plus_z: false, move_minus_z: false,
		velocity: 30*SCALE*3,
		pointLights: [pointLight1, pointLight2, pointLight3, pointLight4],
		pointLightsChange: false, pointLightsChanged: false,
		spotLight: new THREE.SpotLight({ color: 0x323857, intensity: 0.8, distance: 100*SCALE }), spotLightChange: false, spotLightChanged: false
	};

	scene.add(ovni.userData.spotLight.target);
	ovni.userData.spotLight.target.position.set(0, -10*SCALE, 0);
	ovni.userData.spotLight.castShadow = true;
	ovni.userData.spotLight.angle = Math.PI / 10;
	ovni.userData.spotLight.penumbra = 1.0;
	scene.add(ovni.userData.spotLight);

	for (let i = 0; i < ovni.userData.pointLights.length; i++) {
		ovni.userData.pointLights[i].intensity = 0.1;
		scene.add(ovni.userData.pointLights[i]);
	}

	createOVNIbody(ovni, 0, 0, 0);
	createOVNIcockpit(ovni, 0, ovni.userData.h_body, 0);
	createOVNIcylinder(ovni, 0, -ovni.userData.h_body, 0);
	createOVNIlight(ovni, 0, -ovni.userData.h_body / 1.6, ovni.userData.r_body / 1.5, 0);
	createOVNIlight(ovni, ovni.userData.r_body / 1.5, -ovni.userData.h_body / 1.6, 0, 1);
	createOVNIlight(ovni, 0, -ovni.userData.h_body / 1.6, -ovni.userData.r_body / 1.5, 2);
	createOVNIlight(ovni, -ovni.userData.r_body / 1.5, -ovni.userData.h_body / 1.6, 0, 3);

	ovni.position.set(x, y, z);
	scene.add(ovni);
}


function createMoonBody(obj, x, y, z) {
	'use strict';

	const moon_material = new THREE.MeshPhongMaterial({
		color: 0xffd45f, // Set the color to moon yellow
		emissive: 0xffd45f, // Set the emissive color to moon yellow
		emissiveIntensity: 0.5, // Increase the emissive intensity for brightness
	});


	geometry = new THREE.SphereGeometry(20*SCALE, 32, 32);
	mesh = new THREE.Mesh(geometry, moon_material);
	mesh.position.set(x, y, z);
	obj.add(mesh);

}

function toggleDirectionalLight() {
	isDirectionalLightOn = !isDirectionalLightOn;
	moonDirectionalLight.visible = isDirectionalLightOn;
}

function createMoonLight(obj, x, y, z) {
	'use strict';
	moonDirectionalLight = new THREE.DirectionalLight(0xffd45f, 1);
	moonDirectionalLight.visible = isDirectionalLightOn;
	moonDirectionalLight.position.set(x, y, z); // Set the position of the light source
	obj.add(moonDirectionalLight);

}

function createMoon(x, y, z) {
	'use strict';

	moon = new THREE.Object3D();

	createMoonBody(moon, x, y, z);
	createMoonLight(moon, 1, 1, 1);

	scene.add(moon);
}

function createBranchCanopy(obj, x, y, z) {
	'use strict';

	const darkGreenMaterial = new THREE.MeshBasicMaterial({
		color: 0x006400
	});


	geometry = new THREE.SphereGeometry(1.7*SCALE, 32, 16);
	geometry.scale(1.5, 0.5, 0.5);
	mesh = new THREE.Mesh(geometry, darkGreenMaterial);
	mesh.position.set(x + 3.7*SCALE, y + 7*SCALE, z);
	obj.add(mesh);
}


function createTreeCanopy(obj, x, y, z) {
	'use strict';

	const darkGreenMaterial = new THREE.MeshBasicMaterial({
		color: 0x006400
	});


	geometry = new THREE.SphereGeometry(1.7*SCALE, 32, 16);
	geometry.scale(2, 1.5, 2);
	mesh = new THREE.Mesh(geometry, darkGreenMaterial);
	mesh.position.set(x - 2*SCALE, y + 9*SCALE, z + 1.3*SCALE);
	obj.add(mesh);
}




function createTreebranch(obj, x, y, z) {
	'use strict';

	const brownishOrangeMaterial = new THREE.MeshBasicMaterial({
		color: 0xB99571
	});

	geometry = new THREE.CylinderGeometry(0.5*SCALE, 0.5*SCALE, 7*SCALE, 20);
	mesh = new THREE.Mesh(geometry, brownishOrangeMaterial);
	mesh.position.set(x + 1*SCALE, y + 2.5*SCALE, z - 1*SCALE);
	mesh.rotation.z = -Math.PI / 6;

	obj.add(mesh);
}

function createTreeTrunk(obj, x, y, z) {
	'use strict';

	const brownishOrangeMaterial = new THREE.MeshBasicMaterial({
		color: 0xB99571
	});

	geometry = new THREE.CylinderGeometry(1*SCALE, 1*SCALE, 12*SCALE, 20);
	mesh = new THREE.Mesh(geometry, brownishOrangeMaterial);
	mesh.position.set(x, y, z);
	mesh.rotation.z = Math.PI / 6;

	obj.add(mesh);
}


function createCorkTree(x, y, z) {
	'use strict';

	corkTree = new THREE.Object3D();

	createTreeTrunk(corkTree, x, y, z);
	createTreebranch(corkTree, x, y, z);
	createTreeCanopy(corkTree, x, y, z);
	createBranchCanopy(corkTree, x, y, z);

	scene.add(corkTree);
}



////////////
/* UPDATE */
////////////
function rotateOVNI(delta) {
	'use strict';

	ovni.rotation.y += ovni.userData.y_rotate * delta;

}

function moveOVNI(delta) {
	'use strict';

	var ud = ovni.userData;
	var z_motion = 0, x_motion = 0;

	if (ud.move_minus_z) {
		z_motion -= 1;
	}
	if (ud.move_plus_z) {
		z_motion += 1;
	}
	if (ud.move_minus_x) {
		x_motion -= 1;
	}
	if (ud.move_plus_x) {
		x_motion += 1;
	}
	if (z_motion != 0 || x_motion != 0) {
		const v = new THREE.Vector3(x_motion, 0, z_motion).normalize();
		ovni.position.x += v.x * ud.velocity * delta;
		ovni.position.z += v.z * ud.velocity * delta;
		ud.spotLight.target.position.x += v.x * ud.velocity * delta;
		ud.spotLight.target.position.z += v.z * ud.velocity * delta;
	}

}

function handleOVNILights() {
	'use strict';

	const ud = ovni.userData;

	if (ud.pointLightsChange && !ud.pointLightsChanged) {
		for (let i = 0; i < ud.pointLights.length; i++) {
			ud.pointLights[i].visible = !ud.pointLights[i].visible;
		}
		ud.pointLightsChanged = true;
	}
	if (!ud.pointLightsChange && ud.pointLightsChanged) {
		ud.pointLightsChanged = false;
	}

	if (ud.spotLightChange && !ud.spotLightChanged) {
		ud.spotLight.visible = !ud.spotLight.visible;
		ud.spotLightChanged = true;
	}
	if (!ud.spotLightChange && ud.spotLightChanged) {
		ud.spotLightChanged = false;
	}

}

function createPlaneTexture() {
	'use strict';

	const ud = plane.userData;

	if (ud.apllyPlaneTexture) {
		planeTexture = new THREE.TextureLoader().load("images/groundTexture.png");
		planeTexture.magFilter = THREE.NearestFilter;
		planeTexture.minFilter = THREE.NearestFilter;
		planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
		planeTexture.repeat.set(4, 4);

		ud.materials.lambert_material.map = planeTexture;
		ud.materials.lambert_material.color = 0x000000;
		ud.materials.lambert_material.needsUpdate = true;
		ud.apllyPlaneTexture = false;
	}
}

function createSkydomeTexture() {
	'use strict';

	const ud = skydome.userData;

	if (ud.applySkydomeTexture) {
		skydomeTexture = new THREE.TextureLoader().load("images/skydomeTexture.png");
		skydomeTexture.magFilter = THREE.NearestFilter;
		skydomeTexture.minFilter = THREE.NearestFilter;
		skydomeTexture.wrapS = skydomeTexture.wrapT = THREE.RepeatWrapping;
		skydomeTexture.repeat.set(4, 4);

		ud.materials.lambert_material.map = skydomeTexture;
		ud.materials.lambert_material.color = 0x000000;
		ud.materials.lambert_material.needsUpdate = true;
		ud.applySkydomeTexture = false;
	}
}

/////////////
/* DISPLAY */
/////////////
function render() {
	'use strict';

	renderer.render(scene, camera);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
	'use strict';
	const scaling = 2*SCALE;
	/*	
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.x = 300;
		camera.position.y = 500;
		camera.position.z = 300;
		camera.lookAt(scene.position);
	*/

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
	camera.position.x = 60 * scaling;
	camera.position.y = 90 * scaling;
	camera.position.z = 60 * scaling;
	camera.lookAt(scene.position);

	/*
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
	camera.position.x = 0 * scaling;
	camera.position.y = 40 * scaling;
	camera.position.z = 50 * scaling;
	camera.lookAt(0, 40, 0);
	*/
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
	'use strict';

	scene = new THREE.Scene();

	createAmbientLight();

	createPlane(0, -40*SCALE, 0);
	createSkydome(0, 0, 0);

	createOVNI(0, 70*SCALE, 0);

	createMoon(-150*SCALE, 150*SCALE, 30*SCALE);
	createCorkTree(0, -5*SCALE, 40*SCALE);
	createCorkTree(40*SCALE, -15*SCALE, 0);
	createCorkTree(40*SCALE, 0*SCALE, 40*SCALE);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
	'use strict';

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));

	createScene();
	createCamera();

	clock = new THREE.Clock();

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
	'use strict';

	var delta = clock.getDelta();

	rotateOVNI(delta);
	moveOVNI(delta);
	handleOVNILights();

	createPlaneTexture();
	createSkydomeTexture();

	render();

	controls.update();

	renderer.setAnimationLoop(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
	'use strict';

	renderer.setSize(window.innerWidth, window.innerHeight);

	if (window.innerHeight > 0 && window.innerWidth > 0) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
	'use strict';

	switch (e.keyCode) {
		case 38: // arrow-up
			ovni.userData.move_minus_z = true;
			break;
		case 40: // arrow-down
			ovni.userData.move_plus_z = true;
			break;
		case 37: // arrow-left
			ovni.userData.move_minus_x = true;
			break;
		case 39: // arrow-right
			ovni.userData.move_plus_x = true;
			break;
		case 68: //D
		case 100: //d
			toggleDirectionalLight();
			break;
		case 80: // P
		case 112: // p
			ovni.userData.pointLightsChange = true;
			break;
		case 83: // S
		case 115: // s
			ovni.userData.spotLightChange = true;
			break;
		case 49: // 1
			plane.userData.apllyPlaneTexture = true;
			break;
		case 50: // 2
			skydome.userData.applySkydomeTexture = true;
			break;
	}

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
	'use strict';

	switch (e.keyCode) {
		case 38: // arrow-up
			ovni.userData.move_minus_z = false;
			break;
		case 40: // arrow-down
			ovni.userData.move_plus_z = false;
			break;
		case 37: // arrow-left
			ovni.userData.move_minus_x = false;
			break;
		case 39: // arrow-right
			ovni.userData.move_plus_x = false;
			break;
		case 80: // P
		case 112: // p
			ovni.userData.pointLightsChange = false;
			break;
		case 83: // S
		case 115: // s
			ovni.userData.spotLightChange = false;
			break;
	}

}
