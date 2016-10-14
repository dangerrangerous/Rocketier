var Colors =
{
    darkBrown: 0x23190F,
    brown: 0xA52A2A,
    red: 0xF72C25,
    yellow: 0xF9C764,
    blue: 0xA9E5BB,
    white: 0xFAFAC8,
    pink: 0xBA55D3,
    grey: 0xA9A9A9,
};

// ThreeJS setup variables
 var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, 
     renderer, container;

// Screen and mouse 
var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };
    
// Initialize threejs, screen and mouse events
function createScene()
{
    // Get height and width of screen to set up aspect ration of camera
    // and size of renderer
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    // Create the scene
    scene = new THREE.Scene();
    // camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
        );
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    // set position of camera
    camera.position.x = 0;
    camera.position.y = 200;
    camera.position.z = 100;
    // create the renderer
    renderer = new THREE.WebGLRenderer({
    // allow transparency to show background
    alpha: true,
    // use anti-aliasing... not optimal for performance
    // but we are keeping a low poly count
    antialias: true
    });
    // Define the size of the renderer
    renderer.setSize(WIDTH, HEIGHT);
    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    // Add DOM element of the renderer to the element
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    // if User resizes screen
    window.addEventListener('resize', handleWindowResize, false);
}

// Handle screen events
function handleWindowResize()
{
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

// Let there be lights
var ambientLight, hemisphereLight, shadowLight;

function createLights()
{
// hemisphere light is gradient colored, sky - ground - intensity
hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x2310f, .9);

// directional light
shadowLight = new THREE.DirectionalLight(0xffffff, .9);

// set direction of light
shadowLight.position.set(150, 350, 350);

// allow shadow casting
shadowLight.castShadow = true;

// define the visible area of projected shadow
shadowLight.shadow.camera.left = -400;
shadowLight.shadow.camera.right = 400;
shadowLight.shadow.camera.top = 400;
shadowLight.shadow.camera.bottom = -400;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 1000;

// define resolution of the shadow, higher = more performance cost
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;

// add lights to scene to activate them
scene.add(hemisphereLight);
scene.add(shadowLight);
}

