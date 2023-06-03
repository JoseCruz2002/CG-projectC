//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, camera;

var mesh, geometry;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createAmbientLight() {
    'use strict';

    const light = new THREE.AmbientLight({color: 0xffe000, intensity: 3}); // soft white light
	scene.add(light);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createOVNIbody(obj, x, y, z) {
    'use strict';

    var ud = obj.userData;

    geometry = new THREE.SphereGeometry();
    geometry.scale(ud.r_body*2, ud.h_body, ud.r_body*2);
    mesh = new THREE.Mesh(geometry, ud.materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createOVNIcockpit(obj, x, y, z) {
    'use strict';

    var ud = obj.userData;

    geometry = new THREE.SphereGeometry();
    geometry.scale(ud.r_body*2, ud.h_body, ud.r_body*2);
    mesh = new THREE.Mesh(geometry, ud.materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createOVNI(x, y, z) {
    'use strict';

    var ovni = new THREE.Object3D();

    var lambert_material = new THREE.MeshLambertMaterial({color: 0xff0000, emissive: 20});
    var phong_material = new THREE.MeshPhongMaterial({color: 0xffaa22, emissive: 20, specular: 15, shininess: 5});
    var toon_material = new THREE.MeshToonMaterial({color: 0xffaa22});

    ovni.userData = {materials: {lambert_material, phong_material, toon_material}, r_body: 20, h_body: 10};

    createOVNIbody(ovni, 0, 0, 0);
    //createOVNIcockpit(ovni, );
    //createOVNIcylinder(ovni, );
    //createOVNIlight(ovni, );
    //createOVNIlight(ovni, );
    //createOVNIlight(ovni, );
    //createOVNIlight(ovni, );

    ovni.position.set(x, y, z);
    scene.add(ovni);
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);
}

function createCamera() {
    'use strict';

    //perspective camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 100;
	camera.position.y = 100;
	camera.position.z = 100;
	camera.lookAt(scene.position);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(100));
    //scene.background = new THREE.Color(0xfffefe);

    createAmbientLight();
    createOVNI(0, 0, 0);
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
    render();
    //update
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
function onKeyUp(e){
    'use strict';

}