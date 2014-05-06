//Global Variables
var world, 
    canvas, 
    renderer,
    camera,
    controls;


var trucksToLoad = 1;
var carsToLoad = 0;
var objectsToLoad = 1 + carsToLoad + trucksToLoad;

var street;
var trucks = new Array();
var cars = new Array();

function onLoadComplete() {
    setupWorld();
    loadObjects();
}

function setupWorld() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    world = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild( renderer.domElement );

    //Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 0.1;
    camera.position.y = 0.1;
    camera.position.x = 0.1;


    //Controls
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68]; 


    light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(30, 30, 30);
    light2 = new THREE.AmbientLight(0xffffff); // soft white light
    light3 = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    world.add(light3);
    world.add(camera);

    controls.addEventListener('change', draw);
    window.addEventListener( 'resize', onWindowResize, false );
}

function loadObjects() {
    loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('models/streets.dae', streetLoaded);
    for (var i = trucksToLoad - 1; i >= 0; i--) {
        loader.load('models/truck.dae', truckLoaded);
    };
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function streetLoaded( collada ) {
    street = collada.scene;
    world.add(street);
    street.position.y = street.position.y - 0.01;
    objectsToLoad--;
    if(objectsToLoad <= 0){
        animate();  
    }
}

function truckLoaded( collada ) {
    trucks[trucks.length] = truck = collada.scene;
    world.add(truck);
    objectsToLoad--;
    truck.position.z = -0.005 + truck.position.z - 0.01 * (trucks.length -1);
    if(objectsToLoad <= 0){
        animate();  
    }
}

function draw() {
    renderer.render(world, camera);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    //console.log('Camera Position: ' + camera.position.x + ' : ' + camera.position.y + ' : ' + camera.position.z);
}