//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, renderer, camera;



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
	'use strict';

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLight() {
	'use strict';

	const light = new THREE.AmbientLight(0x404040); // soft white light
	scene.add(light);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createTexture() {
	'use strict';

	const texture = 2;
}


////////////
/* UPDATE */
////////////

/////////////
/* DISPLAY */
/////////////
function render() {
	'use strict';

	renderer.render(scene, camera);

}

function createScene() {
	'use strict';

	scene = new THREE.Scene();

	scene.add(new THREE.AxesHelper(100));
	scene.background = new THREE.Color(0xffeeff);

	createLight();
	//createGroundTexture();
}

function createCamera() {
	'use strict';

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = window.innerWidth;
	camera.position.y = window.innerHeight;
	camera.position.z = window.innerWidth;
	camera.lookAt(scene.position);
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
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
	'use strict';

	// update

	render();

	requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
	'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
	'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
	'use strict';

}