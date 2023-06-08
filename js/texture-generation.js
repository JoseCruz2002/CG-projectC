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

	const light = new THREE.AmbientLight(0x404040, 10 ); // soft white light
	scene.add(light);
}


/////////////////////
/* CREATE TEXTURES */
/////////////////////
function createPlaneCanvas() {
	'use strict';

	var planeCanvas = document.createElement('canvas');
	var ctx = planeCanvas.getContext('2d');

	document.body.appendChild(planeCanvas);

	planeCanvas.width = 256;
	planeCanvas.height = 256;

	ctx.fillStyle = '#004400';
	ctx.fillRect(0, 0, planeCanvas.width, planeCanvas.height);

	const flowerColors = ['#ffffff', '#fec901', '#b57edc', '#ADD8E6'];
	const FLOWER_RADIUS = 0.8;

	for (let i = 0; i < flowerColors.length; i++) {
		ctx.fillStyle = flowerColors[i];
		ctx.beginPath();

		for (let j = 0; j < 100; j++) {
			const coords = { x: Math.random() * planeCanvas.width, y: Math.random() * planeCanvas.height };
			ctx.save();
			ctx.translate(coords.x + FLOWER_RADIUS, coords.y);
			ctx.moveTo(0, 0);
			ctx.arc(0, 0, FLOWER_RADIUS, 0, Math.PI * 2);
			ctx.restore();
		}

		ctx.stroke();
		ctx.fill();
	}

	var planeTexture = new THREE.CanvasTexture(planeCanvas);
	planeTexture.magFilter = THREE.NearestFilter;
	planeTexture.minFilter = THREE.NearestFilter;
	planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
	planeTexture.repeat.set(4, 4);

	const geometry = new THREE.PlaneGeometry(100, 100, 30, 30);
	const material = new THREE.MeshStandardMaterial({ map: planeTexture });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.set(0, 0, 50);
	scene.add(mesh);

}

function createSkydomeCanvas() {
	'use strict';

	var skydomeCanvas = document.createElement('canvas');
	var ctx = skydomeCanvas.getContext('2d');

	document.body.appendChild(skydomeCanvas);

	skydomeCanvas.width = 256;
	skydomeCanvas.height = 256;

	ctx.fillStyle = '#000022';
	ctx.fillRect(0, 0, skydomeCanvas.width, skydomeCanvas.height);

	const starsColor = '#ffffff';
	const STAR_RADIUS = 0.8;

	ctx.fillStyle = starsColor;
	ctx.beginPath();

	for (let i = 0; i < 100; i++) {
		const coords = { x: Math.random() * skydomeCanvas.width, y: Math.random() * skydomeCanvas.height };
		ctx.save();
		ctx.translate(coords.x + STAR_RADIUS, coords.y);
		ctx.moveTo(0, 0);
		ctx.arc(0, 0, STAR_RADIUS, 0, Math.PI * 2);
		ctx.restore();
	}

	ctx.stroke();
	ctx.fill();

	var skydomeTexture = new THREE.CanvasTexture(skydomeCanvas);
	skydomeTexture.magFilter = THREE.NearestFilter;
	skydomeTexture.minFilter = THREE.NearestFilter;
	skydomeTexture.wrapS = skydomeTexture.wrapT = THREE.RepeatWrapping;
	skydomeTexture.repeat.set(4, 4);

	const geometry = new THREE.PlaneGeometry(100, 100, 30, 30);
	const material = new THREE.MeshStandardMaterial({ map: skydomeTexture });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.set(0, 0, -50);
	scene.add(mesh);

}



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

	createLight();
	createPlaneCanvas();
	createSkydomeCanvas();
}

function createCamera() {
	'use strict';

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 30;
	camera.position.z = 0;
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