// Let there be a vehicle
// note: we can upload external 3D models... programming primitives
// feels_bad_man.jpg
var Rocket = function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "rocket";
    // create fuselage
    var geomFuselage = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    var matFuselage = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
    var fuselage = new THREE.Mesh(geomFuselage, matFuselage);
    fuselage.castShadow = true;
    fuselage.receiveShadow = true;
    this.mesh.add(fuselage);
    
    // create nose cone
    var geomNoseCone = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matNoseCone = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var noseCone = new THREE.Mesh(geomNoseCone, matNoseCone);
    noseCone.position.x = 30;
    noseCone.castShadow = true;
    noseCone.receiveShadow = true;
    this.mesh.add(noseCone);
    
    var geomNoseCone2 = new THREE.BoxGeometry(20, 30, 30, 1, 1, 1);
    var matNoseCone2 = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var noseCone2 = new THREE.Mesh(geomNoseCone2, matNoseCone2);
    noseCone2.position.x = 50;
    noseCone2.castShadow = true;
    noseCone2.receiveShadow = true;
    this.mesh.add(noseCone2);
    
    var geomNoseCone3 = new THREE.BoxGeometry(20, 15, 15, 1, 1, 1);
    var matNoseCone3 = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var noseCone3 = new THREE.Mesh(geomNoseCone3, matNoseCone3);
    noseCone3.position.x = 60;
    noseCone3.castShadow = true;
    noseCone3.receiveShadow = true;
    this.mesh.add(noseCone3);
    
    // create Boosters
    var geomBoosters = new THREE.BoxGeometry(20, 55, 55, 1, 1, 1);
    var matBoosters = new THREE.MeshPhongMaterial({color: Colors.darkBrown, shading: THREE.FlatShading});
    var boosters = new THREE.Mesh(geomBoosters, matBoosters);
    boosters.position.x = -40;
    boosters.castShadow = true;
    boosters.receiveShadow = true;
    this.mesh.add(boosters);

    var geomThrusters = new THREE.BoxGeometry(10, 25, 25, 1, 1, 1);
    var matThrusters = new THREE.MeshPhongMaterial({color: Colors.grey, shading: THREE.FlatShading});
    var thrusters = new THREE.Mesh(geomThrusters, matThrusters);
    thrusters.position.x = -50;
    thrusters.castShadow = true;
    thrusters.receiveShadow = true;
    this.mesh.add(thrusters);

    // create tail fins
    var geomTailFin = new THREE.BoxGeometry(15, 50, 5, 1, 1, 1);
    var matTailFin = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var tailFinTop = new THREE.Mesh(geomTailFin, matTailFin);
    tailFinTop.position.set(-38, 20, 0);
    tailFinTop.rotation.z = 20;
    tailFinTop.castShadow = true;
    tailFinTop.receiveShadow = true;
    this.mesh.add(tailFinTop);
    
    var tailFinBot = new THREE.Mesh(geomTailFin, matTailFin);
    tailFinBot.position.set(-38, -20, 0);
    tailFinBot.rotation.z = -20;
    tailFinBot.castShadow = true;
    tailFinBot.receiveShadow = true;
    this.mesh.add(tailFinBot);

    // create side tail fins 
    var geomTailFinSides = new THREE.BoxGeometry(15, 5, 50, 1, 1, 1);
    var matTailFinSides = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var tailFinSides = new THREE.Mesh(geomTailFinSides, matTailFin);
    tailFinSides.position.set(-38, 0, 20);
    tailFinSides.rotation.y = -20;
    tailFinSides.castShadow = true;
    tailFinSides.receiveShadow = true;
    this.mesh.add(tailFinSides);

    var matTailFinSides = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var tailFinFarSides = new THREE.Mesh(geomTailFinSides, matTailFin);
    tailFinFarSides.position.set(-38, 0, -20);
    tailFinFarSides.rotation.y = 20;
    tailFinFarSides.castShadow = true;
    tailFinFarSides.receiveShadow = true;
    this.mesh.add(tailFinFarSides);

    // create window
    var geomWindow = new THREE.BoxGeometry(15, 15, 55, 1, 1, 1);
    var matWindow = new THREE.MeshPhongMaterial({color: Colors.blue, shading: THREE.FlatShading});
    var window = new THREE.Mesh(geomWindow, matWindow);
    window.position.x = 5;
    window.castShadow = true;
    window.receiveShadow = true;
    this.mesh.add(window);
    
    // create window frame
    var geomWindowFrame = new THREE.BoxGeometry(17, 17, 52, 1, 1, 1);
    var matWindowFrame = new THREE.MeshPhongMaterial({color: Colors.darkBrown, shading: THREE.FlatShading});
    var windowFrame = new THREE.Mesh(geomWindowFrame, matWindowFrame);
    windowFrame.position.x = 5;
    windowFrame.castShadow = true;
    windowFrame.receiveShadow = true;
    this.mesh.add(windowFrame);
    
    // create afterburner
    // afterburner element
    var abGeom = new THREE.BoxGeometry(6,6,6);
    var abMat = new THREE.MeshPhongMaterial({color: Colors.yellow, shading: THREE.FlatShading});
    var ab = new THREE.Mesh(abGeom, abMat);
    // align shape of afterburner to it's bottom boundary so it will scale easier
    ab.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
    
    // create container for the afterburner
    var afterburners = new THREE.Object3D();
    
    // create a container for the outside burners, these will be animated
    this.afterburnersOuter = new THREE.Object3D();
    
    // create the outside burners and position them on a grid
    for(var i = 0; i < 12; i++) 
    {
        var a = ab.clone();
        var col = i%3;
        var row = Math.floor(i/3);
        var startPosZ = -4;
        var startPosX = -4;
        a.position.set(startPosX + row*4, 0, startPosZ + col*4);
        this.afterburnersOuter.add(a);
    }
    
    afterburners.add(this.afterburnersOuter);
    
    // create middle afterburner
    var abMidGeom = new THREE.BoxGeometry(12, 4, 2);
    abMidGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
    var abMidTop = new THREE.Mesh(abMidGeom, abMat);
    var abMidBot = abMidTop.clone();
    abMidTop.position.set(-4, 6, 6);
    abMidBot.position.set(-4, -6, -6);
    afterburners.add(abMidTop);
    afterburners.add(abMidBot);
    
    
};

Rocket.prototype.updateAfterburners = function() {
    // get the afterburners
    var afterburners = this.afterburnersOuter.children;
    
    // update their angles
    var length = afterburners.length;
    for(var i = 0; i < length; i++)
    {
        var aburn = afterburners[i];
        // each afterburner element will scale on a cyclical basis
        // between 75% and 100%. Adjust these values
        aburn.scale.y = .75 + Math.cos(this.angleBurners+i/3) * 0.25;
    }
    
    // increment the angle for the next frame
    this.angleBurners += 0.19;
}


