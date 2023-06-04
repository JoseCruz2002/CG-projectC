//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, camera;

var mesh, geometry;

var clock;

// objects
var ovni, plane;

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight() {
	'use strict';

	const light = new THREE.AmbientLight({ color: 0xffe000, intensity: 3 }); // soft white light
	scene.add(light);
}

//////////////////////////////////////
/* CREATE THE PLANE AND THE SKYDOME */
//////////////////////////////////////
function createPlane() {
	'use strict';

	plane = new THREE.Object3D();

	var lambert_material = new THREE.MeshLambertMaterial({ color: 0x585c3d, emissive: 0x22331e });
	var phong_material = new THREE.MeshPhongMaterial({ color: 0xffaa22, emissive: 0x242923, specular: 15, shininess: 5 });
	var toon_material = new THREE.MeshToonMaterial({ color: 0xffaa22 });
/*
	var disMap = new THREE.TextureLoader().setPath("images/").load("heightmap.png");
	disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
	disMap.repeat.set(100, 100);
*/
	plane.userData = {
		materials: { lambert_material, phong_material, toon_material }
	}

	geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 30, 30 );
	mesh = new THREE.Mesh(geometry, plane.userData.materials.lambert_material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.set(0, -10, 0);
	plane.add(mesh);
	
	scene.add(plane);

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
	scene.add(ud.spotLight.target);
	ud.spotLight.target.position.set(x, y - 100, z);
	obj.add(mesh);
}

function createOVNIlight(obj, x, y, z) {
	'use strict';

	var ud = obj.userData;

	geometry = new THREE.SphereGeometry(ud.r_light);
	mesh = new THREE.Mesh(geometry, ud.materials_light.lambert_material_light);
	mesh.position.set(x, y, z);
	mesh.add(ud.pointLight);
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

	ovni.userData = {
		materials_body: { lambert_material_body, phong_material_body, toon_material_body },
		materials_cc: { lambert_material_cc, phong_material_cc, toon_material_cc },
		materials_light: { lambert_material_light, phong_material_light, toon_material_light },
		r_body: 5, h_body: 3,
		r_cockpit: 2,
		r_cylinder: 2, h_cylinder: 1.5,
		r_light: 1,
		y_rotate: Math.PI / 2,
		move_plus_x: false, move_minus_x: false, move_plus_z: false, move_minus_z: false,
		velocity: 10,
		pointLight: new THREE.PointLight({ color: 0x610000, intensity: 2 }), pointLightsChange: false, pointLightsChanged: false,
		spotLight: new THREE.SpotLight({ color: 0x323857, intensity: 5 }), spotLightChange: false, spotLightChanged: false
	};

	createOVNIbody(ovni, 0, 0, 0);
	createOVNIcockpit(ovni, 0, ovni.userData.h_body, 0);
	createOVNIcylinder(ovni, 0, -ovni.userData.h_body, 0);
	createOVNIlight(ovni, 0, -ovni.userData.h_body / 1.6, ovni.userData.r_body / 1.5);
	createOVNIlight(ovni, ovni.userData.r_body / 1.5, -ovni.userData.h_body / 1.6, 0);
	createOVNIlight(ovni, 0, -ovni.userData.h_body / 1.6, -ovni.userData.r_body / 1.5);
	createOVNIlight(ovni, -ovni.userData.r_body / 1.5, -ovni.userData.h_body / 1.6, 0);

	ovni.position.set(x, y, z);
	scene.add(ovni);
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
		//ovni.position.z -= ud.velocity * delta;
		z_motion -= 1;
	}
	if (ud.move_plus_z) {
		//ovni.position.z += ud.velocity * delta;
		z_motion += 1;
	}
	if (ud.move_minus_x) {
		//ovni.position.x -= ud.velocity * delta;
		x_motion -= 1;
	}
	if (ud.move_plus_x) {
		//ovni.position.x += ud.velocity * delta;
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
		ud.pointLight.visible = !ud.pointLight.visible;
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

	//perspective camera
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 300;
	camera.position.y = 500;
	camera.position.z = 300;
	camera.lookAt(scene.position);
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
	'use strict';

	scene = new THREE.Scene();

	scene.add(new THREE.AxesHelper(50));
	//scene.background = new THREE.Color(0xfffefe);

	createPlane();
	createAmbientLight();
	createOVNI(0, 30, 0);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
	'use strict';

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCamera();

	clock = new THREE.Clock();

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

	render();

	requestAnimationFrame(animate);
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
			ovni.userData.move_plus_z = true;
			break;
		case 40: // arrow-down
			ovni.userData.move_minus_z = true;
			break;
		case 37: // arrow-left
			ovni.userData.move_minus_x = true;
			break;
		case 39: // arrow-right
			ovni.userData.move_plus_x = true;
			break;
		case 80: // P
		case 112: // p
			ovni.userData.pointLightsChange = true;
			break;
		case 83: // S
		case 115: // s
			ovni.userData.spotLightChange = true;
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
			ovni.userData.move_plus_z = false;
			break;
		case 40: // arrow-down
			ovni.userData.move_minus_z = false;
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
