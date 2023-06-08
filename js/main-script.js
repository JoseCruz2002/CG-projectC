//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, camera;

var mesh, geometry;

var clock;

var planeTexture, skydomeTexture;

// objects
var ovni, plane, skydome;

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight() {
	'use strict';

	const light = new THREE.AmbientLight({ color: 0xffe000, intensity: 1 }); // soft white light
	scene.add(light);
}

//////////////////////////////////////
/* CREATE THE PLANE AND THE SKYDOME */
//////////////////////////////////////
function createPlane(x, y, z) {
	'use strict';

	plane = new THREE.Object3D();

	geometry = new THREE.PlaneGeometry(window.innerWidth / 2, window.innerHeight / 2, 30, 30);

	var disMap = new THREE.TextureLoader().setPath("images/").load("heightmap.png");
	disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
	disMap.repeat.set(10, 10);

	var lambert_material = new THREE.MeshLambertMaterial({ color: 0x009900, displacementMap: disMap, displacementScale: 200 });
	var phong_material = new THREE.MeshPhongMaterial({ color: 0xffaa22, emissive: 0x242923, specular: 15, shininess: 5 });
	var toon_material = new THREE.MeshToonMaterial({ color: 0xffaa22 });

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

	geometry = new THREE.SphereGeometry(250, 32, 16, 0, Math.PI * 2, Math.PI, Math.PI);
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

	var pointLight1 = new THREE.PointLight({ distance: 200 });
	var pointLight2 = new THREE.PointLight({ distance: 200 });
	var pointLight3 = new THREE.PointLight({ distance: 200 });
	var pointLight4 = new THREE.PointLight({ distance: 200 });

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
		velocity: 30,
		pointLights: [pointLight1, pointLight2, pointLight3, pointLight4],
		pointLightsChange: false, pointLightsChanged: false,
		spotLight: new THREE.SpotLight({ color: 0x323857, intensity: 10, distance: 100 }), spotLightChange: false, spotLightChanged: false
	};

	scene.add(ovni.userData.spotLight.target);
	ovni.userData.spotLight.target.position.set(0, -10, 0);
	ovni.userData.spotLight.angle = Math.PI / 5;
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
	const scaling = 2;
	//perspective camera
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
	camera.position.x = 70 * scaling;
	camera.position.y = 100 * scaling;
	camera.position.z = 70 * scaling;
	camera.lookAt(0, 40, 0);
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
	'use strict';

	scene = new THREE.Scene();

	scene.add(new THREE.AxesHelper(250));

	createAmbientLight();

	createPlane(0, -5, 0);
	createSkydome(0, 0, 0);

	createOVNI(0, 120, 0);
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

	createPlaneTexture();
	createSkydomeTexture();

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