// Let there be a place for the vehicle
Sky = function()
{
    // create empty container
    this.mesh = new THREE.Object3D();

    // choose a number of clouds to be scattered in teh sky
    this.nClouds = 30;
    this.clouds = [];
    // distribute clouds according to uniform angles
    var stepAngle = Math.PI * 2 / this.nClouds;

    // create the clouds
    for(var i = 0; i < this.nClouds; i++)
    {
        var c = new Cloud();
        this.clouds.push(c);
        // set the rotation and position of each cloud
        var a = stepAngle * i;
        var h = 750 + Math.random() * 200;

        // convert angle,distance to x,y values
        c.mesh.position.y = Math.sin(a) * h;
        c.mesh.position.x = Math.cos(a) * h;

        // rotate the cloud according to its position
        c.mesh.rotation.z = a + Math.PI / 2;

        // position clouds at random depths within the scene
        c.mesh.position.z = -400 - Math.random() * 400;

        // we also set random scale for each cloud
        // note: all of these randoms, PI's, and divisions could be optimized
        var s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);

        // do not forget to add the mesh of each cloud in the scene
        this.mesh.add(c.mesh);
    }
}

// Let life come from the sea
Sea = function()
{
    // create geometry
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // rotate the geometry on teh x axis
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // create material
    var material = new THREE.MeshPhongMaterial(
    {
        color: Colors.blue,
        transparent:true,
        opacity:.6,
        shading:THREE.FlatShading,
    });

    // create a mesh for the object
    this.mesh = new THREE.Mesh(geometry, material);

    // allow sea to receive shadows
    this.mesh.receiveShadow = true;
}

// Let the sea fill the sky
Cloud = function()
{
    // create empty container to hold the different parts of the cloud
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";
    // create a cube geometry to be duplicated
    var geometry = new THREE.BoxGeometry(20, 20, 20);

    // create a material
    var material = new THREE.MeshPhongMaterial(
        {
        color:Colors.white,
        });

    // duplicate the geometry a random number of times
    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for(var i = 0; i < nBlocs; i++)
    {
        var m = new THREE.Mesh(geometry.clone(), material);
        // set position and rotation of each cube randomly
        m.position.x = i*15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        // set the size of the cube randomly
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);

        // allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;

        // add the cobe to the container
        this.mesh.add(m);
    }
}

// instantiate teh models
var sea;
var rocket;

// call our mesh constructors
function createRocket()
{
    rocket = new Rocket();
    rocket.mesh.scale.set(.25, .25, .25);
    rocket.mesh.position.y = 100;
    scene.add(rocket.mesh);
}

function createSea()
{
    sea = new Sea();

    // push it towards bottom of screen
    sea.mesh.position.y = -600;

    // add mesh to scene
    scene.add(sea.mesh);
}

function createSky()
{
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}

function loop()
{
    // TODO: create rocket thrust effect
     updateRocket();
    // rotate some meshes        
    sea.mesh.rotation.z += .005;
    sky.mesh.rotation.z += 0.01;
   
    // render the scene
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
/*
// TODO:
ExhaustPlume = function()
{
    // this will nuke smoke, need an external function 
    var plumeGeometry = new THREE.BoxGeometry(20, 20, 20);
    var plumeMaterial = new THREE.MeshPhongMaterial({colors: Colors.white, shading: THREE.FlatShading});
    var plume = new THREE.Mesh(plumeGeometry, plumeMaterial);
    plume.position.x = -40;
    this.mesh.add(plume);
} 
*/

function updateRocket()
{
    // normalize rocket position, play with these values
    var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
    var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
    
    // update rocket's position
    rocket.mesh.position.y = targetY;
    rocket.mesh.position.x = targetX;
    // TODO: thruster animation goes here

}

function normalize(v, vmin, vmax, tmin, tmax)
{
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv-vmin)/dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);

    return tv;
}

function init(event)
{
    // add listener
    document.addEventListener('mousemove', handleMouseMove, false);
    createScene();
    createLights();
    // add objects
    createRocket();
    createSea();
    createSky();
    // game loop
    loop();
}

// Handle mouse events
var mousePos = { x: 0, y: 0 };

function handleMouseMove(event)
{
    // normalize mouse input
    var mouseX = -1 + (event.clientX / WIDTH) * 2;
    // inverse for vertical axis
    var mouseY = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = {x: mouseX, y: mouseY};
}

window.addEventListener('load', init, false);